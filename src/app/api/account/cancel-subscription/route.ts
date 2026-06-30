import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import { sendCancellationConfirmation } from "@/lib/emails/cancellation";

export const runtime = "nodejs";

/**
 * Annulation en 1 clic : on ne révoque jamais l'accès immédiatement, on
 * désactive juste le renouvellement (cancel_at_period_end). L'utilisateur
 * garde l'accès jusqu'à la fin de la période déjà payée, et plus aucun
 * prélèvement n'aura lieu ensuite.
 */
export async function POST() {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe non configuré." }, { status: 503 });
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_subscription_id, current_period_end, email")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.stripe_subscription_id) {
    return NextResponse.json({ error: "Aucun abonnement actif." }, { status: 404 });
  }

  const sub = await stripe.subscriptions.update(profile.stripe_subscription_id, {
    cancel_at_period_end: true,
  });

  const currentPeriodEnd = (sub as unknown as { current_period_end?: number }).current_period_end ?? null;
  const accessUntilIso = currentPeriodEnd
    ? new Date(currentPeriodEnd * 1000).toISOString()
    : profile.current_period_end;

  await supabase
    .from("profiles")
    .update({ cancel_at_period_end: true, current_period_end: accessUntilIso })
    .eq("id", user.id);

  const accessUntilLabel = accessUntilIso
    ? new Date(accessUntilIso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
    : "la fin de la période en cours";

  const to = profile.email ?? user.email;
  if (to) {
    try {
      await sendCancellationConfirmation(to, accessUntilLabel);
    } catch (err) {
      console.error("[/api/account/cancel-subscription] envoi email échoué:", err);
    }
  }

  return NextResponse.json({ success: true, accessUntil: accessUntilIso });
}
