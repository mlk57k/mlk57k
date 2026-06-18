import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

/**
 * Vérifie qu'une session Stripe est payée, débloque les scans en base et
 * renvoie l'id du dernier scan de l'utilisateur pour rediriger.
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
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  const isPaid =
    session.payment_status === "paid" ||
    session.status === "complete";

  if (!isPaid) {
    return NextResponse.json({ success: false });
  }

  // Débloque tous les scans de l'utilisateur
  await supabase
    .from("scans")
    .update({ unlocked: true })
    .eq("user_id", user.id);

  // Retourne l'id du dernier scan pour rediriger vers les résultats
  const { data: lastScan } = await supabase
    .from("scans")
    .select("id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return NextResponse.json({ success: true, scan_id: lastScan?.id ?? null });
}
