import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

function getAdminClient() {
  return createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

/**
 * Suppression définitive du compte (droit à l'effacement). Les entrées de
 * journal, messages et bilans hebdomadaires partent en cascade via les
 * clés étrangères "on delete cascade" définies en migration — il suffit
 * de supprimer la ligne auth.users.
 */
export async function POST() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_subscription_id")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.stripe_subscription_id && process.env.STRIPE_SECRET_KEY) {
    try {
      await stripe.subscriptions.cancel(profile.stripe_subscription_id);
    } catch (err) {
      console.error("[/api/account/delete] annulation Stripe échouée:", err);
    }
  }

  const admin = getAdminClient();
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) {
    console.error("[/api/account/delete] suppression échouée:", error);
    return NextResponse.json({ error: "Suppression impossible." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
