import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTABanner() {
  return (
    <section className="bg-coral-400 py-16 sm:py-20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 text-center">
        <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white mb-4">
          Ce soir, dépose ta journée.
        </h2>
        <p className="text-white/80 text-lg mb-8 leading-relaxed">
          Trois minutes suffisent. Ancrage t&apos;écoute et te renvoie un reflet doux pour fermer l&apos;esprit plus léger.
        </p>
        <Button
          asChild
          size="lg"
          className="bg-white text-coral-500 hover:bg-cream-50 border-none shadow-lift px-8 h-14 text-base font-semibold"
        >
          <Link href="/auth">
            Commencer ce soir
            <ArrowRight className="h-5 w-5 ml-1" />
          </Link>
        </Button>
        <p className="text-white/60 text-sm mt-4">Gratuit · 7 jours d&apos;essai · sans carte bancaire</p>
      </div>
    </section>
  );
}
