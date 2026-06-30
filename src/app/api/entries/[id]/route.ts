import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data: entry, error } = await supabase
    .from("journal_entries")
    .select("id, created_at, updated_at, mood_score, content, is_complete")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();
  if (error || !entry) return NextResponse.json({ error: "introuvable" }, { status: 404 });

  const { data: messages } = await supabase
    .from("entry_messages")
    .select("id, role, content, created_at")
    .eq("entry_id", params.id)
    .order("created_at", { ascending: true });

  return NextResponse.json({ entry, messages: messages ?? [] });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const update: Record<string, unknown> = {};
  if (typeof body?.content === "string") update.content = body.content;
  if (typeof body?.moodScore === "number") update.mood_score = body.moodScore;
  if (typeof body?.isComplete === "boolean") update.is_complete = body.isComplete;

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "rien à mettre à jour" }, { status: 400 });
  }

  const { data: entry, error } = await supabase
    .from("journal_entries")
    .update(update)
    .eq("id", params.id)
    .eq("user_id", user.id)
    .select("id, updated_at, content, mood_score, is_complete")
    .single();

  if (error || !entry) return NextResponse.json({ error: "introuvable" }, { status: 404 });
  return NextResponse.json({ entry });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { error } = await supabase
    .from("journal_entries")
    .delete()
    .eq("id", params.id)
    .eq("user_id", user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
