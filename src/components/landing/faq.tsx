"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Est-ce que mes photos sont stockées quelque part ?",
    a: "Non. Tes photos sont envoyées directement à notre IA pour analyse, puis immédiatement supprimées. On ne stocke jamais tes images — seulement les résultats de l'analyse, si tu crées un compte.",
  },
  {
    q: "C'est vraiment gratuit ?",
    a: "Le scan de base (score + âge estimé de ta peau) est 100% gratuit, sans compte. Pour débloquer ta routine personnalisée complète et l'historique de progression, on propose un abonnement à petit prix.",
  },
  {
    q: "Comment l'IA fait pour analyser ma peau ?",
    a: "Notre IA analyse visuellement ta photo pour détecter des paramètres visibles : texture, éclat, zones sèches, etc. C'est un aperçu informatif, pas un avis médical ou dermatologique.",
  },
  {
    q: "Ça marche pour tous les types de peau ?",
    a: "Oui ! L'IA a été entraînée sur des données diversifiées et s'adapte à tous les types et carnations de peau.",
  },
  {
    q: "Puis-je annuler mon abonnement quand je veux ?",
    a: "Oui, à tout moment en un clic depuis ton espace personnel. Aucun engagement, aucune prise de tête.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 sm:py-28 bg-cream-50">
      <div className="mx-auto max-w-2xl px-4">
        <div className="text-center mb-12">
          <p className="text-coral-400 font-semibold text-xs uppercase tracking-[0.2em] mb-4">
            On répond à tout
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-stone-900">Questions fréquentes</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl border border-cream-200 bg-white overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between p-5 text-left font-semibold text-sm sm:text-base"
                onClick={() => setOpen(open === i ? null : i)}
              >
                {faq.q}
                <ChevronDown
                  className={cn(
                    "h-5 w-5 text-coral-400 shrink-0 transition-transform duration-200",
                    open === i && "rotate-180"
                  )}
                />
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-sm text-stone-500 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
