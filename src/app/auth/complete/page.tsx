"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppLogo } from "@/components/ui/logo";

function Complete() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/journal";
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    (async () => {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("objectifs")
            .eq("id", user.id)
            .single();
          // Nouveau compte sans onboarding → quiz de personnalisation d'abord
          if (!profile?.objectifs) {
            router.replace("/onboarding");
            return;
          }
        }
      } catch {
        // en cas d'erreur, on continue vers la destination par défaut
      }
      router.replace(next);
    })();
  }, [next, router]);

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col items-center justify-center gap-3">
      <AppLogo size="sm" className="animate-pulse" />
      <p className="text-stone-500 text-sm">On prépare ton espace…</p>
    </div>
  );
}

export default function CompletePage() {
  return (
    <Suspense fallback={null}>
      <Complete />
    </Suspense>
  );
}
