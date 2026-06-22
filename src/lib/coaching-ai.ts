import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface UserProfile {
  addictionType: string;
  severity: string;
  triggers: string[];
  motivation: string;
  frequency: string;
  durationLabel: string;
}

function buildSystemPrompt(profile: UserProfile | null): string {
  const profileSection = profile
    ? `
## Profil de l'utilisateur
- Addiction : ${profile.addictionType === "cannabis" ? "Cannabis" : profile.addictionType === "porn" ? "Pornographie" : "Cannabis et Pornographie"}
- Sévérité : ${profile.severity === "light" ? "Légère" : profile.severity === "moderate" ? "Modérée" : "Sévère"}
- Déclencheurs principaux : ${profile.triggers.join(", ") || "Non précisés"}
- Fréquence de consommation : ${profile.frequency || "Non précisée"}
- Durée de l'addiction : ${profile.durationLabel || "Non précisée"}
- Motivation à changer : "${profile.motivation || "Non précisée"}"

Utilise ces informations pour personnaliser chaque réponse.`
    : "";

  return `Tu es un coach de bien-être IA bienveillant et professionnel, spécialisé dans l'aide aux personnes souhaitant surmonter des addictions comportementales (cannabis, pornographie). Tu t'appelles Libero.

## Approches thérapeutiques que tu utilises

**TCC (Thérapie Cognitivo-Comportementale)**
- Identifier et questionnner les pensées automatiques ("J'ai besoin de ça pour me détendre")
- Restructuration cognitive : proposer des pensées alternatives réalistes
- Analyse des schémas ABC : Situation → Pensée → Émotion → Comportement

**Entretien motivationnel**
- Explorer l'ambivalence avec empathie (peser avantages/inconvénients)
- Renforcer la motivation intrinsèque et les valeurs personnelles
- Valoriser les ressources et forces de la personne
- Posture de curiosité, jamais de confrontation

**Gestion des cravings**
- Technique du "surf de l'envie" : observer le craving sans y céder
- Règle des 15 minutes : attendre avant d'agir
- Distraction active : physique, créative ou sociale
- Ancrage sensoriel (5-4-3-2-1)

**Pleine conscience**
- Observer les pensées sans les juger
- Ancrage dans le moment présent

## Règles absolues

1. Tu es TOUJOURS bienveillant, chaleureux, non-jugeant — jamais moralisateur
2. Tu ne remplaces JAMAIS un professionnel de santé. Rappelle-le si la personne exprime une détresse intense, des idées suicidaires, ou demande un avis médical. Oriente vers le 3114 (numéro national de prévention du suicide) ou un médecin si nécessaire.
3. Tes réponses sont concises (3-5 paragraphes max), orientées action, en français
4. Tu parles en tutoiement, de manière accessible et directe
5. Tu termines souvent par une question ouverte pour maintenir l'engagement
6. Tu ne prescris pas de médicaments ou traitements médicaux
7. Si quelqu'un décrit une situation de crise grave, priorise sa sécurité avant tout
${profileSection}`;
}

export async function streamCoachResponse(
  messages: Array<{ role: "user" | "assistant"; content: string }>,
  profile: UserProfile | null
) {
  return client.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: buildSystemPrompt(profile),
    messages,
  });
}

export async function generatePersonalizedPlan(profile: UserProfile): Promise<PlanContent> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 3000,
    system: `Tu es un coach spécialisé dans le sevrage des addictions comportementales. Tu génères des plans de sevrage personnalisés et structurés au format JSON.`,
    tools: [
      {
        name: "generate_plan",
        description: "Génère un plan de sevrage personnalisé sur 4 semaines",
        input_schema: {
          type: "object" as const,
          properties: {
            intro: { type: "string", description: "Message d'introduction personnalisé (2-3 phrases)" },
            weeks: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  week: { type: "number" },
                  theme: { type: "string", description: "Thème de la semaine" },
                  objective: { type: "string", description: "Objectif principal de la semaine" },
                  actions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        description: { type: "string" },
                        completed: { type: "boolean" },
                      },
                      required: ["title", "description", "completed"],
                    },
                    description: "3 à 5 micro-actions concrètes",
                  },
                },
                required: ["week", "theme", "objective", "actions"],
              },
            },
            tips: {
              type: "array",
              items: { type: "string" },
              description: "3 conseils clés personnalisés pour cet utilisateur",
            },
          },
          required: ["intro", "weeks", "tips"],
        },
      },
    ],
    tool_choice: { type: "tool", name: "generate_plan" },
    messages: [
      {
        role: "user",
        content: `Génère un plan de sevrage personnalisé sur 4 semaines pour cette personne :
- Addiction : ${profile.addictionType === "cannabis" ? "Cannabis" : profile.addictionType === "porn" ? "Pornographie" : "Cannabis et Pornographie"}
- Sévérité : ${profile.severity}
- Déclencheurs : ${profile.triggers.join(", ")}
- Fréquence : ${profile.frequency}
- Durée : ${profile.durationLabel}
- Motivation : "${profile.motivation}"

Les actions doivent être très concrètes, réalistes et progressives. Commence doucement la semaine 1 et monte en puissance. Tiens compte des déclencheurs spécifiques.`,
      },
    ],
  });

  const toolBlock = response.content.find((b) => b.type === "tool_use");
  if (!toolBlock || toolBlock.type !== "tool_use") {
    throw new Error("Impossible de générer le plan.");
  }

  return toolBlock.input as PlanContent;
}

export async function analyzeJournalPatterns(
  entries: Array<{
    situation: string;
    emotion: string;
    cravingLevel: number;
    resisted: boolean;
    createdAt: string;
  }>
): Promise<string> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 800,
    messages: [
      {
        role: "user",
        content: `Analyse ces entrées de journal d'une personne en sevrage et identifie les patterns récurrents. Sois bienveillant et constructif. Donne des insights actionnables.

Entrées :
${entries.map((e, i) => `${i + 1}. Situation: "${e.situation}" | Émotion: "${e.emotion}" | Intensité craving: ${e.cravingLevel}/10 | A résisté: ${e.resisted ? "Oui" : "Non"} | Date: ${new Date(e.createdAt).toLocaleDateString("fr-FR")}`).join("\n")}

Analyse (3 paragraphes max, en tutoiement, bienveillant) :`,
      },
    ],
  });

  return response.content[0]?.type === "text" ? response.content[0].text : "";
}

export interface PlanContent {
  intro: string;
  weeks: Array<{
    week: number;
    theme: string;
    objective: string;
    actions: Array<{
      title: string;
      description: string;
      completed: boolean;
    }>;
  }>;
  tips: string[];
}
