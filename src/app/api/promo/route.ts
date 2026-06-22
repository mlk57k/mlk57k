import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const CODE_LIMITS: Record<string, number> = {
  beessap: 3,
};

function getAdminClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Connecte-toi pour utiliser un code promo." }, { status: 401 });
  }

  let body: { code?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const code = typeof body.code === "string" ? body.code.trim().toLowerCase() : "";
  const maxRedemptions = CODE_LIMITS[code];
  if (!maxRedemptions) {
    return NextResponse.json({ error: "Code promo invalide." }, { status: 400 });
  }

  const admin = getAdminClient();

  // Check if this user already activated the code (idempotent)
  const { data: profile } = await admin
    .from("profiles")
    .select("lifetime_access, promo_code_used")
    .eq("id", user.id)
    .single();

  if (profile?.lifetime_access) {
    return NextResponse.json({ success: true });
  }

  // Count how many users have already redeemed this specific code
  const { count } = await admin
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("promo_code_used", code);

  if ((count ?? 0) >= maxRedemptions) {
    return NextResponse.json(
      { error: "Ce code promo a atteint son nombre maximum d'utilisations." },
      { status: 400 }
    );
  }

  // Grant lifetime access (via service role to bypass RLS)
  const { error: profileError } = await admin
    .from("profiles")
    .upsert(
      { id: user.id, lifetime_access: true, promo_code_used: code },
      { onConflict: "id" }
    );

  if (profileError) {
    console.error("[promo] profile update error:", profileError);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }

  // Unlock all existing scans for this user
  await admin.from("scans").update({ unlocked: true }).eq("user_id", user.id);

  return NextResponse.json({ success: true });
}
