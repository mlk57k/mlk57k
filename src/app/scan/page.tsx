"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { ConsentStep } from "@/components/scan/consent-step";
import { CaptureStep } from "@/components/scan/capture-step";
import { PreviewStep } from "@/components/scan/preview-step";
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
    <div className="min-h-screen bg-gradient-glowy">
      {/* Header minimal */}
      <header className="px-4 h-14 flex items-center justify-center border-b border-beige-200/50">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Sparkles className="h-5 w-5 text-coral-500" />
          <span className="text-gradient-coral">Glowy</span>
        </Link>
      </header>

      <main className="mx-auto max-w-md px-4 py-8">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {(["consent", "capture", "preview"] as Step[]).map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                step === s
                  ? "w-8 bg-coral-500"
                  : "w-1.5 bg-beige-300"
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
