import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateInsights } from "@/lib/anthropic";

const MIN_ENTRIES = 3;
const MAX_ENTRIES = 20;

export async function POST() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "analyse indisponible" }, { status: 503 });
  }

  const { data: entries } = await supabase
    .from("journal_entries")
    .select("id, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(MAX_ENTRIES);

  if (!entries || entries.length < MIN_ENTRIES) {
    return NextResponse.json({ error: "not_enough_entries", minimum: MIN_ENTRIES }, { status: 400 });
  }

  const { data: messages } = await supabase
    .from("entry_messages")
    .select("entry_id, role, content, created_at")
    .in("entry_id", entries.map((e) => e.id))
    .eq("role", "user")
    .order("created_at", { ascending: true });

  const text = (messages ?? [])
    .map((m) => {
      const date = new Date(m.created_at).toLocaleDateString("fr-FR");
      return `[${date}] ${m.content}`;
    })
    .join("\n");

  if (!text.trim()) {
    return NextResponse.json({ error: "not_enough_entries", minimum: MIN_ENTRIES }, { status: 400 });
  }

  try {
    const insights = await generateInsights(text, process.env.ANTHROPIC_API_KEY);

    // Alimente aussi la mémoire du coach (bloc MÉMOIRE du prompt)
    const digest = [
      `Thèmes récurrents : ${insights.themes.map((t) => t.titre).join(", ")}.`,
      insights.observation,
    ].join(" ");
    await supabase.from("profiles").update({ memory_digest: digest }).eq("id", user.id);

    return NextResponse.json({ insights });
  } catch (err) {
    console.error("[insights] error:", err instanceof Error ? err.message : String(err));
    return NextResponse.json({ error: "analyse_failed" }, { status: 500 });
  }
}
