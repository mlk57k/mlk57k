import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const PROMO_CODES: Record<string, { max_uses: number }> = {
  beessap: { max_uses: 3 },
};

function getAdminClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const code =
      typeof body.code === "string" ? body.code.trim().toLowerCase() : "";

    const promoConfig = PROMO_CODES[code];
    if (!promoConfig) {
      return NextResponse.json({ error: "Code promo invalide." }, { status: 400 });
    }

    // Supabase non configuré → validation basique uniquement (preview/dev)
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ success: true });
    }

    // Authentification requise
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Connexion requise pour activer un code promo." }, { status: 401 });
    }

    const admin = getAdminClient();

    // Vérifier si cet utilisateur a déjà un accès à vie (idempotent)
    const { data: profile } = await admin
      .from("profiles")
      .select("lifetime_access, promo_code_used")
      .eq("id", user.id)
      .single();

    if (profile?.lifetime_access) {
      return NextResponse.json({ success: true });
    }

    // Compter les utilisations existantes de ce code
    const { count } = await admin
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("promo_code_used", code);

    if ((count ?? 0) >= promoConfig.max_uses) {
      return NextResponse.json(
        { error: "Ce code a atteint sa limite d'utilisation." },
        { status: 400 }
      );
    }

    // Activer l'accès à vie sur le profil. subscription_status = 'promo' protège
    // cet accès contre toute révocation par le webhook Stripe.
    await admin
      .from("profiles")
      .update({
        lifetime_access: true,
        promo_code_used: code,
        subscription_status: "promo",
      })
      .eq("id", user.id);

    // Débloquer tous les scans existants de cet utilisateur
    await admin
      .from("scans")
      .update({ unlocked: true })
      .eq("user_id", user.id);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }
}
