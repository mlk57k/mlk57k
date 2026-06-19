"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Camera, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScoreHero } from "@/components/results/score-hero";
import { IssuesList } from "@/components/results/issues-list";
import { RoutinePaywall } from "@/components/results/routine-paywall";
import { getScan } from "@/lib/scan-storage";
import type { StoredScan } from "@/lib/scan-schema";

export default function ResultsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const [scan, setScan] = useState<StoredScan | null | undefined>(undefined);

  useEffect(() => {
    const local = getScan(id);
    if (local) {
      setScan(local);
      return;
    }
    // Scan absent du sessionStorage (ex : lien depuis le dashboard) → API
    fetch(`/api/scans/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) { setScan(null); return; }
        setScan({
          id: data.id,
          skin_score: data.skin_score,
          skin_age: data.skin_age,
          issues: data.issues ?? [],
          routine: data.routine ?? [],
          unlocked: data.unlocked ?? false,
          created_at: data.created_at,
        });
      })
      .catch(() => setScan(null));
  }, [id]);

  // Chargement
  if (scan === undefined) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="flex items-center gap-2 text-stone-500">
          <Camera className="h-5 w-5 animate-pulse text-coral-400" />
          Chargement de ton aperçu…
        </div>
      </div>
    );
  }

  // Scan introuvable / expiré
  if (scan === null) {
    return (
      <div className="min-h-screen bg-cream-50 flex flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="h-14 w-14 rounded-2xl bg-coral-50 flex items-center justify-center">
          <Camera className="h-7 w-7 text-coral-400" />
        </div>
        <div>
          <p className="font-semibold mb-1">Cet aperçu n&apos;est plus disponible</p>
          <p className="text-sm text-stone-500">
            Ton résultat a expiré ou n&apos;existe pas. Refais un scan, c&apos;est rapide !
          </p>
        </div>
        <Button asChild>
          <Link href="/scan">
            <Camera className="h-5 w-5" />
            Refaire un scan
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <header className="sticky top-0 z-10 px-4 h-14 flex items-center justify-center border-b border-cream-200/60 bg-white/80 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="font-display italic text-xl font-bold text-gradient-coral">glowy</span>
        </Link>
      </header>

      <main className="mx-auto max-w-md px-4 py-8 space-y-10">
        <ScoreHero score={scan.skin_score} age={scan.skin_age} />

        <IssuesList issues={scan.issues} />

        <RoutinePaywall routine={scan.routine} unlocked={scan.unlocked ?? false} />

        {/* Rescan + réassurance */}
        <div className="space-y-4 pt-2">
          <Button asChild variant="secondary" className="w-full">
            <Link href="/scan">
              <Camera className="h-5 w-5" />
              Refaire un scan
            </Link>
          </Button>
          <p className="text-center text-xs text-stone-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" />
            Ceci est un aperçu cosmétique informatif, pas un avis médical.
          </p>
        </div>
      </main>
    </div>
  );
}
