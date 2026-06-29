import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { stripe } from "@/lib/stripe";
import type Stripe from "stripe";

export const runtime = "nodejs";

// Client admin (service role) pour contourner la RLS dans le webhook
function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/** Statuts Stripe qui donnent droit à l'accès. */
function isActiveStatus(status: Stripe.Subscription.Status): boolean {
  return status === "active" || status === "trialing";
}

/**
 * Source de vérité de l'accès : met à jour le profil ET (dé)verrouille les scans.
 * `active` accordé → lifetime_access = true + scans débloqués.
 * `active` retiré (annulation, impayé) → lifetime_access = false + scans reverrouillés.
 * Les accès promo (subscription_status = 'promo') ne sont jamais touchés ici.
 */
async function setSubscriptionAccess(
  userId: string,
  active: boolean,
  fields: {
    status?: string;
    subscriptionId?: string | null;
    currentPeriodEnd?: number | null;
  } = {}
) {
  const admin = getAdminClient();

  // Ne pas écraser un accès promo à vie avec une révocation d'abonnement.
  if (!active) {
    const { data: profile } = await admin
      .from("profiles")
      .select("subscription_status")
      .eq("id", userId)
      .single();
    if (profile?.subscription_status === "promo") return;
  }

  const update: Record<string, unknown> = {
    lifetime_access: active,
  };
  if (fields.status !== undefined) update.subscription_status = fields.status;
  if (fields.subscriptionId !== undefined)
    update.stripe_subscription_id = fields.subscriptionId;
  if (fields.currentPeriodEnd !== undefined)
    update.subscription_current_period_end = fields.currentPeriodEnd
      ? new Date(fields.currentPeriodEnd * 1000).toISOString()
      : null;

  await admin.from("profiles").update(update).eq("id", userId);

  // Les scans suivent l'accès : débloqués si actif, reverrouillés sinon.
  await admin.from("scans").update({ unlocked: active }).eq("user_id", userId);
}

async function getUserIdFromCustomer(customerId: string): Promise<string | null> {
  const admin = getAdminClient();
  const { data } = await admin
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single();
  return data?.id ?? null;
}

/** Récupère le user_id depuis les metadata de l'abonnement, sinon via le customer. */
async function resolveUserId(sub: Stripe.Subscription): Promise<string | null> {
  return (
    sub.metadata?.user_id ??
    (await getUserIdFromCustomer(sub.customer as string))
  );
}

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe non configuré." }, { status: 503 });
  }

  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Signature manquante." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("[webhook/stripe] signature invalide:", err);
    return NextResponse.json({ error: "Signature invalide." }, { status: 400 });
  }

  try {
    switch (event.type) {
      // Paiement initial confirmé : on accorde l'accès immédiatement.
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        if (userId) {
          await setSubscriptionAccess(userId, true, {
            status: "active",
            subscriptionId:
              typeof session.subscription === "string" ? session.subscription : null,
          });
        }
        break;
      }

      // Création / mise à jour d'abonnement : l'accès suit le statut réel.
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = await resolveUserId(sub);
        if (userId) {
          await setSubscriptionAccess(userId, isActiveStatus(sub.status), {
            status: sub.status,
            subscriptionId: sub.id,
            currentPeriodEnd:
              (sub as unknown as { current_period_end?: number }).current_period_end ?? null,
          });
        }
        break;
      }

      // Abonnement supprimé (fin d'annulation) : on révoque l'accès.
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = await resolveUserId(sub);
        if (userId) {
          await setSubscriptionAccess(userId, false, {
            status: "canceled",
            subscriptionId: sub.id,
            currentPeriodEnd: null,
          });
        }
        break;
      }

      // Échec de paiement récurrent : on révoque jusqu'à régularisation.
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId =
          typeof invoice.customer === "string" ? invoice.customer : null;
        if (customerId) {
          const userId = await getUserIdFromCustomer(customerId);
          if (userId) {
            await setSubscriptionAccess(userId, false, { status: "past_due" });
          }
        }
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.error("[webhook/stripe] erreur traitement:", err);
    return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
