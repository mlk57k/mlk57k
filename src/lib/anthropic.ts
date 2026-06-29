import Anthropic from "@anthropic-ai/sdk";
import { skinAnalysisSchema, type SkinAnalysis, type SkinProfile } from "@/lib/scan-schema";

const MODEL = "claude-sonnet-4-6";

const SUPPORTED_MEDIA_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

type SupportedMediaType = (typeof SUPPORTED_MEDIA_TYPES)[number];

const SYSTEM_PROMPT = `Tu es l'IA de "Glowy", une app beauté qui donne un aperçu cosmétique de la peau à partir d'un selfie.

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

const ANALYZE_TOOL: Anthropic.Tool = {
  name: "analyze_skin",
  description: "Retourne l'analyse cosmétique de la peau",
  input_schema: {
    type: "object",
    properties: {
      skin_score: {
        type: "number",
        description: "Score global d'éclat de la peau, de 0 à 100",
      },
      skin_age: {
        type: "number",
        description: "Âge estimé de la peau en années",
      },
      issues: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            severity: { type: "number", description: "0 (parfait) à 100 (à chouchouter)" },
            description: { type: "string" },
          },
          required: ["name", "severity", "description"],
        },
      },
      routine: {
        type: "array",
        items: {
          type: "object",
          properties: {
            category: { type: "string" },
            reason: { type: "string" },
          },
          required: ["category", "reason"],
        },
      },
    },
    required: ["skin_score", "skin_age", "issues", "routine"],
  },
};

export class InvalidImageError extends Error {}

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

export async function analyzeSkin(imageDataUrl: string, apiKey: string, skinProfile?: SkinProfile): Promise<SkinAnalysis> {
  const client = new Anthropic({ apiKey });
  const { mediaType, data } = parseDataUrl(imageDataUrl);

  const userContent: Anthropic.MessageParam["content"] = [
    { type: "image", source: { type: "base64", media_type: mediaType, data } },
    { type: "text", text: "Voici mon selfie. Donne-moi mon aperçu de peau Glowy." },
  ];

  if (skinProfile) {
    const skinTypeLabels: Record<string, string> = {
      normale: "normale",
      seche: "sèche / avec inconfort",
      grasse: "grasse / brillante",
      mixte: "mixte (zone T)",
      sensible: "sensible / réactive",
    };
    const routineLabels: Record<string, string> = {
      aucune: "aucune routine",
      basique: "routine basique (nettoyant)",
      quelques: "quelques produits",
      complete: "routine complète",
    };
    userContent.push({
      type: "text",
      text: `Profil renseigné par l'utilisateur : peau ${skinTypeLabels[skinProfile.skinType] ?? skinProfile.skinType}, préoccupations principales : ${skinProfile.concerns.join(", ")}, tranche d'âge : ${skinProfile.ageRange} ans, routine actuelle : ${routineLabels[skinProfile.routine] ?? skinProfile.routine}. Utilise ces informations pour affiner et personnaliser ton analyse.`,
    });
  }

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1500,
    system: SYSTEM_PROMPT,
    tools: [ANALYZE_TOOL],
    tool_choice: { type: "tool", name: "analyze_skin" },
    messages: [
      {
        role: "user",
        content: userContent,
      },
    ],
  });

  const toolBlock = response.content.find((b) => b.type === "tool_use");
  if (!toolBlock || toolBlock.type !== "tool_use") {
    throw new Error("L'analyse n'a pas pu être structurée correctement.");
  }

  const parsed = skinAnalysisSchema.safeParse(toolBlock.input);
  if (!parsed.success) {
    throw new Error("Réponse inattendue de l'IA.");
  }

  return parsed.data;
}
