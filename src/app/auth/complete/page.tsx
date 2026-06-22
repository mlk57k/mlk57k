"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function Complete() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    (async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/auth");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_completed")
        .eq("id", user.id)
        .single();

      if (!profile?.onboarding_completed) {
        router.replace("/onboarding");
      } else {
        router.replace(next);
      }
    })();
  }, [next, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3">
      <Sparkles className="h-8 w-8 text-primary animate-pulse" />
      <p className="text-sm text-muted-foreground">On prépare ton espace…</p>
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
