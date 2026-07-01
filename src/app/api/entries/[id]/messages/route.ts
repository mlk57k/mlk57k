import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateCoachReply, type CoachMessage } from "@/lib/anthropic";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const content = typeof body?.content === "string" ? body.content.trim() : "";
  if (!content) return NextResponse.json({ error: "message vide" }, { status: 400 });

  const { data: entry, error: entryError } = await supabase
    .from("journal_entries")
    .select("id")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();
  if (entryError || !entry) return NextResponse.json({ error: "introuvable" }, { status: 404 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("objectifs, memory_digest")
    .eq("id", user.id)
    .single();

  const { data: history } = await supabase
    .from("entry_messages")
    .select("role, content")
    .eq("entry_id", params.id)
    .order("created_at", { ascending: true });

  const { data: userMessage, error: insertError } = await supabase
    .from("entry_messages")
    .insert({ entry_id: params.id, user_id: user.id, role: "user", content })
    .select("id, role, content, created_at")
    .single();
  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ userMessage, assistantMessage: null });
  }

  try {
    const reply = await generateCoachReply(
      (history ?? []) as CoachMessage[],
      content,
      { objectifs: profile?.objectifs ?? null, memoryDigest: profile?.memory_digest ?? null },
      process.env.ANTHROPIC_API_KEY
    );

    const { data: assistantMessage, error: assistantError } = await supabase
      .from("entry_messages")
      .insert({ entry_id: params.id, user_id: user.id, role: "assistant", content: reply.message })
      .select("id, role, content, created_at")
      .single();
    if (assistantError) throw new Error(assistantError.message);

    const entryUpdate: { mood_score?: number; content?: string } = {};
    if (reply.moodEstimate !== null) entryUpdate.mood_score = reply.moodEstimate;
    if (reply.titre) entryUpdate.content = reply.titre;
    if (Object.keys(entryUpdate).length > 0) {
      await supabase.from("journal_entries").update(entryUpdate).eq("id", params.id);
    }

    return NextResponse.json({ userMessage, assistantMessage, crisisDetected: reply.crisisDetected });
  } catch (err) {
    console.error("[coach] error:", err instanceof Error ? err.message : String(err));
    return NextResponse.json({ userMessage, assistantMessage: null, error: "coach_unavailable" });
  }
}
