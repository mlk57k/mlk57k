"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Lock, Sparkles, Check, ArrowRight, Tag, Loader2 } from "lucide-react";
import type { RoutineItem } from "@/lib/scan-schema";

export function RoutinePaywall({
  routine,
  unlocked = false,
  onUnlock,
}: {
  routine: RoutineItem[];
  unlocked?: boolean;
  onUnlock?: () => void;
}) {
  const [showPromo, setShowPromo] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoSuccess, setPromoSuccess] = useState(false);

  async function handlePromoSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!promoCode.trim() || promoLoading) return;
    setPromoLoading(true);
    setPromoError(null);
    try {
      const res = await fetch("/api/promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode.trim() }),
      });
      let json: { error?: string; success?: boolean } = {};
      try {
        json = await res.json();
      } catch {
        setPromoError("Erreur serveur. Réessaie dans quelques secondes.");
        return;
      }
      if (!res.ok) {
        setPromoError(json.error ?? "Code invalide.");
      } else {
        localStorage.setItem("glowy_promo", "unlocked");
        setPromoSuccess(true);
        setTimeout(() => onUnlock?.(), 600);
      }
    } catch {
      setPromoError("Connexion impossible. Vérifie ta connexion internet.");
    } finally {
      setPromoLoading(false);
    }
  }
  if (!routine.length) return null;

  const [firstItem, ...lockedItems] = routine;

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
        {/* First item always visible */}
        {firstItem && (
          <div className="bg-white px-5 pt-5 pb-3">
            <div className="flex gap-3">
              <div className="h-9 w-9 rounded-xl bg-coral-50 border border-coral-100 flex items-center justify-center shrink-0">
                <Sparkles className="h-4 w-4 text-coral-400" />
              </div>
              <div>
                <p className="font-semibold text-sm text-stone-900">
                  {firstItem.category}
                </p>
                <p className="text-sm text-stone-500 leading-relaxed mt-0.5">
                  {firstItem.reason}
                </p>
              </div>
            </div>
            {!unlocked && lockedItems.length > 0 && (
              <p className="text-xs text-stone-400 font-medium mt-3 ml-12">
                + {lockedItems.length} autre{lockedItems.length > 1 ? "s" : ""}{" "}
                étape{lockedItems.length > 1 ? "s" : ""} personnalisée
                {lockedItems.length > 1 ? "s" : ""}
              </p>
            )}
          </div>
        )}

        {/* Remaining items (blurred if locked, or shown if unlocked) */}
        {unlocked ? (
          lockedItems.length > 0 ? (
            <div className="bg-white px-5 pb-5 space-y-4">
              {lockedItems.map((item) => (
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
          ) : null
        ) : lockedItems.length > 0 ? (
          <div className="relative">
            <div
              className="bg-white px-5 pb-5 space-y-4 blur-paywall pointer-events-none select-none"
              aria-hidden
            >
              {lockedItems.map((item) => (
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
                <Button
                  asChild
                  size="lg"
                  className="w-full max-w-xs rounded-full"
                >
                  <Link href="/checkout">
                    Voir ma routine complète
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Link>
                </Button>

                {/* Promo code section */}
                {!showPromo ? (
                  <button
                    onClick={() => setShowPromo(true)}
                    className="mt-3 text-xs text-stone-400 hover:text-stone-600 underline underline-offset-2 transition-colors flex items-center gap-1"
                  >
                    <Tag className="h-3 w-3" />
                    J&apos;ai un code promo
                  </button>
                ) : promoSuccess ? (
                  <p className="mt-3 text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <Check className="h-3.5 w-3.5" />
                    Code activé ! Accès débloqué à vie.
                  </p>
                ) : (
                  <form onSubmit={handlePromoSubmit} className="mt-3 w-full max-w-xs flex flex-col gap-1.5">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Code promo"
                        autoFocus
                        className="flex-1 min-w-0 rounded-full border border-cream-300 bg-white px-3 py-1.5 text-xs text-stone-800 placeholder:text-stone-400 outline-none focus:border-coral-400 focus:ring-1 focus:ring-coral-200 transition"
                      />
                      <button
                        type="submit"
                        disabled={promoLoading || !promoCode.trim()}
                        className="shrink-0 rounded-full bg-coral-400 text-white text-xs font-semibold px-3 py-1.5 hover:bg-coral-500 disabled:opacity-50 transition flex items-center gap-1"
                      >
                        {promoLoading ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : "Appliquer"}
                      </button>
                    </div>
                    {promoError && (
                      <p className="text-xs text-red-500 text-center">{promoError}</p>
                    )}
                  </form>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
