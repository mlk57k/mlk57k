import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

const MODEL = "claude-sonnet-4-6";

export const CRISIS_HOTLINE = "3114";

// Réponse fixe, jamais générée par le modèle : on ne laisse jamais l'IA
// improviser face à un risque suicidaire ou de mise en danger immédiate.
const CRISIS_MESSAGE = `Ce que tu traverses semble très lourd, et je veux que tu saches que ça compte.

Je ne suis qu'une IA de journaling — je ne suis pas formée ni en mesure de t'accompagner sur ce que tu vis là, et ce n'est pas à moi de le faire. Tu mérites un soutien humain, tout de suite.

Si tu as des pensées suicidaires ou que tu te sens en danger, appelle ou écris au **3114** (numéro national de prévention du suicide, gratuit, confidentiel, 24h/24 et 7j/7). En cas d'urgence vitale, appelle le **15** (SAMU) ou le **112**.

Si tu peux, parle-en aussi à quelqu'un de confiance autour de toi — tu n'as pas à porter ça seul·e.`;

const SYSTEM_PROMPT_TEMPLATE = `Tu es le compagnon d'"Ancrage", une app de journaling quotidien. Tu es un miroir — pas un coach autoritaire, pas un thérapeute, pas un professeur. Ton rôle : écouter, comprendre, reformuler, relier les événements entre eux, mettre en lumière les évolutions, et poser une question pertinente. La personne te parle tous les soirs : tu es le même compagnon chaque jour, et tu te souviens d'elle.

CADRE — Tu t'appuies sur des principes de thérapie cognitivo-comportementale (TCC) et d'entretien motivationnel (EM) :
- Écoute réflective : reformule brièvement ce que tu comprends, sans interpréter à outrance.
- Questions ouvertes plutôt que fermées.
- Affirmations sincères (souligner un effort, une lucidité, une prise de recul) — jamais flatteuses ou creuses.
- Explorer l'ambivalence sans juger ("une partie de toi... et une autre...").
- Aider à repérer les pensées automatiques et les distorsions cognitives, sans jamais les nommer comme un diagnostic.
- Varier la forme de tes relances : ne répète jamais la même structure de question deux tours de suite.

MÉMOIRE — Voici ce que tu sais réellement de cette personne (rien d'autre) :
{{CONTEXT}}

COMMENT UTILISER TA MÉMOIRE — avec douceur, jamais de manière intrusive :
- RÈGLE ABSOLUE : ne fais référence qu'à ce qui est écrit dans ta mémoire ci-dessus. N'invente JAMAIS un souvenir, un détail ou une évolution. Si ta mémoire est vide sur un sujet, n'y fais pas allusion.
- Ouvertures : quand c'est pertinent (pas à chaque fois), commence par un rappel naturel — "Tu me disais récemment que…", "Je repense à ce que tu partageais il y a quelques jours…", "Bon retour.", "Content de te retrouver." Varie constamment, n'utilise jamais deux fois la même formule d'affilée.
- Objectifs : si la personne a partagé un objectif il y a quelques jours, fais un suivi doux — "Tu voulais reprendre le sport. Est-ce que tu as trouvé un moment cette semaine ?" Jamais culpabilisant.
- Personnes : si quelqu'un revient plusieurs fois (Léa, papa, mon patron…), tu peux demander naturellement — "Tu m'as déjà parlé de Léa. Comment vont les choses avec elle ?"
- Thèmes récurrents : après plusieurs occurrences, formule une observation humaine — "Je remarque que le travail revient souvent dans ce que tu partages." Jamais comme une statistique.
- Évolutions : si les derniers jours montrent un vrai changement (plus serein, plus fatigué, plus confiant…), tu peux le refléter — "J'ai l'impression que cette semaine tu sembles un peu plus apaisé." Uniquement si c'est réellement observable dans ta mémoire.
- Fréquence : un seul rappel de mémoire par réponse maximum. Certaines réponses n'en ont pas besoin du tout — le message du jour passe toujours en premier.

INTERDITS ABSOLUS DE FORMULATION — tu es une présence humaine, pas un système :
- Jamais "Selon mes données…", "D'après les statistiques…", "J'ai analysé…", "Ton score…", "Cela représente…", "D'après mes enregistrements…".
- Tout doit sonner comme une conversation humaine, calme et douce.

LIMITES ABSOLUES — tu n'es PAS un·e thérapeute :
- Tu ne poses jamais de diagnostic, ne donnes jamais d'avis médical ou de traitement.
- Tu ne remplaces jamais un suivi professionnel ; si la personne semble en avoir besoin, encourage-la doucement à consulter, sans insister lourdement à chaque message.
- Tu ne donnes pas de conseils de vie tranchés ("tu devrais quitter ton travail") — tu aides la personne à clarifier ce qu'elle pense déjà.

TON — 100% français, tutoiement, chaleureux, posé, jamais clinique ni robotique. Phrases courtes. Pas d'emoji. Pas de "Je comprends que..." en formule figée à chaque message.

LONGUEUR — 2 à 5 phrases maximum. Toujours se terminer par une seule question ouverte (sauf cas de crise, voir plus bas).

EXTRACTION DE MÉMOIRE — En plus de ta réponse, extrais du message de la personne (uniquement de son message, pas de ta réponse) les faits durables qui méritent d'être retenus : objectifs, personnes citées par prénom ou rôle, habitudes, inquiétudes, réussites, événements importants, valeurs, centres d'intérêt, projets, difficultés récurrentes, thèmes abordés. Règles :
- 0 à 3 éléments maximum par message. Un simple "salut" ou une banalité → tableau vide.
- Chaque élément : une phrase courte et factuelle en français ("Reprendre une activité sportive", "Léa", "Stress professionnel"). Jamais la conversation brute.
- Pour une personne : uniquement son prénom ou son rôle ("Léa", "papa", "mon patron").
- Pour un thème : un mot ou deux ("travail", "sommeil", "confiance en soi").

DÉTECTION DE CRISE — Si le message laisse penser à un risque suicidaire, d'auto-mutilation, de mise en danger immédiate de soi-même ou d'autrui, ou de détresse aiguë nécessitant une aide humaine urgente, mets crisis_detected à true. Dans ce cas, n'essaie PAS toi-même de gérer la crise, ne donne aucun conseil — le système affichera automatiquement un message de sécurité à la place du tien.`;

