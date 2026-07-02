import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";
import type Stripe from "stripe";

export const runtime = "nodejs";

const TRIAL_PERIOD_DAYS = 3;

type Plan = "weekly" | "monthly" | "annual";

let _prices: Record<Plan, string> | null = null;

async function getPriceIds(): Promise<Record<Plan, string>> {
  if (_prices) return _prices;

  const envWeekly = process.env.STRIPE_PRICE_ID_WEEKLY;
  const envMonthly = process.env.STRIPE_PRICE_ID_MONTHLY;
  const envAnnual = process.env.STRIPE_PRICE_ID_ANNUAL;
  if (envWeekly && envMonthly && envAnnual) {
    _prices = { weekly: envWeekly, monthly: envMonthly, annual: envAnnual };
    return _prices;
  }

  const stripe = getStripe();
  const existing = await stripe.prices.list({
    lookup_keys: ["ancrage_weekly", "ancrage_monthly_999", "ancrage_annual"],
    active: true,
    limit: 10,
  });
  const byKey = (key: string) => existing.data.find((p) => p.lookup_key === key);
  let weekly = byKey("ancrage_weekly");
  let monthly = byKey("ancrage_monthly_999");
  let annual = byKey("ancrage_annual");

  if (!weekly || !monthly || !annual) {
    const products = await stripe.products.search({ query: 'metadata["app"]:"ancrage"', limit: 1 });
    const product =
      products.data[0] ??
      (await stripe.products.create({
        name: "Ancrage — Journaling illimité",
        description: "Entrées de journal illimitées, bilans hebdomadaires, et mémoire des sessions précédentes.",
        metadata: { app: "ancrage" },
      }));

    const createPrice = (amount: number, interval: "week" | "month" | "year", lookupKey: string, nickname: string) => {
      return stripe.prices.create({
        product: product.id,
        unit_amount: amount,
        currency: "eur",
        recurring: { interval },
        nickname,
        lookup_key: lookupKey,
        metadata: { app: "ancrage", plan: lookupKey },
      });
    };

    weekly = weekly ?? (await createPrice(499, "week", "ancrage_weekly", "Hebdomadaire — 4,99 €/semaine"));
    monthly = monthly ?? (await createPrice(999, "month", "ancrage_monthly_999", "Mensuel — 9,99 €/mois"));
    annual = annual ?? (await createPrice(4999, "year", "ancrage_annual", "Annuel — 49,99 €/an"));
  }

  _prices = { weekly: weekly.id, monthly: monthly.id, annual: annual.id };
  return _prices;
}

export async function POST(request: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Stripe non configuré." }, { status: 503 });
    }

    let plan: Plan | undefined;
    try {
      ({ plan } = await request.json());
    } catch {
      return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
    }

    if (plan !== "weekly" && plan !== "monthly" && plan !== "annual") {
      return NextResponse.json({ error: "Plan invalide." }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;
    const stripe = getStripe();
    const priceIds = await getPriceIds();
    const priceId = priceIds[plan];

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
