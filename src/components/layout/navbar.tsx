import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

function GlowyLogo() {
  return (
    <Link href="/" className="flex items-center cursor-pointer">
      <Image
        src="/logo.png"
        alt="Glowy"
        width={120}
        height={48}
        className="h-12 w-auto object-contain"
        priority
      />
    </Link>
  );
}

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-cream-200/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <GlowyLogo />
        <nav className="hidden sm:flex items-center gap-8 text-sm font-medium text-stone-500">
          <Link href="#how" className="hover:text-stone-900 transition-colors duration-150">Comment ça marche</Link>
          <Link href="#faq" className="hover:text-stone-900 transition-colors duration-150">FAQ</Link>
        </nav>
        <Button asChild size="sm" className="rounded-full px-5 bg-coral-400 hover:bg-coral-500 text-white border-none shadow-md shadow-coral-200">
          <Link href="/scan">Scanner ma peau</Link>
        </Button>
      </div>
    </header>
  );
}
