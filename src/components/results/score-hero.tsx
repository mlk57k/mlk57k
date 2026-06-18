"use client";

import { useEffect, useState } from "react";

/** Petit message d'encouragement selon le score (ton beauté, jamais médical). */
function scoreLabel(score: number): string {
  if (score >= 85) return "Ta peau rayonne ✨";
  if (score >= 70) return "Très belle peau 💛";
  if (score >= 55) return "Bonne base, on peaufine 💪";
  return "On va faire briller ça ✨";
}

export function ScoreHero({
  score,
  age,
}: {
  score: number;
  age: number;
}) {
  // Animation du remplissage de l'anneau au montage.
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setAnimatedScore(score), 150);
    return () => clearTimeout(t);
  }, [score]);

  const deg = (animatedScore / 100) * 360;

  return (
    <div className="text-center">
      <p className="text-coral-500 font-semibold text-sm uppercase tracking-widest mb-1">
        Ton aperçu de peau
      </p>
      <p className="text-muted-foreground text-sm mb-6">
        {scoreLabel(score)}
      </p>

      {/* Anneau de score */}
      <div className="relative mx-auto mb-8 h-44 w-44">
        <div
          className="score-ring h-full w-full rounded-full transition-all duration-1000 ease-out"
          style={{ ["--score-deg" as string]: `${deg}deg` }}
        />
        <div className="absolute inset-3 rounded-full bg-beige-50 flex flex-col items-center justify-center">
          <span className="text-6xl font-bold text-gradient-coral leading-none">
            {score}
          </span>
          <span className="text-xs text-muted-foreground mt-1">/ 100</span>
          <span className="text-[11px] text-muted-foreground mt-0.5">
            score de peau
          </span>
        </div>
      </div>

      {/* Âge estimé */}
      <div className="inline-flex items-baseline gap-2 rounded-2xl bg-white border border-beige-200 px-6 py-3 shadow-sm">
        <span className="text-sm text-muted-foreground">Âge estimé de ta peau</span>
        <span className="text-3xl font-bold">{age}</span>
        <span className="text-sm font-medium text-coral-500">ans</span>
      </div>
    </div>
  );
}
