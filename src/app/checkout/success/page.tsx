"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppLogo } from "@/components/ui/logo";

function Success() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ran = useRef(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const sessionId = searchParams.get("session_id");

    (async () => {
      if (!sessionId) {
        router.replace("/abonnement");
        return;
      }

      try {
        const res = await fetch(`/api/checkout/verify?session_id=${sessionId}`);
        const data = await res.json();

        if (data.success) {
          router.replace("/journal?bienvenue=1");
          return;
        }
      } catch {
        // best-effort
      }

      setError(true);
    })();
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="min-h-screen bg-cream-50 flex flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="font-semibold">On n&apos;a pas pu confirmer ton paiement.</p>
        <p className="text-sm text-stone-500">
          Si le prélèvement a bien eu lieu, réessaie dans une minute ou contacte-nous.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col items-center justify-center gap-3">
      <AppLogo size="sm" className="animate-pulse" />
      <p className="font-semibold">Paiement confirmé !</p>
      <p className="text-sm text-stone-500">On débloque ton accès…</p>
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
