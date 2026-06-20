"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Lock, Sparkles, Check, ArrowRight } from "lucide-react";
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
        <h2 className="font-display text-xl font-bold text-stone-900">
          Ta routine sur-mesure
        </h2>
        {unlocked && (
          <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
            <Check className="h-3.5 w-3.5" />
            Débloquée
          </span>
        )}
      </div>

      <div className="relative rounded-2xl overflow-hidden border border-cream-200">
        {/* Routine items */}
        <div
          className={
            unlocked
              ? "bg-white p-5 space-y-4"
              : "bg-white p-5 space-y-4 blur-paywall pointer-events-none select-none"
          }
          aria-hidden={!unlocked}
        >
          {routine.map((item) => (
            <div key={item.category} className="flex gap-3">
              <div className="h-9 w-9 rounded-xl bg-coral-50 border border-coral-100 flex items-center justify-center shrink-0">
                <Sparkles className="h-4 w-4 text-coral-400" />
              </div>
              <div>
                <p className="font-semibold text-sm text-stone-900">
                  {item.category}
                </p>
                <p className="text-sm text-stone-500 leading-relaxed mt-0.5">
                  {item.reason}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Paywall overlay */}
        {!unlocked && (
          <div className="absolute inset-0 flex flex-col items-end justify-end bg-gradient-to-b from-transparent via-white/60 to-white p-5 text-center">
            <div className="w-full flex flex-col items-center pt-4">
              <div className="h-12 w-12 rounded-2xl bg-coral-400 flex items-center justify-center mb-3 shadow-lg shadow-coral-200">
                <Lock className="h-5 w-5 text-white" />
              </div>
              <p className="font-display font-bold text-lg text-stone-900 mb-1">
                Débloquer ma routine
              </p>
              <p className="text-sm text-stone-500 mb-5 max-w-[240px] leading-snug">
                Les soins exacts pour ta peau, étape par étape.
              </p>
              <Button asChild size="lg" className="w-full max-w-xs rounded-full">
                <Link href="/checkout">
                  Voir ma routine complète
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
