"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sparkles, RotateCcw, Loader2 } from "lucide-react";

export function PreviewStep({
  imageDataUrl,
  onAnalyze,
  onRetake,
}: {
  imageDataUrl: string;
  onAnalyze: () => Promise<void>;
  onRetake: () => void;
}) {
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setError(null);
    try {
      await onAnalyze();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "L'analyse a échoué. Réessaie."
      );
      setAnalyzing(false);
    }
  };

  return (
    <div className="animate-fade-up">
      <div className="text-center mb-6">
        <h1 className="font-display text-2xl font-bold mb-2">Ta photo est prête ?</h1>
        <p className="text-stone-500 text-sm">
          Vérifie qu&apos;on voit bien ton visage, puis lance l&apos;analyse.
        </p>
      </div>

      <div className="relative rounded-3xl overflow-hidden bg-cream-100 aspect-[3/4] mb-6 border border-cream-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <Image
          src={imageDataUrl}
          alt="Aperçu de ton selfie"
          fill
          unoptimized
          className="object-cover"
        />
        {analyzing && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center text-white">
            <Loader2 className="h-10 w-10 animate-spin mb-3" />
            <p className="font-semibold">Analyse en cours…</p>
            <p className="text-sm text-white/80 mt-1">
              Notre IA étudie ta peau ✨
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-2xl bg-coral-50 border border-coral-200 p-3 text-sm text-coral-700">
          {error}
        </div>
      )}

      <div className="space-y-3">
        <Button
          size="lg"
          className="w-full"
          onClick={handleAnalyze}
          disabled={analyzing}
        >
          <Sparkles className="h-5 w-5" />
          {analyzing ? "Analyse en cours…" : "Analyser ma peau"}
        </Button>
        <Button
          variant="ghost"
          className="w-full"
          onClick={onRetake}
          disabled={analyzing}
        >
          <RotateCcw className="h-4 w-4" />
          Reprendre une photo
        </Button>
      </div>
    </div>
  );
}
