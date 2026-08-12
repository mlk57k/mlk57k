"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { AppLogo } from "@/components/ui/logo";
import { CoconAnalyzer } from "@/components/cocon-analyzer";

export default function CoconPage() {
  return (
    <div className="min-h-screen bg-cream-50">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-72"
        style={{ background: "radial-gradient(60% 100% at 50% 0%, rgba(189,110,76,0.10), transparent)" }}
      />

      <header className="relative px-4 h-14 flex items-center justify-center border-b border-cream-200 bg-white/70 backdrop-blur-xl">
        <Link href="/"><AppLogo size="md" /></Link>
      </header>

      <main className="relative mx-auto max-w-md px-5 pb-24 pt-8">
        <CoconAnalyzer
          intro={
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-coral-50 border border-coral-100 px-3 py-1 text-xs font-semibold text-coral-600">
                <Sparkles className="h-3.5 w-3.5" /> Analyse ton cocon
              </span>
              <h1 className="mt-4 font-display text-[2rem] font-semibold leading-tight text-stone-900">
                Ta chambre est-elle<br />un vrai <span className="italic text-coral-500">cocon</span> ?
              </h1>
              <p className="mt-3 text-[15px] leading-relaxed text-stone-500">
                Prends une photo de ta chambre. En quelques secondes, on te dit ce qui l&apos;apaise
                déjà — et les petits gestes pour en faire un lieu plus propice au calme et au sommeil.
              </p>
            </div>
          }
          renderFooter={() => (
            <div className="mt-5 rounded-3xl border border-coral-200 bg-coral-50/60 p-5 text-center">
              <p className="font-display text-lg font-semibold text-stone-900">
                Ta chambre est prête. Et toi ?
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-stone-600">
                Ancrage t&apos;aide à poser ta soirée, chaque soir, dans ce cocon. Un journal qui te
                répond et se souvient de toi.
              </p>
              <Link
                href="/auth?next=/journal"
                className="mt-4 block w-full rounded-2xl bg-gradient-coral py-3.5 text-center text-sm font-bold text-white shadow-glow-coral transition-transform active:scale-[0.98]"
              >
                Créer mon compte — c&apos;est gratuit
              </Link>
            </div>
          )}
        />
      </main>
    </div>
  );
}
