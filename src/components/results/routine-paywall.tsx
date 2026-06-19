"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Lock, Sparkles, Check } from "lucide-react";
import type { RoutineItem } from "@/lib/scan-schema";

export function RoutinePaywall({
  routine,
  unlocked = false,
}: {
  routine: RoutineItem[];
  unlocked?: boolean;
}) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Ta routine personnalisée</h2>
        {unlocked && (
          <span className="text-xs font-semibold text-green-600 flex items-center gap-1">
            <Check className="h-3.5 w-3.5" /> Débloquée
          </span>
        )}
      </div>

      <div className="relative rounded-2xl overflow-hidden border border-cream-200">
        {/* Contenu routine — flouté tant que non débloqué */}
        <div
          className={
            unlocked
              ? "bg-white p-4 space-y-3"
              : "bg-white p-4 space-y-3 blur-paywall"
          }
          aria-hidden={!unlocked}
        >
          {routine.map((item) => (
            <div key={item.category} className="flex gap-3">
              <div className="h-8 w-8 rounded-lg bg-coral-50 flex items-center justify-center shrink-0">
                <Sparkles className="h-4 w-4 text-coral-400" />
              </div>
              <div>
                <p className="font-semibold text-sm">{item.category}</p>
                <p className="text-sm text-stone-500 leading-relaxed">
                  {item.reason}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Overlay paywall */}
        {!unlocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-white/40 to-white/90 p-6 text-center">
            <div className="h-12 w-12 rounded-2xl bg-coral-400 flex items-center justify-center mb-3 shadow-lg shadow-coral-200">
              <Lock className="h-6 w-6 text-white" />
            </div>
            <p className="font-bold text-base mb-1">
              Débloque ta routine personnalisée complète
            </p>
            <p className="text-sm text-stone-500 mb-5 max-w-xs">
              Les soins exacts adaptés à ta peau, étape par étape, pour booster
              ton score.
            </p>
            <Button asChild size="lg" className="w-full max-w-xs">
              <Link href="/checkout">
                <Sparkles className="h-5 w-5" />
                Débloquer ma routine
              </Link>
            </Button>
            <p className="text-xs text-stone-400 mt-3">
              Essai gratuit de 7 jours · Sans engagement
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
