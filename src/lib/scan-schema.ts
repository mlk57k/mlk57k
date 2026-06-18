import { z } from "zod";

/**
 * Schéma partagé entre le serveur (validation de la réponse IA) et le client
 * (typage des résultats stockés en session). Vocabulaire volontairement
 * cosmétique/informatif — jamais médical.
 */
export const issueSchema = z.object({
  name: z.string(),
  severity: z.number().min(0).max(100),
  description: z.string(),
});

export const routineItemSchema = z.object({
  category: z.string(),
  reason: z.string(),
});

export const skinAnalysisSchema = z.object({
  skin_score: z.number().min(0).max(100),
  skin_age: z.number().min(0).max(120),
  issues: z.array(issueSchema),
  routine: z.array(routineItemSchema),
});

export type Issue = z.infer<typeof issueSchema>;
export type RoutineItem = z.infer<typeof routineItemSchema>;
export type SkinAnalysis = z.infer<typeof skinAnalysisSchema>;

/** Résultat tel que stocké côté client, avec un id temporaire + horodatage. */
export type StoredScan = SkinAnalysis & {
  id: string;
  created_at: string;
  /** Déblocage de la routine — piloté par Stripe (étape 5). Faux par défaut. */
  unlocked?: boolean;
};
