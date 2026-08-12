"use client";

import { useRef, useState } from "react";
import { Camera, Loader2, Check, RefreshCw } from "lucide-react";
import type { RoomAnalysis } from "@/lib/anthropic";
import { downscaleImage } from "@/lib/image";

function ScoreRing({ score }: { score: number }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative h-24 w-24 flex-none">
      <svg viewBox="0 0 80 80" className="h-24 w-24 -rotate-90">
        <circle cx="40" cy="40" r={r} fill="none" stroke="#EFE3DA" strokeWidth="7" />
        <circle
          cx="40" cy="40" r={r} fill="none" stroke="#C4523A" strokeWidth="7" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - score / 10)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-2xl font-bold text-stone-900 leading-none">{score}</span>
        <span className="text-[10px] font-medium text-stone-400">/ 10</span>
      </div>
    </div>
  );
}

/**
 * Cœur réutilisable du « Cocon » : photo → analyse → carte-résultat.
 * Utilisé par la page publique /cocon ET par l'étape d'onboarding.
 * Le parent fournit l'intro (avant analyse) et le pied (après résultat).
 */
export function CoconAnalyzer({
  intro,
  photoLabel = "Prendre / choisir une photo",
  onResult,
  renderFooter,
}: {
  intro?: React.ReactNode;
  photoLabel?: string;
  onResult?: (a: RoomAnalysis) => void;
  renderFooter?: (opts: { analysis: RoomAnalysis; reset: () => void }) => React.ReactNode;
}) {
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
      const dataUrl = await downscaleImage(file);
      setPreview(dataUrl);
      const res = await fetch("/api/cocon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "L'analyse a échoué.");
      setResult(data.analysis);
      onResult?.(data.analysis);
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
    <div>
      {!result && intro}

      {preview && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-cream-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Ta chambre" className="w-full object-cover max-h-64" />
        </div>
      )}

      {loading && (
        <div className="mt-6 flex flex-col items-center gap-2 text-stone-500">
          <Loader2 className="h-6 w-6 animate-spin text-coral-400" />
          <p className="text-sm">On observe ton espace…</p>
        </div>
      )}

      {error && !loading && (
        <p className="mt-6 rounded-2xl bg-coral-500/10 border border-coral-400/30 px-4 py-3 text-center text-sm text-coral-600">
          {error}
        </p>
      )}

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

            {result.pointFort && (
              <div className="mt-4 flex items-start gap-2 rounded-2xl bg-emerald-500/10 px-3.5 py-3">
                <Check className="mt-0.5 h-4 w-4 flex-none text-emerald-600" />
                <p className="text-sm text-stone-700"><span className="font-semibold">Déjà réussi : </span>{result.pointFort}</p>
              </div>
            )}

            {result.changements.length > 0 && (
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
            )}

            {result.phraseFinale && (
              <p className="mt-5 border-t border-cream-200 pt-4 font-display text-[15px] italic leading-relaxed text-coral-500">
                {result.phraseFinale}
              </p>
            )}
          </div>

          {renderFooter?.({ analysis: result, reset })}

          <button
            onClick={reset}
            className="mx-auto mt-5 flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-stone-800"
          >
            <RefreshCw className="h-4 w-4" /> Analyser une autre photo
          </button>
        </div>
      )}

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
            {preview ? "Reprendre une photo" : photoLabel}
          </button>
          <p className="mt-3 text-center text-[11.5px] leading-relaxed text-stone-400">
            Ta photo n&apos;est jamais enregistrée — elle est analysée puis aussitôt oubliée.
          </p>
        </div>
      )}
    </div>
  );
}
