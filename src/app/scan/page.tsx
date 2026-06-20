"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ConsentStep } from "@/components/scan/consent-step";
import { QuestionnaireStep } from "@/components/scan/questionnaire-step";
import { Scan3DStep } from "@/components/scan/scan-3d-step";
import { AnalysisProgressStep } from "@/components/scan/analysis-progress-step";
import { GlowyLogo } from "@/components/ui/logo";
import { type SkinAnalysis, type SkinProfile } from "@/lib/scan-schema";
import { saveScan, setLastScanId } from "@/lib/scan-storage";

type Step = "consent" | "questionnaire" | "scanning" | "analyzing";

export default function ScanPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("consent");
  const [skinProfile, setSkinProfile] = useState<SkinProfile | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  function handleCapture(dataUrl: string) {
    setImageDataUrl(dataUrl);
    setStep("analyzing");
  }

  function handleAnalysisComplete(data: SkinAnalysis) {
    const id = saveScan(data);
    setLastScanId(id);
    router.push(`/results/${id}`);
  }

  function handleAnalysisError(msg: string) {
    setAnalysisError(msg);
    setImageDataUrl(null);
    setStep("consent");
  }

  function handleQuestionnaireComplete(profile: SkinProfile) {
    setSkinProfile(profile);
    setStep("scanning");
  }

  if (step === "scanning") {
    return (
      <Scan3DStep
        onCapture={handleCapture}
        onCancel={() => setStep("questionnaire")}
      />
    );
  }

  if (step === "analyzing" && imageDataUrl) {
    return (
      <AnalysisProgressStep
        imageDataUrl={imageDataUrl}
        skinProfile={skinProfile ?? undefined}
        onComplete={handleAnalysisComplete}
        onError={handleAnalysisError}
      />
    );
  }

  // Progress dots config per step
  // consent:       dot 1 active (wide), dots 2-3 empty
  // questionnaire: dot 1 done (wide), dot 2 active (wide), dot 3 empty
  const dotStepIndex = step === "consent" ? 0 : 1;

  return (
    <div className="min-h-screen bg-cream-50">
      <header className="px-4 h-14 flex items-center justify-center border-b border-cream-200/60 bg-white/80 backdrop-blur-xl">
        <Link href="/">
          <GlowyLogo size="md" />
        </Link>
      </header>

      <main className="mx-auto max-w-md px-4 py-8">
        <div className="flex items-center justify-center gap-2 mb-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={
                i <= dotStepIndex
                  ? "h-1.5 w-8 rounded-full bg-coral-400 transition-all duration-300"
                  : "h-1.5 w-1.5 rounded-full bg-cream-300 transition-all duration-300"
              }
            />
          ))}
        </div>

        {analysisError && (
          <div className="mb-6 rounded-2xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
            {analysisError}
          </div>
        )}

        {step === "consent" && (
          <ConsentStep onAccept={() => setStep("questionnaire")} />
        )}

        {step === "questionnaire" && (
          <QuestionnaireStep onComplete={handleQuestionnaireComplete} />
        )}
      </main>
    </div>
  );
}
