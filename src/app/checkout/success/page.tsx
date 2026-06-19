"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles } from "lucide-react";
import { patchScan, getLastScanId } from "@/lib/scan-storage";

function Success() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const sessionId = searchParams.get("session_id");

    (async () => {
      if (!sessionId) {
        router.replace("/dashboard");
        return;
      }

      try {
        const res = await fetch(`/api/checkout/verify?session_id=${sessionId}`);
        const data = await res.json();

        if (data.success) {
          // Met à jour le sessionStorage pour que la page résultats affiche la routine
          const localId = getLastScanId();
          if (localId) patchScan(localId, { unlocked: true });

          // Redirige vers les résultats si on a un scan en base, sinon le dashboard
          if (data.scan_id) {
            router.replace(`/results/${localId ?? data.scan_id}`);
          } else {
            router.replace("/dashboard");
          }
          return;
        }
      } catch {
        // best-effort
      }

      router.replace("/dashboard");
    })();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col items-center justify-center gap-3">
      <Sparkles className="h-10 w-10 text-coral-400 animate-pulse" />
      <p className="font-semibold">Paiement confirmé !</p>
      <p className="text-sm text-stone-500">Débloquage de ta routine…</p>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={null}>
      <Success />
    </Suspense>
  );
}
