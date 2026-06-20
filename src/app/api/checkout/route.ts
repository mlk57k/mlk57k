import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";
import type Stripe from "stripe";

export const runtime = "nodejs";

let _prices: { monthly: string; annual: string } | null = null;

async function getPriceIds(): Promise<{ monthly: string; annual: string }> {
  if (_prices) return _prices;

  const stripe = getStripe();

  const existing = await stripe.prices.list({ limit: 100, active: true });
  const monthly = existing.data.find(
    (p) => p.metadata?.app === "glowy" && p.metadata?.plan === "monthly" && p.metadata?.version === "2"
  );
  const annual = existing.data.find(
    (p) => p.metadata?.app === "glowy" && p.metadata?.plan === "annual" && p.metadata?.version === "2"
  );

  if (monthly && annual) {
    _prices = { monthly: monthly.id, annual: annual.id };
    return _prices;
  }

  const product = await stripe.products.create({
    name: "Glowy — Routine personnalisée",
    description:
      "Accès à ta routine de soin personnalisée par IA, suivi de score et historique des scans.",
    metadata: { app: "glowy" },
  });

  const [monthlyPrice, annualPrice] = await Promise.all([
    stripe.prices.create({
      product: product.id,
      unit_amount: 2480,
      currency: "eur",
      recurring: { interval: "month" },
      nickname: "Mensuel — 24,80 €/mois",
      metadata: { app: "glowy", plan: "monthly", version: "2" },
    }),
    stripe.prices.create({
      product: product.id,
      unit_amount: 17880,
      currency: "eur",
      recurring: { interval: "year" },
      nickname: "Annuel — 14,90 €/mois (178,80 €/an)",
      metadata: { app: "glowy", plan: "annual", version: "2" },
    }),
  ]);

  _prices = { monthly: monthlyPrice.id, annual: annualPrice.id };
  return _prices;
}

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe non configuré." }, { status: 503 });
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  let plan: "monthly" | "annual" | undefined;
  try {
    ({ plan } = await request.json());
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  if (plan !== "monthly" && plan !== "annual") {
    return NextResponse.json({ error: "Plan invalide." }, { status: 400 });
  }

  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://mlk57k.vercel.app";

    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    const stripe = getStripe();
    let customerId: string | undefined = profile?.stripe_customer_id ?? undefined;

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

    const priceIds = await getPriceIds();
    const priceId = plan === "monthly" ? priceIds.monthly : priceIds.annual;

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        metadata: { user_id: user.id },
      },
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout`,
      allow_promotion_codes: true,
      metadata: { user_id: user.id },
    } as Stripe.Checkout.SessionCreateParams);

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur Stripe inconnue.";
    console.error("[checkout]", message);
    return NextResponse.json({ error: `Erreur de paiement : ${message}` }, { status: 500 });
  }
}
