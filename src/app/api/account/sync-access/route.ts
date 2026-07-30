import { NextResponse } from "next/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { isComped } from "@/lib/comp";
import { sendWelcomeEmail } from "@/lib/emails/welcome";

// Appelé juste après la connexion. Deux rôles :
//  1. accorde l'accès complet aux comptes de la liste blanche (invités/testeurs)
//  2. envoie l'email de bienvenue une seule fois, au tout premier login
export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const admin = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const comped = isComped(user.email);

  // upsert profil (crée la ligne si le trigger n'a pas encore tourné)
  await admin.from("profiles").upsert(
    {
      id: user.id,
      email: user.email ?? "",
      ...(comped ? { plan_status: "active" } : {}),
    },
    { onConflict: "id" }
  );

  // Email de bienvenue : une seule fois, si jamais envoyé
  const { data: profile } = await admin
    .from("profiles")
    .select("welcomed_at")
    .eq("id", user.id)
    .maybeSingle();

  if (profile && !profile.welcomed_at && user.email) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;
    try {
      await sendWelcomeEmail(user.email, appUrl);
      await admin.from("profiles").update({ welcomed_at: new Date().toISOString() }).eq("id", user.id);
    } catch (err) {
      console.error("[sync-access] welcome email failed:", err);
    }
  }

  return NextResponse.json({ comped });
}
