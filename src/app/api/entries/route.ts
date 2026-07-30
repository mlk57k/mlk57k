import { NextResponse } from "next/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { isComped } from "@/lib/comp";

function adminClient() {
  return createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

/** Accorde l'accès complet aux comptes de la liste blanche (une fois). */
async function ensureCompedAccess(userId: string, email: string | null | undefined, currentPlan: string) {
  if (!isComped(email) || currentPlan === "active") return "active";
  if (isComped(email)) {
    await adminClient().from("profiles").update({ plan_status: "active" }).eq("id", userId);
    return "active";
  }
  return currentPlan;
}

export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("journal_entries")
    .select("id, created_at, updated_at, mood_score, content, is_complete")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ entries: data });
}

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const content = typeof body?.content === "string" ? body.content : "";
  const moodScore =
    typeof body?.mood_score === "number" && body.mood_score >= 1 && body.mood_score <= 5
      ? Math.round(body.mood_score)
      : null;

  const { data: initialProfile, error: profileError } = await supabase
    .from("profiles")
    .select("plan_status, free_entries_used, free_entries_reset_at")
    .eq("id", user.id)
    .single();

  let profile = initialProfile;

  // Auto-create profile if missing (trigger may not have fired)
  if (!profile) {
    const admin = adminClient();
    const { data: newProfile, error: insertError } = await admin
      .from("profiles")
      .insert({ id: user.id, email: user.email ?? "" })
      .select("plan_status, free_entries_used, free_entries_reset_at")
      .single();

    if (insertError || !newProfile) {
      console.error("profile insert error", profileError, insertError);
      return NextResponse.json({ error: "profil introuvable" }, { status: 500 });
    }
    profile = newProfile;
  }

  // Accès offert (liste blanche) : passe le compte en illimité au 1er usage
  profile.plan_status = await ensureCompedAccess(user.id, user.email, profile.plan_status);

  // Le quota gratuit s'applique désormais aux confidences (messages au coach),
  // pas à la création d'entrées — commencer une entrée reste libre.

  const { data: entry, error } = await supabase
    .from("journal_entries")
    .insert({ user_id: user.id, content, ...(moodScore ? { mood_score: moodScore } : {}) })
    .select("id, created_at, updated_at, mood_score, content, is_complete")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (content.trim()) {
    await supabase.from("entry_messages").insert({
      entry_id: entry.id,
      user_id: user.id,
      role: "user",
      content,
    });
  }

  return NextResponse.json({ entry });
}
