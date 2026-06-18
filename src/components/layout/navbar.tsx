import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-beige-200 bg-beige-50/90 backdrop-blur-md">
      <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
          <Sparkles className="h-5 w-5 text-coral-500" />
          <span className="text-gradient-coral">Glowy</span>
        </Link>

        <nav className="hidden sm:flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="#how" className="hover:text-foreground transition-colors">Comment ça marche</Link>
          <Link href="#faq" className="hover:text-foreground transition-colors">FAQ</Link>
        </nav>

        <Button asChild size="sm">
          <Link href="/scan">Scanner ma peau</Link>
        </Button>
      </div>
    </header>
  );
}