const COACH_TOOL: Anthropic.Tool = {
  name: "repondre_journal",
  description: "Retourne la réponse du coach à l'entrée de journal de l'utilisateur",
  input_schema: {
    type: "object",
    properties: {
      message: {
        type: "string",
        description: "La réponse du coach, en français, 2 à 5 phrases, terminée par une question ouverte (sauf crise).",
      },
      mood_estimate: {
        type: ["number", "null"],
        description: "Humeur perçue dans ce message, de 1 (très difficile) à 10 (très bien), ou null si impossible à estimer.",
      },
      titre: {
        type: "string",
        description: "Titre très court (3 à 6 mots, en français, sans guillemets ni point final) résumant le thème de la conversation. Exemple : 'Fatigue et pression au travail'.",
      },
      memoire: {
        type: "array",
        description: "0 à 3 faits durables extraits du message de l'utilisateur (voir règles EXTRACTION DE MÉMOIRE du system prompt). Tableau vide si rien de significatif.",
        items: {
          type: "object",
          properties: {
            type: {
              type: "string",
              enum: ["objectif", "personne", "habitude", "theme", "evenement", "preoccupation", "reussite", "valeur", "interet", "projet", "difficulte"],
            },
            contenu: {
              type: "string",
              description: "Le fait, en une phrase courte et factuelle (ou juste le prénom/rôle pour une personne, un mot ou deux pour un thème).",
            },
          },
          required: ["type", "contenu"],
        },
      },
      crisis_detected: {
        type: "boolean",
        description: "true si risque suicidaire, auto-mutilation, mise en danger immédiate, ou détresse aiguë nécessitant une aide humaine urgente.",
      },
    },
    required: ["message", "mood_estimate", "crisis_detected", "titre", "memoire"],
  },
};

export const MEMORY_KINDS = [
  "objectif", "personne", "habitude", "theme", "evenement",
  "preoccupation", "reussite", "valeur", "interet", "projet", "difficulte",
] as const;
export type MemoryKind = (typeof MEMORY_KINDS)[number];

const coachReplySchema = z.object({
  message: z.string(),
  mood_estimate: z.number().min(1).max(10).nullable(),
  crisis_detected: z.boolean(),
  titre: z.string().optional(),
  memoire: z.array(z.object({ type: z.enum(MEMORY_KINDS), contenu: z.string() })).optional(),
});

export interface CoachMessage {
  role: "user" | "assistant";
  content: string;
}

export interface CoachContext {
  objectifs?: string | null;
  memoryDigest?: string | null;
  /** Mémoire court terme : les dernières entrées (titres, dates, humeurs) */
  shortTerm?: string | null;
  /** Mémoire long terme : faits durables (objectifs, personnes, thèmes…) */
  longTerm?: string | null;
}

export interface ExtractedMemory {
  type: MemoryKind;
  contenu: string;
}

export interface CoachReply {
  message: string;
  moodEstimate: number | null;
  crisisDetected: boolean;
  titre: string | null;
  memoire: ExtractedMemory[];
}

function buildContextBlock({ objectifs, memoryDigest, shortTerm, longTerm }: CoachContext): string {
  const sections: string[] = [];
  if (objectifs) sections.push(`— Profil (rempli à l'inscription) :\n${objectifs}`);
  if (shortTerm) sections.push(`— Ses derniers jours (mémoire court terme) :\n${shortTerm}`);
  if (longTerm) sections.push(`— Ce que tu as retenu au fil du temps (mémoire long terme) :\n${longTerm}`);
  if (memoryDigest) sections.push(`— Ton impression d'ensemble sur son évolution :\n${memoryDigest}`);
  if (sections.length === 0) {
    sections.push("Pas encore d'historique connu — c'est probablement l'une de ses premières entrées. Accueille-la simplement, sans faire semblant de la connaître.");
  }
  return sections.join("\n\n");
}

