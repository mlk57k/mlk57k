import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, Zap } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      {/* Orbes décoratifs */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-coral-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-beige-300/60 blur-3xl" />

      <div className="relative mx-auto max-w-5xl px-4 text-center">
        {/* Badge social proof */}
        <div className="mb-6 flex justify-center">
          <Badge variant="secondary" className="gap-1.5 py-1.5 px-4 text-sm">
            <Star className="h-3.5 w-3.5 fill-coral-400 text-coral-400" />
            <span>+12 000 analyses cette semaine</span>
          </Badge>
        </div>

        {/* Headline principale */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-balance mb-6 leading-tight">
          Découvre l&apos;âge réel{" "}
          <span className="text-gradient-coral">de ta peau</span>
          <br className="hidden sm:block" />
          {" "}en 10 secondes
        </h1>

        <p className="mx-auto max-w-xl text-lg text-muted-foreground mb-8 text-pretty">
          Prends juste une selfie. Notre IA analyse ta peau et te donne un aperçu
          personnalisé : score, hydratation, points à améliorer — le tout gratuitement.
        </p>

        {/* CTA Principal */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild size="lg" className="w-full sm:w-auto shadow-xl shadow-coral-200">
            <Link href="/scan">
              <Zap className="h-5 w-5" />
              Scanner mon visage
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground">
            Gratuit · Aucun compte requis
          </p>
        </div>

        {/* Mockup résultats */}
        <div className="mt-12 mx-auto max-w-sm">
          <div className="rounded-3xl border border-beige-200 bg-white/90 shadow-2xl shadow-beige-300/50 p-6 text-left">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-muted-foreground">Score de peau</p>
                <p className="text-4xl font-bold text-gradient-coral">82</p>
                <p className="text-xs text-muted-foreground">/ 100</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Âge estimé</p>
                <p className="text-4xl font-bold">24</p>
                <p className="text-xs text-coral-500 font-medium">ans</p>
              </div>
            </div>

            <div className="space-y-2">
              {[
                { label: "Hydratation", value: 78 },
                { label: "Éclat", value: 85 },
                { label: "Texture", value: 72 },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-20 shrink-0">{item.label}</span>
                  <div className="flex-1 h-2 rounded-full bg-beige-200 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-coral-400 to-coral-500 rounded-full"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold w-8 text-right">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-beige-100 blur-sm select-none">
              <p className="text-xs font-semibold mb-2">Routine personnalisée</p>
              <div className="space-y-1.5">
                {["Sérum vitamine C", "SPF 50+", "Acide hyaluronique"].map((r) => (
                  <div key={r} className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-coral-400" />
                    <span className="text-xs text-muted-foreground">{r}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
