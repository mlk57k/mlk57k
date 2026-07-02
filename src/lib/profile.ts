// Construction / lecture du champ profiles.objectifs (texte libre structuré,
// utilisé tel quel dans le bloc MÉMOIRE du coach).

export interface OnboardingAnswers {
  prenom: string;
  objectifs: string[];
  etatInitial: string;
}

export function buildObjectifsText({ prenom, objectifs, etatInitial }: OnboardingAnswers): string {
  const lines: string[] = [];
  if (prenom.trim()) lines.push(`Prénom : ${prenom.trim()}`);
  if (objectifs.length > 0) lines.push(`Ce qui l'amène : ${objectifs.join(", ").toLowerCase()}`);
  if (etatInitial) lines.push(`État en arrivant sur l'app : ${etatInitial.toLowerCase()}`);
  return lines.join("\n");
}

export function extractPrenom(objectifs: string | null | undefined): string | null {
  if (!objectifs) return null;
  const match = objectifs.match(/^Prénom\s*:\s*(.+)$/m);
  return match ? match[1].trim() : null;
}
