import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { analyzeJournalPatterns } from "@/lib/coaching-ai";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { data: entries } = await supabase
    .from("journal_entries")
    .select("situation, emotion, craving_level, resisted, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  if (!entries || entries.length < 5) {
    return NextResponse.json({
      analysis: null,
      message: "Il faut au moins 5 entrées pour analyser les patterns.",
    });
  }

  const mapped = entries.map((e) => ({
    situation: e.situation as string,
    emotion: e.emotion as string,
    cravingLevel: e.craving_level as number,
    resisted: e.resisted as boolean,
    createdAt: e.created_at as string,
  }));

  const analysis = await analyzeJournalPatterns(mapped);

  return NextResponse.json({ analysis });
}
