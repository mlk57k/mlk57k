import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import type Stripe from "stripe";

export const runtime = "nodejs";

/**
 * Vérifie qu'une session Stripe est payée et accorde l'accès immédiatement,
 * sans dépendre du webhook (qui peut être différé). Le webhook reste la
 * source de vérité pour le cycle de vie (renouvellement, annulation).
 */
export async function GET(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe non configuré." }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "session_id manquant." }, { status: 400 });
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const isPaidOrTrialing = session.payment_status === "paid" || session.status === "complete";

  if (!isPaidOrTrialing) {
    return NextResponse.json({ success: false });
  }

  if (session.metadata?.user_id && session.metadata.user_id !== user.id) {
    return NextResponse.json({ error: "Session invalide." }, { status: 403 });
  }

  let interval: "week" | "month" | null = null;
  let status: Stripe.Subscription.Status | null = null;
  let currentPeriodEnd: number | null = null;

  if (typeof session.subscription === "string") {
    const sub = await stripe.subscriptions.retrieve(session.subscription);
    interval = sub.items.data[0]?.price.recurring?.interval === "week" ? "week" : "month";
    status = sub.status;
    currentPeriodEnd = (sub as unknown as { current_period_end?: number }).current_period_end ?? null;
  }

  await supabase
    .from("profiles")
    .update({
      plan_status: status === "trialing" ? "trialing" : "active",
      plan_interval: interval,
      stripe_subscription_id: typeof session.subscription === "string" ? session.subscription : null,
      current_period_end: currentPeriodEnd ? new Date(currentPeriodEnd * 1000).toISOString() : null,
      cancel_at_period_end: false,
    })
    .eq("id", user.id);

  return NextResponse.json({ success: true });
}
