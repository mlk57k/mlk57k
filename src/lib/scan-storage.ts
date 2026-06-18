"use client";

import { skinAnalysisSchema, type SkinAnalysis, type StoredScan } from "@/lib/scan-schema";

const KEY_PREFIX = "glowy:scan:";

/** Génère un id temporaire court et lisible. */
function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID().slice(0, 8);
  }
  return Math.random().toString(36).slice(2, 10);
}

/**
 * Persiste un résultat d'analyse en sessionStorage (pas besoin de compte) et
 * renvoie l'id temporaire généré. On ne stocke JAMAIS l'image, seulement le JSON.
 */
export function saveScan(analysis: SkinAnalysis): string {
  const id = generateId();
  const stored: StoredScan = {
    ...analysis,
    id,
    created_at: new Date().toISOString(),
  };
  sessionStorage.setItem(KEY_PREFIX + id, JSON.stringify(stored));
  return id;
}

/** Relit un scan stocké par son id, ou null si absent / corrompu. */
export function getScan(id: string): StoredScan | null {
  const raw = sessionStorage.getItem(KEY_PREFIX + id);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    const result = skinAnalysisSchema.safeParse(parsed);
    if (!result.success) return null;
    return {
      ...result.data,
      id: parsed.id ?? id,
      created_at: parsed.created_at ?? new Date().toISOString(),
      unlocked: parsed.unlocked === true,
    };
  } catch {
    return null;
  }
}

/** Id du dernier scan, utile pour rattacher un scan à un compte après login. */
const LAST_SCAN_KEY = "glowy:last-scan-id";

export function setLastScanId(id: string): void {
  sessionStorage.setItem(LAST_SCAN_KEY, id);
}

export function getLastScanId(): string | null {
  return sessionStorage.getItem(LAST_SCAN_KEY);
}

/** Met à jour un champ d'un scan existant (ex: unlocked après paiement). */
export function patchScan(id: string, patch: Partial<StoredScan>): void {
  const raw = sessionStorage.getItem(KEY_PREFIX + id);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    sessionStorage.setItem(KEY_PREFIX + id, JSON.stringify({ ...parsed, ...patch }));
  } catch {
    // ignore
  }
}
