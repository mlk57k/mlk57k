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
    router.replace(next);
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
