import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { skinAnalysisSchema, type SkinAnalysis } from "@/lib/scan-schema";

const client = new Anthropic();

// Modèle vision demandé explicitement pour ce projet.
const MODEL = "claude-sonnet-4-6";

const SUPPORTED_MEDIA_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

type SupportedMediaType = (typeof SUPPORTED_MEDIA_TYPES)[number];

/**
 * Prompt système : cadre le rôle, impose un ton jeune et bienveillant, et
 * interdit STRICTEMENT tout vocabulaire médical. Positionnement cosmétique
 * et informatif uniquement.
 */
const SYSTEM_PROMPT = `Tu es l'IA de "Glowy", une app beauté qui donne un aperçu cosmétique de la peau à partir d'une selfie.

Ton rôle : analyser visuellement l'apparence de la peau et produire une estimation ludique et bienveillante.

RÈGLES ABSOLUES :
- Tu ne poses JAMAIS de diagnostic. Tu ne donnes JAMAIS d'avis médical ou dermatologique.
- Tu n'utilises JAMAIS de vocabulaire médical (pas de "pathologie", "lésion", "diagnostic", "maladie", "acné" cliniques, etc.). Reste sur du vocabulaire beauté/cosmétique grand public ("éclat", "hydratation", "texture", "petites imperfections", "zones de brillance"...).
- Tout est une "estimation" ou un "aperçu", jamais une certitude.
- Ton jeune, direct, bienveillant et positif, 100% en français. Tutoiement.
- Les descriptions s'adressent directement à la personne ("ta peau", "tu peux...").

Donne :
- skin_score : un score global d'éclat/santé apparente de la peau, de 0 à 100.
- skin_age : un âge estimé de la peau (apparence), en années.
- issues : 3 à 4 points d'attention cosmétiques (hydratation, éclat, texture, zones de brillance...), chacun avec une sévérité de 0 (parfait) à 100 (à chouchouter) et une courte description bienveillante.
- routine : 2 à 3 catégories de soins recommandées (ex : "Hydratation", "Protection solaire", "Exfoliation douce") avec une raison courte et motivante.

Si l'image ne montre pas clairement un visage, donne quand même une estimation prudente et encourageante.`;

/** Erreur métier renvoyée quand l'image est invalide / illisible. */
export class InvalidImageError extends Error {}

/**
 * Décode une data URL base64 (`data:image/png;base64,xxxx`) en media type +
 * données base64 nues, en validant le format.
 */
function parseDataUrl(dataUrl: string): { mediaType: SupportedMediaType; data: string } {
  const match = /^data:(image\/[a-zA-Z+]+);base64,(.+)$/.exec(dataUrl);
  if (!match) {
    throw new InvalidImageError("Format d'image invalide.");
  }
  const [, mediaType, data] = match;
  if (!SUPPORTED_MEDIA_TYPES.includes(mediaType as SupportedMediaType)) {
    throw new InvalidImageError(`Type d'image non supporté : ${mediaType}.`);
  }
  return { mediaType: mediaType as SupportedMediaType, data };
}

/**
 * Analyse une selfie et renvoie une estimation cosmétique structurée.
 * La sortie est contrainte par structured outputs (output_config.format) ET
 * validée par Zod via le helper, donc la valeur retournée est garantie conforme.
 *
 * L'image n'est PAS persistée : elle ne quitte cette fonction que vers l'API
 * Anthropic, le temps de l'appel.
 */
export async function analyzeSkin(imageDataUrl: string): Promise<SkinAnalysis> {
  const { mediaType, data } = parseDataUrl(imageDataUrl);

  const response = await client.messages.parse({
    model: MODEL,
    max_tokens: 1500,
    system: SYSTEM_PROMPT,
    output_config: {
      format: zodOutputFormat(skinAnalysisSchema),
    },
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: mediaType, data },
          },
          {
            type: "text",
            text: "Voici ma selfie. Donne-moi mon aperçu de peau Glowy.",
          },
        ],
      },
    ],
  });

  if (!response.parsed_output) {
    throw new Error("L'analyse n'a pas pu être structurée correctement.");
  }

  return response.parsed_output;
}
