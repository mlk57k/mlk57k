import Link from "next/link";
import { Shield } from "lucide-react";
import { AppLogo } from "@/components/ui/logo";

export function Footer() {
  return (
    <footer className="border-t border-cream-200 bg-cream-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div>
            <AppLogo size="md" />
            <p className="text-xs text-stone-400 max-w-xs mt-3 leading-relaxed">
              Un compagnon de réflexion quotidienne, pas un remplacement
              de suivi thérapeutique.
            </p>
          </div>

          <div className="flex gap-12 text-sm text-stone-500">
            <div className="flex flex-col gap-2.5">
              <Link
                href="/privacy"
                className="hover:text-stone-900 transition-colors duration-150"
              >
                Confidentialité
              </Link>
              <Link
                href="/terms"
                className="hover:text-stone-900 transition-colors duration-150"
              >
                CGU
              </Link>
              <Link
                href="/mentions-legales"
                className="hover:text-stone-900 transition-colors duration-150"
              >
                Mentions légales
              </Link>
              <Link
                href="/confidentialite-des-donnees"
                className="hover:text-stone-900 transition-colors duration-150"
              >
                Mes données
              </Link>
              <Link
                href="mailto:hello@ancrage.xyz"
                className="hover:text-stone-900 transition-colors duration-150"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-cream-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400">
          <p>© 2026 Ancrage. Tous droits réservés.</p>
          <div className="flex items-center gap-1.5">
            <Shield className="h-3 w-3" />
            <p>Tes écrits ne servent jamais à entraîner un modèle.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
