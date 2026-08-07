// Questions du jour — introspectives, pensées pour demander une vraie réflexion.
// La sélection (voir pickDailyQuestion) tourne sans répétition tant que la
// liste n'est pas épuisée, et reste stable au sein d'une même journée.

export const DAILY_QUESTIONS = [
  "Quelle vérité sur toi évites-tu de regarder en face en ce moment ?",
  "Qu'est-ce que tu continues de faire alors que ça ne te correspond plus ?",
  "À qui essaies-tu encore de prouver quelque chose — et pourquoi lui ?",
  "Quelle version de toi as-tu laissée en chemin ? Est-ce que elle te manque ?",
  "Qu'est-ce que tu appelles « être raisonnable » qui est en fait de la peur ?",
  "De quoi est-ce que tu te protèges en restant tout le temps occupé·e ?",
  "Quelle émotion as-tu appris à cacher — et auprès de qui l'as-tu apprise ?",
  "Si personne ne devait jamais le savoir, qu'est-ce que tu ferais autrement ?",
  "Qu'est-ce que tu attends des autres que tu pourrais commencer à t'offrir toi-même ?",
  "Quel reproche que tu fais aux autres pourrais-tu, honnêtement, te faire aussi ?",
  "Quelle décision as-tu déjà prise au fond de toi sans encore oser te l'avouer ?",
  "Qu'est-ce que ton silence dit, les fois où tu n'oses pas parler ?",
  "Qu'est-ce que tu pardonnerais facilement à un ami mais pas à toi-même ?",
  "Qu'est-ce qui te ferait dire, dans un an, que cette période valait la peine ?",
  "Où est-ce que tu confonds l'amour avec le besoin d'être choisi·e ?",
  "Quelle peur prend aujourd'hui les décisions à ta place ?",
  "Qu'est-ce que tu as arrêté de désirer parce que tu as cru que c'était impossible ?",
  "Quand t'es-tu senti·e vraiment toi-même pour la dernière fois — et avec qui ?",
  "Qu'est-ce que tu répètes de ton enfance sans t'en rendre compte ?",
  "Quelle limite laisses-tu franchir alors qu'elle compte pour toi ?",
  "Qu'est-ce que tu cherches à contrôler parce que le lâcher te fait peur ?",
  "À quoi ressemblerait ta journée si tu n'avais rien à prouver à personne ?",
  "Quelle colère portes-tu que tu n'as jamais vraiment exprimée ?",
  "Qu'est-ce que tu sais devoir dire à quelqu'un, et que tu remets à plus tard ?",
  "Qu'est-ce qui, chez les autres, te dérange le plus — et qu'est-ce que ça dit de toi ?",
  "Qu'est-ce que tu ferais de ton temps si tu cessais de te comparer ?",
  "Quel besoin caches-tu derrière le fait de toujours dire « ça va » ?",
  "Qu'est-ce que tu attends pour te sentir enfin « prêt·e » — et est-ce que ce moment existe ?",
  "Quelle histoire te racontes-tu sur toi qui n'est peut-être plus vraie ?",
  "Qu'est-ce que tu as appris cette année que ton toi d'avant refusait d'entendre ?",
  "Qu'est-ce qui te fatigue vraiment en ce moment — au-delà du manque de sommeil ?",
  "Pour qui portes-tu un masque, et qu'est-ce que ça te coûte de le tenir ?",
  "Qu'est-ce que tu regretterais de ne pas avoir osé, si aujourd'hui était ta dernière chance ?",
  "Quelle part de toi as-tu mise en veille pour être aimé·e ou accepté·e ?",
  "Qu'est-ce que tu fuis quand tu prends ton téléphone sans raison ?",
  "Quel serait le premier petit pas si tu te faisais enfin confiance ?",
  "Qu'est-ce que tu voudrais qu'on comprenne de toi sans avoir à l'expliquer ?",
  "De quoi as-tu vraiment besoin, là, sous ce que tu crois vouloir ?",
  "Qu'est-ce que tu tiens à bout de bras et que tu pourrais, peut-être, déposer ce soir ?",
  "Si tu te parlais comme à quelqu'un que tu aimes, qu'est-ce que tu te dirais ce soir ?",
] as const;

// Sélection déterministe (fallback serveur / si pas de localStorage).
export function getDailyQuestion(date = new Date()): string {
  const start = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((date.getTime() - start.getTime()) / 86400000);
  return DAILY_QUESTIONS[dayOfYear % DAILY_QUESTIONS.length];
}

const QUESTION_STORAGE = "ancrage-daily-question";

/**
 * Renvoie la question du jour côté client, en évitant les répétitions :
 * - stable au sein d'une même journée (même question si on rouvre l'app) ;
 * - à chaque nouveau jour, une question encore jamais vue est tirée ;
 * - quand toutes ont été vues, on repart d'un cycle neuf (sans reprendre
 *   immédiatement la dernière posée).
 * À appeler dans un effet (pas pendant le rendu) pour éviter tout mismatch.
 */
export function pickDailyQuestion(): string {
  if (typeof window === "undefined") return getDailyQuestion();
  try {
    const today = new Date().toLocaleDateString("en-CA");
    const raw = window.localStorage.getItem(QUESTION_STORAGE);
    const state = raw ? (JSON.parse(raw) as { date?: string; idx?: number; seen?: number[] }) : null;

    // Même jour → on garde la question déjà tirée.
    if (state && state.date === today && typeof state.idx === "number") {
      return DAILY_QUESTIONS[state.idx] ?? getDailyQuestion();
    }

    let seen = Array.isArray(state?.seen) ? state!.seen! : [];
    // Cycle épuisé : on repart à zéro, en excluant la dernière vue.
    if (seen.length >= DAILY_QUESTIONS.length) {
      seen = typeof state?.idx === "number" ? [state.idx] : [];
    }
    const available = DAILY_QUESTIONS.map((_, i) => i).filter((i) => !seen.includes(i));
    const pool = available.length > 0 ? available : DAILY_QUESTIONS.map((_, i) => i);
    const idx = pool[Math.floor(Math.random() * pool.length)];

    window.localStorage.setItem(
      QUESTION_STORAGE,
      JSON.stringify({ date: today, idx, seen: [...seen, idx] })
    );
    return DAILY_QUESTIONS[idx];
  } catch {
    return getDailyQuestion();
  }
}
