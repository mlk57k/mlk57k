import { NextResponse } from "next/server";
import { analyzeSkin, InvalidImageError } from "@/lib/anthropic";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

// Limite de taille brute (data URL base64) pour éviter les abus / timeouts.
const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // ~8 Mo

export async function POST(request: Request) {
  const apiKey =
    process.env.ANTHROPIC_API_KEY ||
    process.env.ANTHROPIC_API_Key ||
    process.env.anthropic_api_key;

  if (!apiKey) {
    const available = Object.keys(process.env)
      .filter((k) => k.toLowerCase().includes("anthropic"))
      .join(", ");
    console.error("[analyze-skin] clé API manquante. Variables anthropic trouvées:", available || "aucune");
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
    const analysis = await analyzeSkin(image, apiKey);
    // On ne renvoie QUE le résultat — l'image n'est jamais stockée.
    return NextResponse.json(analysis, { status: 200 });
  } catch (error) {
    if (error instanceof InvalidImageError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    const errMsg = error instanceof Error ? error.message : String(error);
    const errName = error instanceof Error ? error.constructor.name : typeof error;
    const errStack = error instanceof Error ? error.stack?.slice(0, 500) : "";
    console.error("[analyze-skin] erreur:", errName, errMsg, errStack);
    return NextResponse.json(
      { error: `Erreur: ${errName} — ${errMsg}` },
      { status: 500 }
    );
  }
}
