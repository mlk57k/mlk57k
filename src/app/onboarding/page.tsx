"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, ArrowLeft, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface OnboardingData {
  addictionType: "cannabis" | "porn" | "both" | "";
  frequency: string;
  durationLabel: string;
  triggers: string[];
  motivationScore: number;
  motivation: string;
  difficultyScore: number;
}

const TOTAL_STEPS = 7;

const TRIGGERS_OPTIONS = [
  { id: "stress", label: "Stress / Pression" },
  { id: "boredom", label: "Ennui" },
  { id: "loneliness", label: "Solitude" },
  { id: "social", label: "Situations sociales" },
  { id: "anxiety", label: "Anxiété" },
  { id: "sleep", label: "Problèmes de sommeil" },
  { id: "sadness", label: "Tristesse / Déprime" },
  { id: "habit", label: "Habitude automatique" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<OnboardingData>({
    addictionType: "",
    frequency: "",
    durationLabel: "",
    triggers: [],
    motivationScore: 7,
    motivation: "",
    difficultyScore: 5,
  });

  const canProceed = () => {
    switch (step) {
      case 1: return data.addictionType !== "";
      case 2: return data.frequency !== "";
      case 3: return data.durationLabel !== "";
      case 4: return data.triggers.length > 0;
      case 5: return true;
      case 6: return data.motivation.trim().length >= 10;
      case 7: return true;
      default: return false;
    }
  };

  const toggleTrigger = (id: string) => {
    setData((d) => ({
      ...d,
      triggers: d.triggers.includes(id)
        ? d.triggers.filter((t) => t !== id)
        : [...d.triggers, id],
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    const severity = computeSeverity(data);

    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, severity }),
      });

      if (!res.ok) throw new Error(await res.text());
      router.push("/dashboard");
    } catch {
      setError("Une erreur est survenue. Réessaie.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-primary/5 to-white">
      {/* Header */}
      <header className="flex h-16 items-center justify-center px-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="text-lg font-bold">Libero</span>
        </div>
      </header>

      {/* Progress bar */}
      <div className="px-4 pt-2 pb-8">
        <div className="mx-auto max-w-lg">
          <div className="mb-2 flex justify-between text-xs text-muted-foreground">
            <span>Question {step}/{TOTAL_STEPS}</span>
            <span>{Math.round((step / TOTAL_STEPS) * 100)}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question */}
      <main className="flex flex-1 items-start justify-center px-4 pb-24">
        <div className="w-full max-w-lg">
          {step === 1 && (
            <QuestionCard
              title="Quelle addiction souhaites-tu surmonter ?"
              subtitle="Tu pourras travailler sur les deux si besoin."
            >
              <div className="grid gap-3">
                {[
                  { value: "cannabis", emoji: "🌿", label: "Cannabis", desc: "Joint, résine, herbe, huile..." },
                  { value: "porn", emoji: "📱", label: "Pornographie", desc: "Contenus pornographiques en ligne" },
                  { value: "both", emoji: "⚡", label: "Les deux", desc: "Cannabis et pornographie" },
                ].map(({ value, emoji, label, desc }) => (
                  <ChoiceCard
                    key={value}
                    emoji={emoji}
                    label={label}
                    desc={desc}
                    selected={data.addictionType === value}
                    onClick={() => setData({ ...data, addictionType: value as OnboardingData["addictionType"] })}
                  />
                ))}
              </div>
            </QuestionCard>
          )}

          {step === 2 && (
            <QuestionCard
              title="Quelle est ta fréquence de consommation actuelle ?"
              subtitle="Sois honnête avec toi-même — aucun jugement ici."
            >
              <div className="grid gap-3">
                {[
                  { value: "Plusieurs fois par jour", label: "Plusieurs fois par jour" },
                  { value: "Une fois par jour", label: "Une fois par jour" },
                  { value: "Plusieurs fois par semaine", label: "Plusieurs fois par semaine" },
                  { value: "Quelques fois par mois", label: "Quelques fois par mois" },
                ].map(({ value, label }) => (
                  <SimpleChoice
                    key={value}
                    label={label}
                    selected={data.frequency === value}
                    onClick={() => setData({ ...data, frequency: value })}
                  />
                ))}
              </div>
            </QuestionCard>
          )}

          {step === 3 && (
            <QuestionCard
              title="Depuis combien de temps consommes-tu ?"
              subtitle="Toutes les situations sont différentes — la durée aide à personnaliser ton plan."
            >
              <div className="grid gap-3">
                {[
                  { value: "Moins de 6 mois", label: "Moins de 6 mois" },
                  { value: "6 à 12 mois", label: "6 à 12 mois" },
                  { value: "1 à 3 ans", label: "1 à 3 ans" },
                  { value: "Plus de 3 ans", label: "Plus de 3 ans" },
                ].map(({ value, label }) => (
                  <SimpleChoice
                    key={value}
                    label={label}
                    selected={data.durationLabel === value}
                    onClick={() => setData({ ...data, durationLabel: value })}
                  />
                ))}
              </div>
            </QuestionCard>
          )}

          {step === 4 && (
            <QuestionCard
              title="Quels sont tes principaux déclencheurs ?"
              subtitle="Sélectionne tout ce qui correspond — tu peux en choisir plusieurs."
            >
              <div className="grid grid-cols-2 gap-3">
                {TRIGGERS_OPTIONS.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => toggleTrigger(id)}
                    className={cn(
                      "flex items-center gap-2 rounded-xl border p-3 text-left text-sm font-medium transition-all",
                      data.triggers.includes(id)
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-white text-foreground hover:border-primary/40"
                    )}
                  >
                    {data.triggers.includes(id) && <Check className="h-4 w-4 shrink-0" />}
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </QuestionCard>
          )}

          {step === 5 && (
            <QuestionCard
              title="Sur une échelle de 1 à 10, quelle est ta motivation à changer ?"
              subtitle="1 = pas vraiment motivé · 10 = plus que jamais prêt"
            >
              <div className="space-y-6">
                <div className="text-center">
                  <span className="text-6xl font-bold text-primary">{data.motivationScore}</span>
                  <span className="text-2xl text-muted-foreground">/10</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={data.motivationScore}
                  onChange={(e) => setData({ ...data, motivationScore: Number(e.target.value) })}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Pas vraiment motivé</span>
                  <span>Plus que jamais prêt</span>
                </div>
              </div>
            </QuestionCard>
          )}

          {step === 6 && (
            <QuestionCard
              title="Qu'est-ce qui t'a amené ici aujourd'hui ?"
              subtitle="Ta réponse aide ton coach à vraiment te comprendre."
            >
              <textarea
                value={data.motivation}
                onChange={(e) => setData({ ...data, motivation: e.target.value })}
                placeholder="Ex : J'ai réalisé que ça affectait ma relation, mon travail... Je veux retrouver le contrôle..."
                className="w-full min-h-[160px] rounded-xl border border-input bg-white p-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
              <p className="text-xs text-muted-foreground">
                {data.motivation.length}/10 caractères minimum
              </p>
            </QuestionCard>
          )}

          {step === 7 && (
            <QuestionCard
              title="À quelle intensité ressens-tu les envies de consommer ?"
              subtitle="Quand l'envie arrive, à quel point est-il difficile de résister ?"
            >
              <div className="space-y-6">
                <div className="text-center">
                  <span className="text-6xl font-bold text-primary">{data.difficultyScore}</span>
                  <span className="text-2xl text-muted-foreground">/10</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={data.difficultyScore}
                  onChange={(e) => setData({ ...data, difficultyScore: Number(e.target.value) })}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Facile à gérer</span>
                  <span>Très difficile à résister</span>
                </div>

                {/* Summary */}
                <div className="rounded-xl bg-secondary p-4 text-sm space-y-2">
                  <p className="font-semibold text-foreground">Récapitulatif :</p>
                  <p className="text-muted-foreground">
                    Addiction : <span className="font-medium text-foreground">{
                      data.addictionType === "cannabis" ? "Cannabis" :
                      data.addictionType === "porn" ? "Pornographie" : "Cannabis & Pornographie"
                    }</span>
                  </p>
                  <p className="text-muted-foreground">
                    Fréquence : <span className="font-medium text-foreground">{data.frequency}</span>
                  </p>
                  <p className="text-muted-foreground">
                    Depuis : <span className="font-medium text-foreground">{data.durationLabel}</span>
                  </p>
                  <p className="text-muted-foreground">
                    Déclencheurs : <span className="font-medium text-foreground">{data.triggers.length} identifié{data.triggers.length > 1 ? "s" : ""}</span>
                  </p>
                </div>
              </div>
            </QuestionCard>
          )}

          {error && (
            <p className="mt-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive text-center">
              {error}
            </p>
          )}

          {/* Navigation */}
          <div className="mt-8 flex gap-3">
            {step > 1 && (
              <Button
                variant="secondary"
                size="lg"
                className="gap-2"
                onClick={() => setStep((s) => s - 1)}
                disabled={loading}
              >
                <ArrowLeft className="h-4 w-4" />
                Retour
              </Button>
            )}
            <Button
              size="lg"
              className="flex-1 gap-2"
              disabled={!canProceed() || loading}
              onClick={step === TOTAL_STEPS ? handleSubmit : () => setStep((s) => s + 1)}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : step === TOTAL_STEPS ? (
                <>
                  Créer mon profil
                  <Sparkles className="h-4 w-4" />
                </>
              ) : (
                <>
                  Continuer
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

function QuestionCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <div>{children}</div>
    </div>
  );
}

function ChoiceCard({
  emoji,
  label,
  desc,
  selected,
  onClick,
}: {
  emoji: string;
  label: string;
  desc: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-4 rounded-xl border p-4 text-left transition-all",
        selected
          ? "border-primary bg-primary/10 shadow-sm"
          : "border-border bg-white hover:border-primary/40 hover:bg-secondary/50"
      )}
    >
      <span className="text-2xl">{emoji}</span>
      <div className="flex-1">
        <div className="font-semibold text-foreground">{label}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
      {selected && (
        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary">
          <Check className="h-3 w-3 text-white" />
        </div>
      )}
    </button>
  );
}

function SimpleChoice({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center justify-between rounded-xl border p-4 text-left text-sm font-medium transition-all",
        selected
          ? "border-primary bg-primary/10 text-primary shadow-sm"
          : "border-border bg-white text-foreground hover:border-primary/40 hover:bg-secondary/50"
      )}
    >
      <span>{label}</span>
      {selected && (
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
          <Check className="h-3 w-3 text-white" />
        </div>
      )}
    </button>
  );
}

function computeSeverity(data: OnboardingData): "light" | "moderate" | "severe" {
  let score = 0;
  if (data.frequency === "Plusieurs fois par jour") score += 3;
  else if (data.frequency === "Une fois par jour") score += 2;
  else if (data.frequency === "Plusieurs fois par semaine") score += 1;

  if (data.durationLabel === "Plus de 3 ans") score += 3;
  else if (data.durationLabel === "1 à 3 ans") score += 2;
  else if (data.durationLabel === "6 à 12 mois") score += 1;

  if (data.difficultyScore >= 8) score += 3;
  else if (data.difficultyScore >= 5) score += 2;
  else score += 1;

  if (score >= 7) return "severe";
  if (score >= 4) return "moderate";
  return "light";
}
