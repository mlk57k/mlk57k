"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ConsentStep } from "@/components/scan/consent-step";
import { CaptureStep } from "@/components/scan/capture-step";
import { PreviewStep } from "@/components/scan/preview-step";
import { GlowyLogo } from "@/components/ui/logo";
import { skinAnalysisSchema } from "@/lib/scan-schema";
import { saveScan, setLastScanId } from "@/lib/scan-storage";

type Step = "consent" | "capture" | "preview";

export default function ScanPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("consent");
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);

  const analyze = async () => {
    if (!imageDataUrl) return;

    const res = await fetch("/api/analyze-skin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: imageDataUrl }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      throw new Error(data?.error ?? "L'analyse a échoué. Réessaie.");
    }

    const json = await res.json();
    const parsed = skinAnalysisSchema.safeParse(json);
    if (!parsed.success) {
      throw new Error("Réponse inattendue. Réessaie dans un instant.");
    }

    const id = saveScan(parsed.data);
    setLastScanId(id);
    router.push(`/results/${id}`);
  };

  return (
    <div className="min-h-screen bg-cream-50">
      <header className="px-4 h-14 flex items-center justify-center border-b border-cream-200/60 bg-white/80 backdrop-blur-xl">
        <Link href="/">
          <GlowyLogo size="md" />
        </Link>
      </header>

      <main className="mx-auto max-w-md px-4 py-8">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {(["consent", "capture", "preview"] as Step[]).map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step === s ? "w-8 bg-coral-400" : "w-1.5 bg-cream-300"
              }`}
            />
          ))}
        </div>

        {step === "consent" && (
          <ConsentStep onAccept={() => setStep("capture")} />
        )}

        {step === "capture" && (
          <CaptureStep
            onCapture={(dataUrl) => {
              setImageDataUrl(dataUrl);
              setStep("preview");
            }}
          />
        )}

        {step === "preview" && imageDataUrl && (
          <PreviewStep
            imageDataUrl={imageDataUrl}
            onAnalyze={analyze}
            onRetake={() => {
              setImageDataUrl(null);
              setStep("capture");
            }}
          />
        )}
      </main>
    </div>
  );
}
