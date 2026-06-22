import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { data: entries } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return NextResponse.json({ entries: entries ?? [] });
}

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const body = await request.json();
  const { situation, emotion, craving_level, resisted, notes } = body;

  if (!situation || !emotion || craving_level === undefined || resisted === undefined) {
    return NextResponse.json({ error: "Champs requis manquants." }, { status: 400 });
  }

  const { data: entry, error } = await supabase
    .from("journal_entries")
    .insert({
      user_id: user.id,
      situation,
      emotion,
      craving_level,
      resisted,
      notes: notes ?? "",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ entry });
}
