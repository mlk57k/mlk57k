import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

/**
 * Vérifie qu'une session Stripe est payée, accorde l'accès à l'utilisateur
 * (lifetime_access + déblocage des scans) et renvoie l'id du dernier scan.
 *
 * Cette route est appelée juste après le retour de Stripe : elle accorde
 * l'accès immédiatement, sans dépendre du webhook (qui peut être différé ou
 * non configuré). Le webhook reste la source de vérité pour le cycle de vie
 * (renouvellement, annulation).
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

  const isSupabaseConfigured = !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  // Sans Supabase (preview sans env vars) : vérifie juste le paiement Stripe
  if (!isSupabaseConfigured) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      const isPaid = session.payment_status === "paid" || session.status === "complete";
      return NextResponse.json({ success: isPaid, scan_id: null });
    } catch {
      return NextResponse.json({ success: false });
    }
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

  // Sécurité : la session doit appartenir à cet utilisateur (metadata posée au checkout).
  if (session.metadata?.user_id && session.metadata.user_id !== user.id) {
    return NextResponse.json({ error: "Session invalide." }, { status: 403 });
  }

  // Accorde l'accès à vie + débloque tous les scans, via service role si dispo
  // (cohérent avec le webhook), sinon via le client utilisateur (RLS).
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const admin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    await admin
      .from("profiles")
      .update({
        lifetime_access: true,
        subscription_status: "active",
        stripe_subscription_id:
          typeof session.subscription === "string" ? session.subscription : null,
      })
      .eq("id", user.id);
    await admin.from("scans").update({ unlocked: true }).eq("user_id", user.id);
  } else {
    // Fallback : l'utilisateur ne peut modifier que ses propres scans (RLS).
    await supabase.from("scans").update({ unlocked: true }).eq("user_id", user.id);
  }

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
