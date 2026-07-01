// Calcul des séries de journaling (jours consécutifs avec au moins une entrée)

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

  // Meilleure série sur l'ensemble de l'historique
  const sorted = Array.from(days)
    .map((k) => {
      const [y, m, d] = k.split("-").map(Number);
      return new Date(y, m, d).getTime();
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