export async function generateCoachReply(
  history: CoachMessage[],
  newUserMessage: string,
  context: CoachContext,
  apiKey: string
): Promise<CoachReply> {
  const client = new Anthropic({ apiKey });

  const system = SYSTEM_PROMPT_TEMPLATE.replace("{{CONTEXT}}", buildContextBlock(context));

  const messages: Anthropic.MessageParam[] = [
    ...history.map((m) => ({ role: m.role, content: m.content }) as Anthropic.MessageParam),
    { role: "user", content: newUserMessage },
  ];

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 600,
    system,
    tools: [COACH_TOOL],
    tool_choice: { type: "tool", name: "repondre_journal" },
    messages,
  });

  const toolBlock = response.content.find((b) => b.type === "tool_use");
  if (!toolBlock || toolBlock.type !== "tool_use") {
    throw new Error("La réponse du coach n'a pas pu être générée.");
  }

  const parsed = coachReplySchema.safeParse(toolBlock.input);
  if (!parsed.success) {
    throw new Error("Réponse inattendue de l'IA.");
  }

  if (parsed.data.crisis_detected) {
    return { message: CRISIS_MESSAGE, moodEstimate: null, crisisDetected: true, titre: null, memoire: [] };
  }

  return {
    message: parsed.data.message,
    moodEstimate: parsed.data.mood_estimate,
    crisisDetected: false,
    titre: parsed.data.titre?.trim() || null,
    memoire: (parsed.data.memoire ?? [])
      .map((m) => ({ type: m.type, contenu: m.contenu.trim() }))
      .filter((m) => m.contenu.length > 0 && m.contenu.length <= 200)
      .slice(0, 4),
  };
}

// ─── Insights : thèmes récurrents & tendances ───────────────────────────────

const INSIGHTS_SYSTEM_PROMPT = `Tu analyses les entrées de journal d'une personne sur Ancrage pour lui refléter ses tendances. À partir des messages fournis, identifie 2 à 4 thèmes récurrents et une observation bienveillante tournée vers l'action. Ton chaleureux, français, tutoiement. Jamais de diagnostic ni de vocabulaire clinique.`;

const INSIGHTS_TOOL: Anthropic.Tool = {
  name: "restituer_tendances",
  description: "Restitue les thèmes récurrents et une observation à partir des entrées de journal",
  input_schema: {
    type: "object",
    properties: {
      themes: {
        type: "array",
        items: {
          type: "object",
          properties: {
            titre: { type: "string", description: "Nom court du thème (2-4 mots)" },
            description: { type: "string", description: "1 à 2 phrases sur ce que révèlent les entrées à ce sujet" },
          },
          required: ["titre", "description"],
        },
        description: "2 à 4 thèmes récurrents identifiés",
      },
      observation: {
        type: "string",
        description: "Une observation bienveillante et actionnable (2-3 phrases), sans injonction.",
      },
    },
    required: ["themes", "observation"],
  },
};

const insightsSchema = z.object({
  themes: z.array(z.object({ titre: z.string(), description: z.string() })).min(1).max(6),
  observation: z.string(),
});

export interface Insights {
  themes: { titre: string; description: string }[];
  observation: string;
}

export async function generateInsights(
  entriesText: string,
  apiKey: string
): Promise<Insights> {
  const client = new Anthropic({ apiKey });

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 800,
    system: INSIGHTS_SYSTEM_PROMPT,
    tools: [INSIGHTS_TOOL],
    tool_choice: { type: "tool", name: "restituer_tendances" },
    messages: [{ role: "user", content: entriesText }],
  });

  const toolBlock = response.content.find((b) => b.type === "tool_use");
  if (!toolBlock || toolBlock.type !== "tool_use") {
    throw new Error("L'analyse n'a pas pu être générée.");
  }
  const parsed = insightsSchema.safeParse(toolBlock.input);
  if (!parsed.success) throw new Error("Réponse inattendue de l'IA.");
  return parsed.data;
}

const WEEKLY_SUMMARY_SYSTEM_PROMPT = `Tu rédiges un bilan hebdomadaire bienveillant pour une personne qui tient un journal sur Ancrage. À partir des entrées de la semaine fournies, identifie 2 à 3 tendances ou motifs récurrents (pas une liste exhaustive de tout ce qui s'est passé). Ton chaleureux, concis, en français, tutoiement. 100 à 150 mots. Ne donne aucun diagnostic, ne fais aucune supposition clinique. Termine par une phrase d'encouragement tournée vers la semaine à venir.`;

export async function generateWeeklySummary(
  entries: { content: string; moodScore: number | null; createdAt: string }[],
  apiKey: string
): Promise<string> {
  const client = new Anthropic({ apiKey });

  const entriesText = entries
    .map((e) => `[${e.createdAt}${e.moodScore ? `, humeur ${e.moodScore}/10` : ""}] ${e.content}`)
    .join("\n\n");

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 500,
    system: WEEKLY_SUMMARY_SYSTEM_PROMPT,
    messages: [{ role: "user", content: entriesText }],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Le bilan hebdomadaire n'a pas pu être généré.");
  }
  return textBlock.text.trim();
}
