// Calcul des séries de journaling (jours consécutifs avec au moins une entrée).
//
// Fiabilité :
// - "Un soir" = une entrée entre 00h00 et 23h59 dans le fuseau horaire de
//   l'appareil (les dates UTC de la base sont converties en local par `new Date()`).
// - La série d'aujourd'hui n'est jamais cassée tant que la journée n'est pas
//   finie : si rien n'a été écrit aujourd'hui, on compte à partir d'hier.
// - Les jours sont comparés en calendrier (Date.UTC sur année/mois/jour locaux),
//   jamais en millisecondes bruts — le changement d'heure été/hiver (jours de
//   23h ou 25h) ne casse donc jamais une série.
//
// Scénarios de vérification manuelle (cas limites) :
// 1. Entrée à 23h58 → compte pour ce jour-là ; une entrée le lendemain à 8h
//    prolonge la série (2 jours).
// 2. Rédaction à cheval sur minuit → l'entrée est datée de sa création (avant
//    minuit) et compte pour le jour où elle a été commencée.
// 3. Voyage entre fuseaux → les jours sont réévalués dans le fuseau actuel de
//    l'appareil ; au pire deux entrées fusionnent sur le même jour (la série
//    n'est jamais allongée à tort, ni cassée par un simple refresh).
// 4. Changement d'heure (dernier dimanche de mars/octobre) → série intacte.
// → Vérifiable en local : npx tsx scripts/verify-streak.ts

export interface StreakStats {
  current: number;
  best: number;
  total: number;
}

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export function computeStreaks(dates: string[]): StreakStats {
  if (dates.length === 0) return { current: 0, best: 0, total: 0 };

  const days = new Set(dates.map((d) => dayKey(new Date(d))));

  // Série actuelle : part d'aujourd'hui (ou d'hier si rien aujourd'hui)
  let current = 0;
  const cursor = new Date();
  if (!days.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  while (days.has(dayKey(cursor))) {
    current += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  // Meilleure série sur l'ensemble de l'historique.
  // Date.UTC sur les composantes calendaire locales → chaque jour vaut
  // exactement 86 400 000 ms, insensible aux changements d'heure (DST).
  const sorted = Array.from(days)
    .map((k) => {
      const [y, m, d] = k.split("-").map(Number);
      return Date.UTC(y, m, d);
    })
    .sort((a, b) => a - b);

  let best = 0;
  let run = 0;
  let prev: number | null = null;
  for (const t of sorted) {
    run = prev !== null && t - prev === 86400000 ? run + 1 : 1;
    if (run > best) best = run;
    prev = t;
  }

  return { current, best, total: dates.length };
}
