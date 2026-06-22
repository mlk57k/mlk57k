import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { stripe } from "@/lib/stripe";
import type Stripe from "stripe";

export const runtime = "nodejs";

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function updateSubscriptionStatus(
  userId: string,
  status: string,
  subscriptionId?: string
) {
  const admin = getAdminClient();
  await admin
    .from("profiles")
    .update({ subscription_status: status, subscription_id: subscriptionId ?? null })
    .eq("id", userId);
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
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const userId =
          sub.metadata?.user_id ??
          (await getUserIdFromCustomer(sub.customer as string));

        if (userId) {
          let status: string;
          if (sub.status === "active") status = "active";
          else if (sub.status === "trialing") status = "trial";
          else if (sub.status === "canceled") status = "cancelled";
          else if (sub.status === "past_due") status = "past_due";
          else status = sub.status;

          await updateSubscriptionStatus(userId, status, sub.id);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const userId =
          sub.metadata?.user_id ??
          (await getUserIdFromCustomer(sub.customer as string));

        if (userId) {
          await updateSubscriptionStatus(userId, "cancelled", sub.id);
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        const userId = await getUserIdFromCustomer(customerId);
        if (userId) {
          await updateSubscriptionStatus(userId, "past_due");
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
