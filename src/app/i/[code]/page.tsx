"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { AppLogo } from "@/components/ui/logo";

type Stats = { code: string; signups: number; paywall: number; paid: number };

function Dashboard() {
  const params = useParams();
  const searchParams = useSearchParams();
  const code = String(params.code ?? "");
  const token = searchParams.get("token") ?? "";

  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/influencer-stats?code=${encodeURIComponent(code)}&token=${encodeURIComponent(token)}`);
        if (!res.ok) throw new Error();
        setStats(await res.json());
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [code, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex flex-col items-center justify-center gap-3">
        <AppLogo size="sm" className="animate-pulse" />
        <p className="text-stone-500 text-sm">Chargement de tes statistiques…</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-cream-50 flex flex-col items-center justify-center gap-3 px-6 text-center">
        <AppLogo size="sm" />
        <p className="font-display text-xl font-bold text-stone-900">Lien invalide</p>
        <p className="text-sm text-stone-500">Ce lien de tableau de bord n&apos;est pas valide. Demande-en un nouveau.</p>
      </div>
    );
  }

  const cards = [
    { label: "Inscrits amenés", value: stats.signups, hint: "Personnes qui ont créé un compte grâce à toi" },
    { label: "Ont accroché", value: stats.paywall, hint: "Ont utilisé leurs 10 confidences offertes" },
    { label: "Abonnés", value: stats.paid, hint: "Sont passés à l'illimité 💛" },
  ];

  return (
    <div className="min-h-screen bg-cream-50">
      <header className="border-b border-cream-200 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-2xl px-5 h-14 flex items-center">
          <AppLogo size="md" />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-5 py-12">
        <p className="text-sm font-medium uppercase tracking-wide text-coral-500 mb-1">Ton tableau de bord</p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 mb-2">
          Merci, <span className="text-coral-500">{stats.code}</span> 🌙
        </h1>
        <p className="text-stone-500 mb-8">Voici l&apos;impact de ton lien Ancrage, en temps réel.</p>

        <div className="grid gap-4 sm:grid-cols-3">
          {cards.map((c) => (
            <div key={c.label} className="rounded-3xl border border-cream-200 bg-white p-5 shadow-soft">
              <p className="font-display text-4xl font-bold text-stone-900">{c.value}</p>
              <p className="mt-1 text-sm font-semibold text-stone-700">{c.label}</p>
              <p className="mt-1 text-xs text-stone-400 leading-snug">{c.hint}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl bg-cream-100 border border-cream-200 p-5">
          <p className="text-sm text-stone-600">
            Ton lien à partager :{" "}
            <span className="font-semibold text-stone-800">ancrage.xyz/?ref={stats.code}</span>
          </p>
          <p className="mt-2 text-xs text-stone-400">
            Cette page se met à jour automatiquement — reviens quand tu veux pour suivre tes chiffres.
          </p>
        </div>
      </main>
    </div>
  );
}

export default function InfluencerDashboardPage() {
  return (
    <Suspense fallback={null}>
      <Dashboard />
    </Suspense>
  );
}
