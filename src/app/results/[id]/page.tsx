"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { getScan } from "@/lib/scan-storage";
import type { StoredScan } from "@/lib/scan-schema";

// Page provisoire — la version finale (score en gros, paywall flouté) arrive à l'étape 3.
export default function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [scan, setScan] = useState<StoredScan | null | undefined>(undefined);

  useEffect(() => {
    setScan(getScan(id));
  }, [id]);

  if (scan === undefined) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Chargement…</div>;
  }

  if (scan === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-muted-foreground">Ce résultat n&apos;est plus disponible.</p>
        <Link href="/scan" className="text-coral-500 font-semibold underline">
          Refaire un scan
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-glowy p-6">
      <div className="mx-auto max-w-md">
        <h1 className="text-2xl font-bold mb-4">Résultat (provisoire)</h1>
        <pre className="text-xs bg-white rounded-2xl border border-beige-200 p-4 overflow-auto">
          {JSON.stringify(scan, null, 2)}
        </pre>
        <Link href="/scan" className="mt-4 inline-block text-coral-500 font-semibold underline">
          Refaire un scan
        </Link>
      </div>
    </div>
  );
}
