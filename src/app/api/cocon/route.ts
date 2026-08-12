import { NextResponse } from "next/server";
import { generateRoomAnalysis } from "@/lib/anthropic";

export const runtime = "nodejs";

const ALLOWED = ["image/jpeg", "image/png", "image/webp"] as const;
type Allowed = (typeof ALLOWED)[number];

// Limite de sécurité : ~6 Mo de base64 (~4,5 Mo d'image). Le client réduit
// déjà l'image avant l'envoi, mais on protège quand même le serveur.
const MAX_BASE64 = 6_000_000;

// Analyse publique d'une photo de chambre — hameçon d'acquisition « cocon ».
// L'image n'est JAMAIS stockée : reçue, analysée, oubliée.
export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "Service indisponible." }, { status: 503 });
  }

  let image: unknown;
  try {
    ({ image } = await request.json());
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  if (typeof image !== "string" || !image.startsWith("data:image/")) {
    return NextResponse.json({ error: "Image manquante ou invalide." }, { status: 400 });
  }

  const match = image.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
  if (!match) {
    return NextResponse.json({ error: "Format d'image non reconnu." }, { status: 400 });
  }

  const mediaType = match[1] as Allowed;
  const base64 = match[2];
  if (!ALLOWED.includes(mediaType)) {
    return NextResponse.json({ error: "Formats acceptés : JPEG, PNG ou WebP." }, { status: 400 });
  }
  if (base64.length > MAX_BASE64) {
    return NextResponse.json({ error: "Image trop lourde. Réessaie avec une photo plus légère." }, { status: 413 });
  }

  try {
    const analysis = await generateRoomAnalysis(base64, mediaType, process.env.ANTHROPIC_API_KEY);
    if (!analysis.lisible) {
      return NextResponse.json(
        { error: "Je n'arrive pas à bien voir ta chambre. Réessaie avec une photo un peu plus large et nette 🌙" },
        { status: 422 }
      );
    }
    return NextResponse.json({ analysis });
  } catch (err) {
    console.error("[/api/cocon]", err instanceof Error ? err.message : String(err));
    return NextResponse.json({ error: "L'analyse a échoué. Réessaie dans un instant." }, { status: 500 });
  }
}
