import Link from "next/link";
import { redirect } from "next/navigation";
import { Camera, Lock, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { ScoreChart } from "@/components/dashboard/score-chart";

function scoreColor(score: number) {
  if (score >= 70) return "text-emerald-500";
  if (score >= 45) return "text-amber-500";
  return "text-coral-500";
}

function scoreBg(score: number) {
  if (score >= 70) return "bg-emerald-50";
  if (score >= 45) return "bg-amber-50";
  return "bg-coral-50";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatShort(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
}

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth?next=/dashboard");
  }

  const { data: scans } = await supabase
    .from("scans")
    .select("id, skin_score, skin_age, unlocked, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  const scanList = scans ?? [];

  const chartData = scanList.map((s) => ({
    date: formatShort(s.created_at),
    score: s.skin_score,
    label: formatDate(s.created_at),
  }));

  const latest = scanList.at(-1);
  const firstName = user.email?.split("@")[0] ?? "toi";

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <header className="sticky top-0 z-10 px-4 h-14 flex items-center justify-center border-b border-cream-200/60 bg-white/80 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="font-display italic text-xl font-bold text-gradient-coral">glowy</span>
        </Link>
      </header>

      <main className="mx-auto max-w-md px-4 py-8 space-y-8">
        {/* Greeting */}
        <div>
          <h1 className="font-display text-2xl font-bold">Bonjour, {firstName} ✨</h1>
          <p className="text-sm text-stone-500 mt-1">
            {scanList.length === 0
              ? "Lance ton premier scan pour voir ton score."
              : `${scanList.length} scan${scanList.length > 1 ? "s" : ""} enregistré${scanList.length > 1 ? "s" : ""}`}
          </p>
        </div>

        {/* Score summary card */}
        {latest && (
          <div className="rounded-2xl bg-white border border-cream-200 p-5 flex items-center gap-4">
            <div
              className={`h-16 w-16 rounded-2xl ${scoreBg(latest.skin_score)} flex flex-col items-center justify-center shrink-0`}
            >
              <span className={`text-2xl font-bold leading-none ${scoreColor(latest.skin_score)}`}>
                {latest.skin_score}
              </span>
              <span className="text-[10px] text-stone-400 mt-0.5">/100</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">Dernier score</p>
              <p className="text-xs text-stone-400">{formatDate(latest.created_at)}</p>
            </div>
            <Link
              href={`/results/${latest.id}`}
              className="text-xs font-semibold text-coral-400 underline shrink-0"
            >
              Voir
            </Link>
          </div>
        )}

        {/* Evolution chart */}
        {scanList.length >= 2 && (
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-coral-400" />
              <h2 className="font-semibold text-sm">Évolution de ton score</h2>
            </div>
            <div className="rounded-2xl bg-white border border-cream-200 p-4">
              <ScoreChart data={chartData} />
            </div>
          </section>
        )}

        {/* Scan history */}
        {scanList.length > 0 ? (
          <section className="space-y-3">
            <h2 className="font-semibold text-sm">Historique des scans</h2>
            <ul className="space-y-2">
              {[...scanList].reverse().map((scan) => (
                <li key={scan.id}>
                  <Link
                    href={`/results/${scan.id}`}
                    className="flex items-center gap-3 rounded-2xl bg-white border border-cream-200 px-4 py-3 hover:border-coral-300 transition-colors"
                  >
                    {/* Score bubble */}
                    <div
                      className={`h-10 w-10 rounded-xl ${scoreBg(scan.skin_score)} flex flex-col items-center justify-center shrink-0`}
                    >
                      <span className={`text-sm font-bold leading-none ${scoreColor(scan.skin_score)}`}>
                        {scan.skin_score}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{formatDate(scan.created_at)}</p>
                      <p className="text-xs text-stone-400">
                        Âge estimé : {scan.skin_age} ans
                      </p>
                    </div>

                    {/* Lock indicator */}
                    {!scan.unlocked && (
                      <Lock className="h-4 w-4 text-stone-400 shrink-0" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : (
          /* Empty state */
          <div className="rounded-2xl border-2 border-dashed border-cream-200 p-10 flex flex-col items-center gap-3 text-center">
            <Camera className="h-8 w-8 text-stone-400" />
            <p className="font-medium">Aucun scan pour l&apos;instant</p>
            <p className="text-sm text-stone-500 max-w-xs">
              Prends ton premier selfie pour analyser ta peau et débloquer ta routine.
            </p>
          </div>
        )}

        {/* CTA */}
        <Button asChild className="w-full bg-coral-400 hover:bg-coral-500 text-white h-12">
          <Link href="/scan">
            <Camera className="h-5 w-5" />
            Nouveau scan
          </Link>
        </Button>
      </main>
    </div>
  );
}
