"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GlowyLogo } from "@/components/ui/logo";

async function getUser() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  try {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
}

export function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    getUser().then((u) => setIsLoggedIn(!!u));

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;
    let sub: { unsubscribe: () => void } | null = null;
    import("@/lib/supabase/client").then(({ createClient }) => {
      const supabase = createClient();
      const { data } = supabase.auth.onAuthStateChange((_, session) => {
        setIsLoggedIn(!!session?.user);
      });
      sub = data.subscription;
    });
    return () => sub?.unsubscribe();
  }, []);

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
        <div className="flex items-center gap-2">
          {isLoggedIn === false && (
            <Button
              asChild
              size="sm"
              variant="ghost"
              className="rounded-full px-4 text-stone-600 hover:text-stone-900"
            >
              <Link href="/auth">Se connecter</Link>
            </Button>
          )}
          <Button
            asChild
            size="sm"
            className="rounded-full px-5 bg-coral-400 hover:bg-coral-500 text-white border-none shadow-md shadow-coral-200"
          >
            <Link href="/scan">Scanner ma peau</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
