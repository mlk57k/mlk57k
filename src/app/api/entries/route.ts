import { NextResponse } from "next/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { consumeFreeEntry } from "@/lib/quota";

function adminClient() {
  return createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
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

  let { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("plan_status, free_entries_used, free_entries_reset_at")
    .eq("id", user.id)
    .single();

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

  const quota = await consumeFreeEntry(supabase, user.id, profile);
  if (!quota.allowed) {
    return NextResponse.json({ error: "quota_exceeded" }, { status: 402 });
  }

  const { data: entry, error } = await supabase
    .from("journal_entries")
    .insert({ user_id: user.id, content })
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

  return NextResponse.json({ entry, remaining: quota.remaining });
}
