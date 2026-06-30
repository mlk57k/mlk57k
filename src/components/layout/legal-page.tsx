import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AppLogo } from "@/components/ui/logo";

interface Props {
  title: string;
  subtitle: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export function LegalPage({ title, subtitle, lastUpdated, children }: Props) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-cream-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/">
            <AppLogo size="md" />
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Retour
          </Link>
        </div>
      </header>

      {/* Hero section */}
      <div className="bg-gradient-to-b from-cream-50 to-white border-b border-cream-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 mb-2">
            {title}
          </h1>
          <p className="text-stone-500">{subtitle}</p>
          <p className="mt-2 text-xs text-stone-400">
            Dernière mise à jour : {lastUpdated}
          </p>
        </div>
      </div>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
        <div className="prose prose-stone prose-sm sm:prose-base max-w-none
          prose-headings:font-display prose-headings:font-bold prose-headings:text-stone-900
          prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-cream-200 prose-h2:pb-2
          prose-h3:text-base prose-h3:mt-6 prose-h3:mb-2
          prose-p:text-stone-600 prose-p:leading-relaxed
          prose-li:text-stone-600
          prose-a:text-coral-500 prose-a:no-underline hover:prose-a:underline
          prose-strong:text-stone-800">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-cream-200 bg-cream-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400">
          <p>© 2026 Ancrage. Tous droits réservés.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-stone-700 transition-colors">Confidentialité</Link>
            <Link href="/terms" className="hover:text-stone-700 transition-colors">CGU</Link>
            <Link href="/mentions-legales" className="hover:text-stone-700 transition-colors">Mentions légales</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
