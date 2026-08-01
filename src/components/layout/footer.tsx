import Link from "next/link";

export function Footer() {
  return (
    <footer className="px-5 sm:px-8 lg:px-14">
      <div className="border-t border-[#33241A]/[0.08] pt-7 pb-8 flex flex-col gap-5">
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-[12.5px] text-[#6B5545]">
          <Link href="/faq" className="hover:text-[#33241A] transition-colors">FAQ</Link>
          <Link href="/privacy" className="hover:text-[#33241A] transition-colors">Confidentialité</Link>
          <Link href="/terms" className="hover:text-[#33241A] transition-colors">CGU</Link>
          <Link href="/mentions-legales" className="hover:text-[#33241A] transition-colors">Mentions légales</Link>
          <Link href="/confidentialite-des-donnees" className="hover:text-[#33241A] transition-colors">Mes données</Link>
          <Link href="mailto:contact@ancrage.xyz" className="hover:text-[#33241A] transition-colors">Contact</Link>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#9A8270] text-center">
          <span>© 2026 Ancrage. Tous droits réservés.</span>
          <span>Tes écrits ne servent jamais à entraîner un modèle.</span>
        </div>
      </div>
    </footer>
  );
}
