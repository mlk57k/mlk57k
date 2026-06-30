import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";
import type Stripe from "stripe";

export const runtime = "nodejs";

const TRIAL_PERIOD_DAYS = 3;

let _prices: { weekly: string; monthly: string } | null = null;

async function getPriceIds(): Promise<{ weekly: string; monthly: string }> {
  if (_prices) return _prices;

  const envWeekly = process.env.STRIPE_PRICE_ID_WEEKLY;
  const envMonthly = process.env.STRIPE_PRICE_ID_MONTHLY;
  if (envWeekly && envMonthly) {
    _prices = { weekly: envWeekly, monthly: envMonthly };
    return _prices;
  }

  const stripe = getStripe();
  const existing = await stripe.prices.list({ limit: 100, active: true });
  const weekly = existing.data.find((p) => p.metadata?.app === "ancrage" && p.metadata?.plan === "weekly");
  const monthly = existing.data.find((p) => p.metadata?.app === "ancrage" && p.metadata?.plan === "monthly");

  if (weekly && monthly) {
    _prices = { weekly: weekly.id, monthly: monthly.id };
    return _prices;
  }

  const product = await stripe.products.create({
    name: "Ancrage — Journaling illimité",
    description: "Entrées de journal illimitées, bilans hebdomadaires, et mémoire des sessions précédentes.",
    metadata: { app: "ancrage" },
  });

  const [weeklyPrice, monthlyPrice] = await Promise.all([
    stripe.prices.create({
      product: product.id,
      unit_amount: 499,
      currency: "eur",
      recurring: { interval: "week" },
      nickname: "Hebdomadaire — 4,99 €/semaine",
      metadata: { app: "ancrage", plan: "weekly" },
    }),
    stripe.prices.create({
      product: product.id,
      unit_amount: 1499,
      currency: "eur",
      recurring: { interval: "month" },
      nickname: "Mensuel — 14,99 €/mois",
      metadata: { app: "ancrage", plan: "monthly" },
    }),
  ]);

  _prices = { weekly: weeklyPrice.id, monthly: monthlyPrice.id };
  return _prices;
}

export async function POST(request: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Stripe non configuré." }, { status: 503 });
    }

    let plan: "weekly" | "monthly" | undefined;
    try {
      ({ plan } = await request.json());
    } catch {
      return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
    }

    if (plan !== "weekly" && plan !== "monthly") {
      return NextResponse.json({ error: "Plan invalide." }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;
    const stripe = getStripe();
    const priceIds = await getPriceIds();
    const priceId = plan === "weekly" ? priceIds.weekly : priceIds.monthly;

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .maybeSingle();

    let customerId: string | undefined = profile?.stripe_customer_id ?? undefined;

    if (customerId) {
      try {
        const existing = await stripe.customers.retrieve(customerId);
        if ((existing as { deleted?: boolean }).deleted) customerId = undefined;
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
        .upsert({ id: user.id, email: user.email ?? "", stripe_customer_id: customerId }, { onConflict: "id" });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: TRIAL_PERIOD_DAYS,
        metadata: { user_id: user.id },
      },
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/abonnement`,
      metadata: { user_id: user.id },
    } as Stripe.Checkout.SessionCreateParams);

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[/api/checkout]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
