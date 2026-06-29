"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  function handleScanClick() {
    if (isLoggedIn) {
      router.push("/scan");
    } else {
      router.push("/auth?next=/scan");
    }
  }

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
    <header className="sticky top-0 z-50 w-full glass border-b border-cream-200/50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="cursor-pointer transition-transform duration-200 hover:scale-[1.03]">
          <GlowyLogo size="md" />
        </Link>
        <nav className="hidden sm:flex items-center gap-8 text-sm font-medium text-stone-500">
          <Link href="#how" className="relative hover:text-stone-900 transition-colors duration-150 after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-coral-400 after:transition-all hover:after:w-full">
            Comment ça marche
          </Link>
          <Link href="#faq" className="relative hover:text-stone-900 transition-colors duration-150 after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-coral-400 after:transition-all hover:after:w-full">
            FAQ
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          {isLoggedIn === true && (
            <>
              <Button
                asChild
                size="sm"
                variant="ghost"
                className="rounded-full px-4 text-stone-600 hover:text-stone-900"
              >
                <Link href="/dashboard">Mon compte</Link>
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="rounded-full px-4 text-stone-500 hover:text-stone-900"
                onClick={async () => {
                  const { createClient } = await import("@/lib/supabase/client");
                  await createClient().auth.signOut();
                  window.location.assign("/");
                }}
              >
                Se déconnecter
              </Button>
            </>
          )}
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
            size="sm"
            className="rounded-full px-5 bg-coral-400 hover:bg-coral-500 text-white border-none shadow-md shadow-coral-200"
            onClick={handleScanClick}
          >
            Scanner ma peau
          </Button>
        </div>
      </div>
    </header>
  );
}
