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

async function unlockUserScans(userId: string) {
  const admin = getAdminClient();
  await admin.from("scans").update({ unlocked: true }).eq("user_id", userId);
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
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        if (userId) await unlockUserScans(userId);
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const userId =
          sub.metadata?.user_id ??
          (await getUserIdFromCustomer(sub.customer as string));
        if (userId && (sub.status === "active" || sub.status === "trialing")) {
          await unlockUserScans(userId);
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
