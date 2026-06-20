import Link from "next/link";
import { Shield } from "lucide-react";
import { GlowyLogo } from "@/components/ui/logo";

export function Footer() {
  return (
    <footer className="border-t border-cream-200 bg-cream-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div>
            <GlowyLogo size="md" />
            <p className="text-xs text-stone-400 max-w-xs mt-3 leading-relaxed">
              Aperçu cosmétique de ta peau par IA. Usage informatif uniquement,
              pas un avis médical.
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
                href="mailto:hello@glowy.app"
                className="hover:text-stone-900 transition-colors duration-150"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-cream-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400">
          <p>© 2025 Glowy. Tous droits réservés.</p>
          <div className="flex items-center gap-1.5">
            <Shield className="h-3 w-3" />
            <p>Tes photos ne sont jamais stockées ni partagées.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
