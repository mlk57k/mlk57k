import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
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
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  if (!profile?.stripe_customer_id) {
    return NextResponse.json({ error: "Aucun abonnement trouvé." }, { status: 404 });
  }

  const stripe = getStripe();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;

  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${appUrl}/settings`,
  });

  return NextResponse.json({ url: session.url });
}
