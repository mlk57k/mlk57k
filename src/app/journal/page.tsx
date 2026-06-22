"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Plus,
  BookOpen,
  CheckCircle,
  XCircle,
  Loader2,
  Brain,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface JournalEntry {
  id: string;
  situation: string;
  emotion: string;
  craving_level: number;
  resisted: boolean;
  notes: string;
  created_at: string;
}

const EMOTIONS = [
  "Stressé(e)", "Anxieux/se", "Ennuyé(e)", "Seul(e)", "Triste",
  "En colère", "Fatigué(e)", "Heureux/se", "Soulagé(e)", "Frustré(e)",
];

function JournalContent() {
  const searchParams = useSearchParams();
  const showNew = searchParams.get("new") === "1";

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(showNew);
  const [submitting, setSubmitting] = useState(false);
  const [patterns, setPatterns] = useState<string | null>(null);
  const [loadingPatterns, setLoadingPatterns] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [form, setForm] = useState({
    situation: "",
    emotion: "",
    craving_level: 5,
    resisted: true,
    notes: "",
  });

  useEffect(() => {
    fetch("/api/journal")
      .then((r) => r.json())
      .then((data) => setEntries(data.entries ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.situation || !form.emotion) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setEntries((prev) => [data.entry, ...prev]);
        setShowForm(false);
        setForm({ situation: "", emotion: "", craving_level: 5, resisted: true, notes: "" });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const loadPatterns = async () => {
    setLoadingPatterns(true);
    try {
      const res = await fetch("/api/journal/patterns");
      const data = await res.json();
      setPatterns(data.analysis ?? null);
    } finally {
      setLoadingPatterns(false);
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="min-h-screen bg-secondary/20 p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Journal des déclencheurs</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {entries.length} entrée{entries.length !== 1 ? "s" : ""}
            {entries.length >= 5 && " · Patterns disponibles"}
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle entrée
        </Button>
      </div>

      {/* New entry form */}
      {showForm && (
        <Card className="mb-6 p-6">
          <h2 className="mb-4 font-semibold">Nouvelle entrée</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Décris la situation
              </label>
              <textarea
                value={form.situation}
                onChange={(e) => setForm({ ...form, situation: e.target.value })}
                placeholder="Ex : Rentré du travail stressant, seul chez moi, il était 19h..."
                className="w-full min-h-[80px] rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Émotion ressentie
              </label>
              <div className="flex flex-wrap gap-2">
                {EMOTIONS.map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => setForm({ ...form, emotion: em })}
                    className={cn(
                      "rounded-full border px-3 py-1 text-sm transition-colors",
                      form.emotion === em
                        ? "border-primary bg-primary/10 text-primary font-medium"
                        : "border-border text-muted-foreground hover:border-primary/30"
                    )}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Intensité du craving : <span className="text-primary font-bold">{form.craving_level}/10</span>
              </label>
              <input
                type="range"
                min={1}
                max={10}
                value={form.craving_level}
                onChange={(e) => setForm({ ...form, craving_level: Number(e.target.value) })}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Faible</span>
                <span>Très fort</span>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">As-tu résisté ?</label>
              <div className="flex gap-3">
                {[
                  { value: true, label: "Oui, j'ai résisté ✓", className: "border-accent bg-accent/10 text-accent" },
                  { value: false, label: "Non, j'ai consommé", className: "border-destructive bg-destructive/10 text-destructive" },
                ].map(({ value, label, className }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setForm({ ...form, resisted: value })}
                    className={cn(
                      "flex-1 rounded-lg border p-3 text-sm font-medium transition-colors",
                      form.resisted === value
                        ? className
                        : "border-border text-muted-foreground hover:border-primary/30"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Notes supplémentaires <span className="text-muted-foreground">(optionnel)</span>
              </label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Pensées, réactions physiques, ce qui a aidé ou pas..."
                className="w-full min-h-[60px] rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)} disabled={submitting}>
                Annuler
              </Button>
              <Button type="submit" disabled={submitting || !form.situation || !form.emotion} className="flex-1">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sauvegarder"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* AI Pattern analysis */}
      {entries.length >= 5 && (
        <Card className="mb-6 p-6 border-primary/20 bg-primary/5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Analyse IA de tes patterns</h2>
            </div>
            {!patterns && (
              <Button size="sm" onClick={loadPatterns} disabled={loadingPatterns} className="gap-2">
                {loadingPatterns ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Analyser"}
              </Button>
            )}
          </div>
          {patterns ? (
            <div className="text-sm text-foreground whitespace-pre-wrap">{patterns}</div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Tu as {entries.length} entrées. Demande à l&apos;IA d&apos;analyser tes déclencheurs récurrents.
            </p>
          )}
        </Card>
      )}

      {/* Entries list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : entries.length === 0 ? (
        <Card className="p-12 text-center">
          <BookOpen className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
          <h3 className="font-semibold">Aucune entrée pour l&apos;instant</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Commence à noter tes situations et cravings pour identifier des patterns.
          </p>
          <Button className="mt-4 gap-2" onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4" />
            Première entrée
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <Card key={entry.id} className="p-4">
              <div
                className="flex items-start justify-between cursor-pointer"
                onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {entry.resisted ? (
                    <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={entry.resisted ? "default" : "destructive"} className="text-xs">
                        {entry.resisted ? "Résisté" : "Rechute"}
                      </Badge>
                      <span className="font-medium text-sm">{entry.emotion}</span>
                      <span className="text-xs text-muted-foreground">
                        Craving {entry.craving_level}/10
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground truncate">
                      {entry.situation}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDate(entry.created_at)}
                    </p>
                  </div>
                </div>
                {expandedId === entry.id ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                )}
              </div>

              {expandedId === entry.id && (
                <div className="mt-4 pl-8 space-y-3 border-t border-border pt-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">SITUATION</p>
                    <p className="text-sm">{entry.situation}</p>
                  </div>
                  {entry.notes && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">NOTES</p>
                      <p className="text-sm">{entry.notes}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">INTENSITÉ CRAVING</p>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-32 rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-orange-400"
                          style={{ width: `${(entry.craving_level / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold">{entry.craving_level}/10</span>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function JournalPage() {
  return (
    <Suspense fallback={null}>
      <JournalContent />
    </Suspense>
  );
}
