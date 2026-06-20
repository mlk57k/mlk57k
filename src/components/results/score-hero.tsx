"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

const RADIUS = 68;
const CIRC = 2 * Math.PI * RADIUS;

function scoreMessage(score: number): string {
  if (score >= 85) return "Ta peau rayonne";
  if (score >= 70) return "Très belle peau";
  if (score >= 55) return "Bonne base, on peaufine";
  return "On va faire briller ça";
}

export function ScoreHero({ score, age }: { score: number; age: number }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 250);
    return () => clearTimeout(t);
  }, []);

  const offset = animated ? CIRC * (1 - score / 100) : CIRC;

  return (
    <div className="rounded-3xl bg-gradient-to-b from-cream-50 to-white border border-cream-200 p-8 text-center shadow-sm">
      {/* Badge */}
      <div className="inline-flex items-center gap-1.5 rounded-full bg-coral-50 border border-coral-100 px-3 py-1 mb-6">
        <Sparkles className="h-3 w-3 text-coral-400" />
        <span className="text-coral-500 font-semibold text-[11px] uppercase tracking-[0.15em]">
          Ton aperçu de peau
        </span>
      </div>

      {/* SVG Score Ring */}
      <div className="relative mx-auto mb-5 h-48 w-48">
        <svg
          viewBox="0 0 160 160"
          className="w-full h-full -rotate-90"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#dc6b51" />
              <stop offset="100%" stopColor="#eea593" />
            </linearGradient>
          </defs>
          {/* Background track */}
          <circle
            cx="80"
            cy="80"
            r={RADIUS}
            fill="none"
            stroke="#EDE4DB"
            strokeWidth="11"
          />
          {/* Score arc */}
          <circle
            cx="80"
            cy="80"
            r={RADIUS}
            fill="none"
            stroke="url(#scoreGrad)"
            strokeWidth="11"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={offset}
            style={{
              transition: "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-6xl font-display font-bold text-stone-900 leading-none tabular-nums">
            {score}
          </span>
          <span className="text-xs text-stone-400 mt-1 tracking-wide">/ 100</span>
        </div>
      </div>

      {/* Message */}
      <p className="font-display text-xl font-bold italic text-stone-800 mb-6">
        {scoreMessage(score)}
      </p>

      {/* Age badge */}
      <div className="inline-flex items-center gap-3 rounded-2xl bg-white border border-cream-200 px-6 py-3.5 shadow-sm">
        <span className="text-sm text-stone-500">Âge estimé de ta peau</span>
        <div className="h-4 w-px bg-cream-300" />
        <div className="flex items-baseline gap-1">
          <span className="font-display text-3xl font-bold text-stone-900 leading-none">
            {age}
          </span>
          <span className="text-sm font-semibold text-coral-400">ans</span>
        </div>
      </div>
    </div>
  );
}
