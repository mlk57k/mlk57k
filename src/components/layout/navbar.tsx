import Link from "next/link";
import { Button } from "@/components/ui/button";

function GlowyLogo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 cursor-pointer">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="16" fill="url(#logo-gradient)"/>
        <text x="16" y="22" textAnchor="middle" fill="white" fontSize="18" fontWeight="700" fontStyle="italic" fontFamily="Georgia, serif">G</text>
        <defs>
          <linearGradient id="logo-gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E8826A"/>
            <stop offset="100%" stopColor="#dc6b51"/>
          </linearGradient>
        </defs>
      </svg>
      <span className="font-display italic text-xl font-bold text-gradient-coral">glowy</span>
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
