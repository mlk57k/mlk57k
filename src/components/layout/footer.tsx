import Link from "next/link";
import { Shield } from "lucide-react";

function GlowyLogo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 cursor-pointer">
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="16" fill="url(#footer-logo-gradient)"/>
        <text x="16" y="22" textAnchor="middle" fill="white" fontSize="18" fontWeight="700" fontStyle="italic" fontFamily="Georgia, serif">G</text>
        <defs>
          <linearGradient id="footer-logo-gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E8826A"/>
            <stop offset="100%" stopColor="#dc6b51"/>
          </linearGradient>
        </defs>
      </svg>
      <span className="font-display italic text-lg font-bold text-gradient-coral">glowy</span>
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-cream-200 bg-cream-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div>
            <GlowyLogo />
            <p className="text-xs text-stone-400 max-w-xs mt-3 leading-relaxed">
              Aperçu cosmétique de ta peau par IA. Usage informatif uniquement, pas un avis médical.
            </p>
          </div>

          <div className="flex gap-12 text-sm text-stone-500">
            <div className="flex flex-col gap-2.5">
              <Link href="/privacy" className="hover:text-stone-900 transition-colors duration-150">Confidentialité</Link>
              <Link href="/terms" className="hover:text-stone-900 transition-colors duration-150">CGU</Link>
              <Link href="mailto:hello@glowy.app" className="hover:text-stone-900 transition-colors duration-150">Contact</Link>
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
