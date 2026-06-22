"use client";

import { useState, useEffect } from "react";
import { Loader2, Map, CheckCircle, Circle, Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface WeekAction {
  title: string;
  description: string;
  completed: boolean;
}

interface Week {
  week: number;
  theme: string;
  objective: string;
  actions: WeekAction[];
}

interface PlanContent {
  intro: string;
  weeks: Week[];
  tips: string[];
}

export default function PlanPage() {
  const [plan, setPlan] = useState<PlanContent | null>(null);
  const [planId, setPlanId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [activeWeek, setActiveWeek] = useState(0);

  useEffect(() => {
    fetch("/api/plan")
      .then((r) => r.json())
      .then((data) => {
        if (data.plan) {
          setPlan(data.plan.content as PlanContent);
          setPlanId(data.plan.id);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const generatePlan = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.plan) {
        setPlan(data.plan.content as PlanContent);
        setPlanId(data.plan.id);
      }
    } finally {
      setGenerating(false);
    }
  };

  const toggleAction = async (weekIndex: number, actionIndex: number) => {
    if (!plan || !planId) return;

    const newPlan = { ...plan };
    newPlan.weeks = plan.weeks.map((w, wi) =>
      wi === weekIndex
        ? {
            ...w,
            actions: w.actions.map((a, ai) =>
              ai === actionIndex ? { ...a, completed: !a.completed } : a
            ),
          }
        : w
    );
    setPlan(newPlan);

    await fetch("/api/plan", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId, content: newPlan }),
    }).catch(() => {});
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-secondary/20 p-8">
        <div className="mx-auto max-w-2xl text-center py-24">
          <Map className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
          <h1 className="text-2xl font-bold mb-2">Ton plan personnalisé</h1>
          <p className="text-muted-foreground mb-8">
            Basé sur ton profil, l&apos;IA va générer un plan de sevrage sur 4 semaines avec des
            micro-actions concrètes adaptées à ta situation.
          </p>
          <Button size="lg" className="gap-2" onClick={generatePlan} disabled={generating}>
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Générer mon plan personnalisé
              </>
            )}
          </Button>
          {generating && (
            <p className="mt-4 text-sm text-muted-foreground">
              L&apos;IA analyse ton profil et crée ton plan... (20-30 secondes)
            </p>
          )}
        </div>
      </div>
    );
  }

  const currentWeek = plan.weeks[activeWeek];
  const weekProgress = currentWeek
    ? Math.round(
        (currentWeek.actions.filter((a) => a.completed).length / currentWeek.actions.length) * 100
      )
    : 0;

  return (
    <div className="min-h-screen bg-secondary/20 p-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mon plan de sevrage</h1>
          <p className="mt-1 text-sm text-muted-foreground">Parcours personnalisé sur 4 semaines</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={generatePlan}
          disabled={generating}
        >
          <RefreshCw className={cn("h-3.5 w-3.5", generating && "animate-spin")} />
          Regénérer
        </Button>
      </div>

      {/* Intro message */}
      <Card className="mb-6 p-6 border-primary/20 bg-primary/5">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
            L
          </div>
          <p className="text-sm leading-relaxed">{plan.intro}</p>
        </div>
      </Card>

      {/* Week tabs */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {plan.weeks.map((week, i) => {
          const completed = week.actions.filter((a) => a.completed).length;
          const total = week.actions.length;
          const isComplete = completed === total;
          return (
            <button
              key={i}
              onClick={() => setActiveWeek(i)}
              className={cn(
                "flex shrink-0 flex-col items-center rounded-xl border px-4 py-3 transition-all",
                activeWeek === i
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : isComplete
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border bg-white text-foreground hover:border-primary/40"
              )}
            >
              <span className="text-xs font-medium">Semaine {week.week}</span>
              <span className="text-xs opacity-80 mt-0.5">{completed}/{total}</span>
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Week detail */}
        <div className="lg:col-span-2 space-y-4">
          {currentWeek && (
            <>
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <Badge className="mb-2">Semaine {currentWeek.week}</Badge>
                    <h2 className="text-lg font-bold">{currentWeek.theme}</h2>
                    <p className="text-sm text-muted-foreground mt-1">{currentWeek.objective}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{weekProgress}%</div>
                    <div className="text-xs text-muted-foreground">complété</div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-6 h-2 w-full rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-accent transition-all duration-500"
                    style={{ width: `${weekProgress}%` }}
                  />
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  {currentWeek.actions.map((action, actionIdx) => (
                    <div
                      key={actionIdx}
                      className={cn(
                        "flex items-start gap-4 rounded-xl border p-4 cursor-pointer transition-colors",
                        action.completed
                          ? "border-accent/30 bg-accent/5"
                          : "border-border bg-white hover:border-primary/30"
                      )}
                      onClick={() => toggleAction(activeWeek, actionIdx)}
                    >
                      {action.completed ? (
                        <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className={cn(
                          "font-medium text-sm",
                          action.completed && "line-through text-muted-foreground"
                        )}>
                          {action.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}
        </div>

        {/* Tips sidebar */}
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Conseils personnalisés
            </h3>
            <ul className="space-y-3">
              {plan.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {i + 1}
                  </span>
                  <span className="text-muted-foreground">{tip}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Overall progress */}
          <Card className="p-5">
            <h3 className="font-semibold text-sm mb-3">Progression globale</h3>
            <div className="space-y-3">
              {plan.weeks.map((week) => {
                const done = week.actions.filter((a) => a.completed).length;
                const pct = Math.round((done / week.actions.length) * 100);
                return (
                  <div key={week.week}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">S{week.week} — {week.theme}</span>
                      <span className="font-medium">{pct}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
