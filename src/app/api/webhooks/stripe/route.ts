import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { stripe } from "@/lib/stripe";
import type Stripe from "stripe";

export const runtime = "nodejs";

function getAdminClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

function mapStripeStatus(status: Stripe.Subscription.Status): string {
  if (status === "active" || status === "trialing") return status;
  if (status === "past_due" || status === "unpaid") return "past_due";
  return "canceled";
}

async function getUserIdFromCustomer(customerId: string): Promise<string | null> {
  const admin = getAdminClient();
  const { data } = await admin.from("profiles").select("id").eq("stripe_customer_id", customerId).single();
  return data?.id ?? null;
}

async function resolveUserId(sub: Stripe.Subscription): Promise<string | null> {
  return sub.metadata?.user_id ?? (await getUserIdFromCustomer(sub.customer as string));
}

async function applySubscriptionState(userId: string, sub: Stripe.Subscription) {
  const admin = getAdminClient();
  const currentPeriodEnd = (sub as unknown as { current_period_end?: number }).current_period_end ?? null;
  const interval = sub.items.data[0]?.price.recurring?.interval === "week" ? "week" : "month";

  await admin
    .from("profiles")
    .update({
      plan_status: mapStripeStatus(sub.status),
      plan_interval: interval,
      stripe_subscription_id: sub.id,
      current_period_end: currentPeriodEnd ? new Date(currentPeriodEnd * 1000).toISOString() : null,
      cancel_at_period_end: sub.cancel_at_period_end,
    })
    .eq("id", userId);
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

  const admin = getAdminClient();

  // Idempotence : un évènement Stripe peut être livré plusieurs fois (retries).
  // On n'applique jamais deux fois le même évènement — c'est ce qui évite un
  // double traitement (et donc tout risque de double-facturation côté business logic).
  const { error: insertError } = await admin
    .from("stripe_events")
    .insert({ id: event.id, type: event.type });
  if (insertError) {
    // Conflit de clé primaire = évènement déjà traité.
    return NextResponse.json({ received: true, duplicate: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (typeof session.subscription === "string" && session.metadata?.user_id) {
          const sub = await stripe.subscriptions.retrieve(session.subscription);
          await applySubscriptionState(session.metadata.user_id, sub);
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = await resolveUserId(sub);
        if (userId) await applySubscriptionState(userId, sub);
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = await resolveUserId(sub);
        if (userId) {
          await admin
            .from("profiles")
            .update({ plan_status: "canceled", cancel_at_period_end: false, current_period_end: null })
            .eq("id", userId);
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = typeof invoice.customer === "string" ? invoice.customer : null;
        if (customerId) {
          const userId = await getUserIdFromCustomer(customerId);
          if (userId) {
            await admin.from("profiles").update({ plan_status: "past_due" }).eq("id", userId);
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
