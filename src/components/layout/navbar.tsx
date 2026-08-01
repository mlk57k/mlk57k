"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

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

  function handleStartClick() {
    // On va toujours vers /journal : le middleware redirige vers /auth si l'utilisateur
    // n'est pas connecté, et laisse passer s'il l'est.
    router.push("/journal");
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
    <header className="border-b border-[#33241A]/[0.08]">
      <div className="flex items-center justify-between px-5 sm:px-8 lg:px-14 py-4 sm:py-[22px]">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/icon-512.png"
            alt="Ancrage"
            width={44}
            height={44}
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-[10px]"
          />
          <span className="font-display text-lg sm:text-xl font-semibold text-[#33241A]">Ancrage</span>
        </Link>

        <div className="flex items-center gap-4 sm:gap-[26px] text-sm">
          <Link href="#how" className="hidden sm:inline text-[#6B5545] hover:text-[#33241A] transition-colors">
            Comment ça marche
          </Link>
          <Link href="/faq" className="hidden sm:inline text-[#6B5545] hover:text-[#33241A] transition-colors">
            FAQ
          </Link>

          {isLoggedIn === true && (
            <Link href="/journal" className="hidden sm:inline text-[#6B5545] hover:text-[#33241A] transition-colors">
              Mon journal
            </Link>
          )}
          {isLoggedIn !== true && (
            <Link href="/auth" className="hidden sm:inline text-[#6B5545] hover:text-[#33241A] transition-colors">
              Se connecter
            </Link>
          )}

          <button
            onClick={handleStartClick}
            className="rounded-full bg-[#33241A] px-4 sm:px-[18px] py-2.5 text-[13px] sm:text-sm font-semibold text-[#FBF7EE] transition-opacity hover:opacity-90"
          >
            Commencer<span className="hidden sm:inline"> mon journal</span>
          </button>
        </div>
      </div>
    </header>
  );
}
