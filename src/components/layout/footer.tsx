import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-beige-200 bg-white/60">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <Link href="/" className="flex items-center gap-2 font-semibold text-lg mb-2">
              <Sparkles className="h-4 w-4 text-coral-500" />
              <span className="text-gradient-coral">Glowy</span>
            </Link>
            <p className="text-xs text-muted-foreground max-w-xs">
              Aperçu de ta peau par IA. Usage informatif uniquement, pas un avis médical.
            </p>
          </div>

          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Politique de confidentialité</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Conditions d&apos;utilisation</Link>
            <Link href="mailto:hello@glowy.app" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-beige-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© 2024 Glowy. Tous droits réservés.</p>
          <p className="text-center">
            🔒 Tes photos ne sont jamais stockées ni revendues à des tiers.
          </p>
        </div>
      </div>
    </footer>
  );
}
