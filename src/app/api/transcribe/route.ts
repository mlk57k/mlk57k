import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { transcribeAudio, TranscriptionError } from "@/lib/openai";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("audio");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "fichier audio manquant" }, { status: 400 });
  }

  try {
    const text = await transcribeAudio(file);
    return NextResponse.json({ text });
  } catch (err) {
    const message = err instanceof TranscriptionError ? err.message : "Erreur inattendue.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
