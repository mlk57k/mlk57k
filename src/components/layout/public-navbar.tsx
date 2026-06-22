import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PublicNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="text-lg font-bold">Libero</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          <Link href="/#fonctionnement" className="hover:text-foreground transition-colors">
            Comment ça marche
          </Link>
          <Link href="/pricing" className="hover:text-foreground transition-colors">
            Tarifs
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/auth">
            <Button variant="ghost" size="sm">
              Connexion
            </Button>
          </Link>
          <Link href="/auth?mode=signup">
            <Button size="sm">Essai gratuit</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
