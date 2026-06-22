import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";
import type Stripe from "stripe";

export const runtime = "nodejs";

let _priceId: string | null = null;

async function getOrCreatePrice(): Promise<string> {
  if (_priceId) return _priceId;

  const stripe = getStripe();
  const existing = await stripe.prices.list({ limit: 100, active: true });

  const found = existing.data.find(
    (p) => p.metadata?.app === "libero" && p.metadata?.plan === "monthly"
  );

  if (found) {
    _priceId = found.id;
    return _priceId;
  }

  const product = await stripe.products.create({
    name: "Libero — Coach IA Anti-Addiction",
    description:
      "Coach IA personnalisé (TCC, entretien motivationnel), suivi streak, journal des déclencheurs, plan 4 semaines.",
    metadata: { app: "libero" },
  });

  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: 999,
    currency: "eur",
    recurring: { interval: "month", trial_period_days: 7 },
    nickname: "Mensuel — 9,99€/mois",
    metadata: { app: "libero", plan: "monthly" },
  });

  _priceId = price.id;
  return _priceId;
}

export async function POST(request: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Stripe non configuré." }, { status: 503 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;
    const stripe = getStripe();
    const priceId = await getOrCreatePrice();

    const isSupabaseConfigured = !!(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    if (!isSupabaseConfigured) {
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/pricing`,
      } as Stripe.Checkout.SessionCreateParams);
      return NextResponse.json({ url: session.url });
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    let customerId: string | undefined = profile?.stripe_customer_id ?? undefined;

    if (customerId) {
      try {
        await stripe.customers.retrieve(customerId);
      } catch {
        customerId = undefined;
      }
    }

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email ?? undefined,
        metadata: { user_id: user.id },
      });
      customerId = customer.id;
      await supabase
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: 7,
        metadata: { user_id: user.id },
      },
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/pricing`,
      metadata: { user_id: user.id },
    } as Stripe.Checkout.SessionCreateParams);

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[/api/checkout]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
