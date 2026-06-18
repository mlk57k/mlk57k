"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles } from "lucide-react";
import { getLastScanId, getScan } from "@/lib/scan-storage";

/**
 * Étape post-connexion : si un scan temporaire existe en session, on le
 * rattache au compte, puis on redirige vers la destination (`next`).
 */
function Complete() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/checkout";
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    (async () => {
      const lastId = getLastScanId();
      const scan = lastId ? getScan(lastId) : null;

      if (scan) {
        try {
          await fetch("/api/scans/attach", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              skin_score: scan.skin_score,
              skin_age: scan.skin_age,
              issues: scan.issues,
              routine: scan.routine,
            }),
          });
        } catch {
          // Rattachement best-effort : on continue même en cas d'échec.
        }
      }

      router.replace(next);
    })();
  }, [next, router]);

  return (
    <div className="min-h-screen bg-gradient-glowy flex flex-col items-center justify-center gap-3">
      <Sparkles className="h-8 w-8 text-coral-500 animate-pulse" />
      <p className="text-muted-foreground text-sm">On prépare ton espace…</p>
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
