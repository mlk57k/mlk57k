import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-16 pb-24 sm:pt-24 sm:pb-32">
      {/* Fond dégradé subtil */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white via-cream-50 to-coral-50/30" />
      {/* Blob décoratif */}
      <div className="pointer-events-none absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-coral-50/60 blur-[120px] -translate-y-1/2 translate-x-1/3" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-cream-100/80 blur-[100px] translate-y-1/2 -translate-x-1/4" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 text-center">
        {/* Pill badge */}
        <div className="inline-flex items-center gap-2 rounded-full bg-coral-50 border border-coral-200 px-4 py-1.5 text-sm font-medium text-coral-600 mb-8">
          <Sparkles className="h-3.5 w-3.5" />
          <span>+12 000 analyses cette semaine</span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-balance text-stone-900 mb-6">
          Découvre l&apos;âge réel
          <br />
          <span className="text-gradient-coral italic">de ta peau</span>
        </h1>

        <p className="mx-auto max-w-lg text-lg sm:text-xl text-stone-500 mb-10 text-pretty leading-relaxed">
          Prends une selfie. Notre IA analyse ta peau en quelques secondes
          et te donne ton score, ton âge cutané, et une routine sur-mesure.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="rounded-full bg-coral-400 hover:bg-coral-500 text-white border-none shadow-xl shadow-coral-200/50 px-8 h-14 text-base font-semibold">
            <Link href="/scan">
              Scanner ma peau
              <ArrowRight className="h-5 w-5 ml-1" />
            </Link>
          </Button>
          <p className="text-sm text-stone-400 font-medium">Gratuit · Aucun compte requis</p>
        </div>

        {/* Mockup carte résultats */}
        <div className="mt-16 mx-auto max-w-xs">
          <div className="relative rounded-3xl border border-cream-200 bg-white shadow-2xl shadow-stone-200/60 p-6 text-left">
            {/* Glow derrière la carte */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-coral-50/50 to-transparent -z-10 blur-xl scale-110" />

            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-xs font-medium text-stone-400 uppercase tracking-wider mb-1">Score de peau</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-display font-bold text-gradient-coral">82</span>
                  <span className="text-lg text-stone-400">/100</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-stone-400 uppercase tracking-wider mb-1">Âge cutané</p>
                <div className="flex items-baseline gap-1 justify-end">
                  <span className="text-5xl font-display font-bold text-stone-900">24</span>
                  <span className="text-lg text-stone-400">ans</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-5">
              {[
                { label: "Hydratation", value: 78 },
                { label: "Éclat", value: 85 },
                { label: "Texture", value: 72 },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="text-xs text-stone-500 w-20 shrink-0 font-medium">{item.label}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-cream-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-coral-300 to-coral-400"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-stone-600 w-7 text-right">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-cream-200 blur-sm select-none">
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2.5">Routine personnalisée</p>
              <div className="space-y-1.5">
                {["Sérum vitamine C", "SPF 50+", "Acide hyaluronique"].map((r) => (
                  <div key={r} className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-coral-400 shrink-0" />
                    <span className="text-xs text-stone-500">{r}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Label sous la carte */}
          <p className="mt-4 text-center text-xs text-stone-400 font-medium">
            🔒 Routine débloquée après analyse
          </p>
        </div>
      </div>
    </section>
  );
}
