import { NextResponse } from "next/server";
import { analyzeSkin, InvalidImageError } from "@/lib/anthropic";

export const runtime = "nodejs";
export const maxDuration = 60;

// Limite de taille brute (data URL base64) pour éviter les abus / timeouts.
const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // ~8 Mo

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "Service indisponible pour le moment." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const image = (body as { image?: unknown })?.image;
  if (typeof image !== "string" || !image.startsWith("data:image/")) {
    return NextResponse.json(
      { error: "Aucune image valide n'a été reçue." },
      { status: 400 }
    );
  }

  if (image.length > MAX_IMAGE_BYTES) {
    return NextResponse.json(
      { error: "Image trop lourde. Essaie une photo plus légère." },
      { status: 413 }
    );
  }

  try {
    const analysis = await analyzeSkin(image);
    // On ne renvoie QUE le résultat — l'image n'est jamais stockée.
    return NextResponse.json(analysis, { status: 200 });
  } catch (error) {
    if (error instanceof InvalidImageError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("[analyze-skin] erreur:", error);
    return NextResponse.json(
      { error: "L'analyse a échoué. Réessaie dans un instant." },
      { status: 500 }
    );
  }
}
