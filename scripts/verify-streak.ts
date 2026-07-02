/**
 * Vérification des cas limites du calcul de streak.
 * Usage : npx tsx scripts/verify-streak.ts
 */
import { computeStreaks } from "../src/lib/streak";

function iso(daysAgo: number, hour = 21, minute = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

let failures = 0;
function check(label: string, actual: number, expected: number) {
  const ok = actual === expected;
  if (!ok) failures++;
  console.log(`${ok ? "✅" : "❌"} ${label} — attendu ${expected}, obtenu ${actual}`);
}

// 1. Entrée à 23h58 hier + entrée à 8h aujourd'hui → série de 2
check("Entrée à 23h58 puis lendemain matin", computeStreaks([iso(1, 23, 58), iso(0, 8, 0)]).current, 2);

// 2. Rien aujourd'hui, entrées hier et avant-hier → la série tient jusqu'à minuit
check("Rien encore aujourd'hui (grâce jusqu'à minuit)", computeStreaks([iso(1), iso(2)]).current, 2);

// 3. Trou d'un jour → la série repart de l'entrée du jour
check("Trou avant-hier", computeStreaks([iso(0), iso(2), iso(3)]).current, 1);

// 4. Plusieurs entrées le même jour → comptent pour un seul jour
check("Deux entrées le même jour", computeStreaks([iso(0, 9), iso(0, 21), iso(1)]).current, 2);

// 5. Record traversant le passage à l'heure d'été (29 mars 2026 en Europe)
const dstDates = [
  "2026-03-27T20:00:00", "2026-03-28T20:00:00", "2026-03-29T20:00:00", "2026-03-30T20:00:00",
].map((d) => new Date(d).toISOString());
check("Série de 4 jours à travers le changement d'heure", computeStreaks(dstDates).best, 4);

// 6. Historique vide
const empty = computeStreaks([]);
check("Vide — série actuelle", empty.current, 0);
check("Vide — record", empty.best, 0);
check("Vide — total", empty.total, 0);

if (failures > 0) {
  console.error(`\n${failures} échec(s)`);
  process.exit(1);
}
console.log("\nTous les scénarios passent ✅");
