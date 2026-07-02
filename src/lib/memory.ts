import type { SupabaseClient } from "@supabase/supabase-js";
import type { ExtractedMemory, MemoryKind } from "@/lib/anthropic";

const KIND_LABELS: Record<MemoryKind, string> = {
  objectif: "Objectifs en cours",
  personne: "Personnes importantes",
  habitude: "Habitudes",
  theme: "Thèmes récurrents",
  evenement: "Événements marquants",
  preoccupation: "Préoccupations",
  reussite: "Réussites",
  valeur: "Valeurs importantes",
  interet: "Centres d'intérêt",
  projet: "Projets",
  difficulte: "Difficultés récurrentes",
};

const MOOD_LABELS: Record<number, string> = {
  5: "serein", 4: "léger", 3: "mêlé", 2: "sensible", 1: "lourd",
};

interface MemoryRow {
  kind: MemoryKind;
  content: string;
  occurrences: number;
  last_seen_at: string;
}

function relativeDay(dateStr: string): string {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (days <= 0) return "aujourd'hui";
  if (days === 1) return "hier";
  if (days < 7) return `il y a ${days} jours`;
  if (days < 30) return `il y a ${Math.round(days / 7)} semaine${days >= 14 ? "s" : ""}`;
  return `il y a ${Math.round(days / 30)} mois`;
}

/**
 * Mémoire court terme : les dernières entrées (titre, date relative, humeur),
 * pour que le coach puisse dire "hier tu me racontais…".
 */
export async function buildShortTermMemory(
  supabase: SupabaseClient,
  userId: string,
  excludeEntryId: string
): Promise<string | null> {
  const { data: entries } = await supabase
    .from("journal_entries")
    .select("id, content, created_at, mood_score")
    .eq("user_id", userId)
    .neq("id", excludeEntryId)
    .order("created_at", { ascending: false })
    .limit(5);

  if (!entries || entries.length === 0) return null;

  const lines = entries
    .filter((e) => e.content?.trim())
    .map((e) => {
      const mood = e.mood_score ? ` (se sentait ${MOOD_LABELS[e.mood_score] ?? ""})` : "";
      return `- ${relativeDay(e.created_at)} : ${e.content}${mood}`;
    });

  return lines.length > 0 ? lines.join("\n") : null;
}

/**
 * Mémoire long terme : faits durables, groupés par nature. Les éléments les
 * plus récents et les plus évoqués passent en premier ; les anciens sortent
 * naturellement de la fenêtre (décroissance douce).
 */
export async function buildLongTermMemory(
  supabase: SupabaseClient,
  userId: string
): Promise<string | null> {
  const { data: rows } = await supabase
    .from("user_memories")
    .select("kind, content, occurrences, last_seen_at")
    .eq("user_id", userId)
    .order("last_seen_at", { ascending: false })
    .limit(60);

  if (!rows || rows.length === 0) return null;

  // Priorité : récence + fréquence, puis fenêtre de 25 éléments max
  const scored = (rows as MemoryRow[])
    .map((r) => {
      const ageDays = (Date.now() - new Date(r.last_seen_at).getTime()) / 86400000;
      return { ...r, score: r.occurrences * 2 - ageDays * 0.1 };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 25);

  const byKind = new Map<MemoryKind, MemoryRow[]>();
  for (const row of scored) {
    const list = byKind.get(row.kind) ?? [];
    list.push(row);
    byKind.set(row.kind, list);
  }

  const sections: string[] = [];
  for (const [kind, label] of Object.entries(KIND_LABELS) as [MemoryKind, string][]) {
    const items = byKind.get(kind);
    if (!items || items.length === 0) continue;
    const lines = items.map((r) => {
      const freq = r.occurrences > 1 ? ` (évoqué ${r.occurrences} fois, dernière fois ${relativeDay(r.last_seen_at)})` : ` (${relativeDay(r.last_seen_at)})`;
      return `  - ${r.content}${freq}`;
    });
    sections.push(`${label} :\n${lines.join("\n")}`);
  }

  return sections.length > 0 ? sections.join("\n") : null;
}

/**
 * Enregistre les faits extraits par le coach. Un fait déjà connu (même nature,
 * même contenu) voit son compteur et sa date de dernière évocation mis à jour.
 */
export async function saveExtractedMemories(
  supabase: SupabaseClient,
  userId: string,
  memories: ExtractedMemory[]
): Promise<void> {
  for (const memory of memories) {
    try {
      const { data: existing } = await supabase
        .from("user_memories")
        .select("id, occurrences")
        .eq("user_id", userId)
        .eq("kind", memory.type)
        .ilike("content", memory.contenu)
        .limit(1)
        .maybeSingle();

      if (existing) {
        await supabase
          .from("user_memories")
          .update({ occurrences: existing.occurrences + 1, last_seen_at: new Date().toISOString() })
          .eq("id", existing.id);
      } else {
        await supabase
          .from("user_memories")
          .insert({ user_id: userId, kind: memory.type, content: memory.contenu });
      }
    } catch (err) {
      console.error("[memory] sauvegarde échouée:", memory.type, err);
    }
  }
}
