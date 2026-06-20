import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GlowyLogo } from "@/components/ui/logo";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-cream-200/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="cursor-pointer">
          <GlowyLogo size="md" />
        </Link>
        <nav className="hidden sm:flex items-center gap-8 text-sm font-medium text-stone-500">
          <Link href="#how" className="hover:text-stone-900 transition-colors duration-150">
            Comment ça marche
          </Link>
          <Link href="#faq" className="hover:text-stone-900 transition-colors duration-150">
            FAQ
          </Link>
        </nav>
        <Button
          asChild
          size="sm"
          className="rounded-full px-5 bg-coral-400 hover:bg-coral-500 text-white border-none shadow-md shadow-coral-200"
        >
          <Link href="/scan">Scanner ma peau</Link>
        </Button>
      </div>
    </header>
  );
}
