"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Camera, Loader2, Sparkles, RefreshCw, Check } from "lucide-react";
import { AppLogo } from "@/components/ui/logo";

interface Changement {
  titre: string;
  detail: string;
}
interface RoomAnalysis {
  score: number;
  ambiance: string;
  pointFort: string;
  changements: Changement[];
  phraseFinale: string;
}

// Réduit l'image côté client (max 1200px, JPEG) pour un envoi léger et rapide.
function downscale(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const max = 1200;
        let { width, height } = img;
        if (width > max || height > max) {
          if (width >= height) {
            height = Math.round((height * max) / width);
            width = max;
          } else {
            width = Math.round((width * max) / height);
            height = max;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("canvas"));
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = () => reject(new Error("image"));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error("read"));
    reader.readAsDataURL(file);
  });
}

function ScoreRing({ score }: { score: number }) {
  const pct = score / 10;
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative h-24 w-24 flex-none">
      <svg viewBox="0 0 80 80" className="h-24 w-24 -rotate-90">
        <circle cx="40" cy="40" r={r} fill="none" stroke="#EFE3DA" strokeWidth="7" />
        <circle
          cx="40"
          cy="40"
          r={r}
          fill="none"
          stroke="#C4523A"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-2xl font-bold text-stone-900 leading-none">{score}</span>
        <span className="text-[10px] font-medium text-stone-400">/ 10</span>
      </div>
    </div>
  );
}

export default function CoconPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RoomAnalysis | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const dataUrl = await downscale(file);
      setPreview(dataUrl);
      const res = await fetch("/api/cocon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "L'analyse a échoué.");
      setResult(data.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setPreview(null);
    setResult(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-72"
        style={{ background: "radial-gradient(60% 100% at 50% 0%, rgba(189,110,76,0.10), transparent)" }}
      />

      <header className="relative px-4 h-14 flex items-center justify-center border-b border-cream-200 bg-white/70 backdrop-blur-xl">
        <Link href="/"><AppLogo size="md" /></Link>
      </header>

      <main className="relative mx-auto max-w-md px-5 pb-24 pt-8">
        {/* Intro */}
        {!result && (
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-coral-50 border border-coral-100 px-3 py-1 text-xs font-semibold text-coral-600">
              <Sparkles className="h-3.5 w-3.5" /> Analyse ton cocon
            </span>
            <h1 className="mt-4 font-display text-[2rem] font-semibold leading-tight text-stone-900">
              Ta chambre est-elle<br />un vrai <span className="italic text-coral-500">cocon</span> ?
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-stone-500">
              Prends une photo de ta chambre. En quelques secondes, on te dit ce qui l&apos;apaise
              déjà — et les petits gestes pour en faire un lieu plus propice au calme et au sommeil.
            </p>
          </div>
        )}

        {/* Aperçu photo */}
        {preview && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-cream-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Ta chambre" className="w-full object-cover max-h-64" />
          </div>
        )}

        {/* Chargement */}
        {loading && (
          <div className="mt-6 flex flex-col items-center gap-2 text-stone-500">
            <Loader2 className="h-6 w-6 animate-spin text-coral-400" />
            <p className="text-sm">On observe ton espace…</p>
          </div>
        )}

        {/* Erreur */}
        {error && !loading && (
          <p className="mt-6 rounded-2xl bg-coral-500/10 border border-coral-400/30 px-4 py-3 text-center text-sm text-coral-600">
            {error}
          </p>
        )}

        {/* Résultat */}
        {result && !loading && (
          <div className="mt-6 animate-fade-up">
            <div className="rounded-3xl border border-cream-200 bg-white p-5 shadow-soft">
              <div className="flex items-center gap-4">
                <ScoreRing score={result.score} />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-coral-500">Ton cocon</p>
                  <p className="mt-1 text-sm leading-snug text-stone-700">{result.ambiance}</p>
                </div>
              </div>

              <div className="mt-4 flex items-start gap-2 rounded-2xl bg-emerald-500/10 px-3.5 py-3">
                <Check className="mt-0.5 h-4 w-4 flex-none text-emerald-600" />
                <p className="text-sm text-stone-700"><span className="font-semibold">Déjà réussi : </span>{result.pointFort}</p>
              </div>

              <div className="mt-5 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">À ajuster en douceur</p>
                {result.changements.map((c, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-coral-50 text-xs font-bold text-coral-500">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-stone-900">{c.titre}</p>
                      <p className="text-sm leading-snug text-stone-600">{c.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-5 border-t border-cream-200 pt-4 font-display text-[15px] italic leading-relaxed text-coral-500">
                {result.phraseFinale}
              </p>
            </div>

            {/* CTA d'inscription — le hameçon ramène vers Ancrage */}
            <div className="mt-5 rounded-3xl border border-coral-200 bg-coral-50/60 p-5 text-center">
              <p className="font-display text-lg font-semibold text-stone-900">
                Ta chambre est prête. Et toi ?
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-stone-600">
                Ancrage t&apos;aide à poser ta soirée, chaque soir, dans ce cocon. Un journal qui te
                répond et se souvient de toi.
              </p>
              <Link
                href="/auth?next=/journal"
                className="mt-4 block w-full rounded-2xl bg-gradient-coral py-3.5 text-center text-sm font-bold text-white shadow-glow-coral transition-transform active:scale-[0.98]"
              >
                Créer mon compte — c&apos;est gratuit
              </Link>
            </div>

            <button
              onClick={reset}
              className="mx-auto mt-5 flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-stone-800"
            >
              <RefreshCw className="h-4 w-4" /> Analyser une autre photo
            </button>
          </div>
        )}

        {/* Bouton principal (upload / caméra) */}
        {!result && (
          <div className="mt-8">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
            <button
              onClick={() => inputRef.current?.click()}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-coral py-4 text-base font-bold text-white shadow-glow-coral transition-transform active:scale-[0.985] disabled:opacity-60"
            >
              <Camera className="h-5 w-5" />
              {preview ? "Reprendre une photo" : "Prendre / choisir une photo"}
            </button>
            <p className="mt-3 text-center text-[11.5px] leading-relaxed text-stone-400">
              Ta photo n&apos;est jamais enregistrée — elle est analysée puis aussitôt oubliée.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
