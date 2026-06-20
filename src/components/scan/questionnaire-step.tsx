"use client";

import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type SkinProfile } from "@/lib/scan-schema";

interface QuestionnaireStepProps {
  onComplete: (profile: SkinProfile) => void;
}

const SKIN_TYPES: {
  value: SkinProfile["skinType"];
  label: string;
  description: string;
}[] = [
  {
    value: "normale",
    label: "Normale",
    description: "Bien équilibrée, ni trop grasse ni trop sèche",
  },
  {
    value: "seche",
    label: "Sèche / Inconfort",
    description: "Tiraillements, sensations de manque d'hydratation",
  },
  {
    value: "grasse",
    label: "Grasse / Brillances",
    description: "Zone T brillante, pores visibles",
  },
  {
    value: "mixte",
    label: "Mixte (Zone T)",
    description: "Front et nez gras, joues normales ou sèches",
  },
  {
    value: "sensible",
    label: "Sensible / Réactive",
    description: "Rougeurs faciles, réactions aux produits",
  },
];

const CONCERNS = [
  "Manque d'éclat",
  "Imperfections",
  "Pores visibles",
  "Rides & ridules",
  "Taches / Teint inégal",
  "Sécheresse",
  "Rougeurs",
];

const AGE_RANGES: SkinProfile["ageRange"][] = [
  "18-25",
  "26-35",
  "36-45",
  "46-55",
  "55+",
];

const ROUTINES: {
  value: SkinProfile["routine"];
  label: string;
  description: string;
}[] = [
  {
    value: "aucune",
    label: "Aucune routine",
    description: "Je n'utilise pas de produits régulièrement",
  },
  {
    value: "basique",
    label: "Basique",
    description: "Juste un nettoyant ou une crème parfois",
  },
  {
    value: "quelques",
    label: "Quelques produits",
    description: "2-3 produits mais sans vraie routine",
  },
  {
    value: "complete",
    label: "Routine complète",
    description: "Plusieurs étapes matin et/ou soir",
  },
];

export function QuestionnaireStep({ onComplete }: QuestionnaireStepProps) {
  const [currentStep, setCurrentStep] = useState<0 | 1 | 2 | 3>(0);
  const [skinType, setSkinType] = useState<SkinProfile["skinType"] | null>(null);
  const [concerns, setConcerns] = useState<string[]>([]);
  const [ageRange, setAgeRange] = useState<SkinProfile["ageRange"] | null>(null);
  const [routine, setRoutine] = useState<SkinProfile["routine"] | null>(null);

  function toggleConcern(concern: string) {
    setConcerns((prev) => {
      if (prev.includes(concern)) {
        return prev.filter((c) => c !== concern);
      }
      if (prev.length >= 3) return prev;
      return [...prev, concern];
    });
  }

  function handleContinue() {
    if (currentStep < 3) {
      setCurrentStep((prev) => (prev + 1) as 0 | 1 | 2 | 3);
    } else {
      if (!skinType || !ageRange || !routine) return;
      onComplete({
        skinType,
        concerns,
        ageRange,
        routine,
      });
    }
  }

  function handleBack() {
    if (currentStep > 0) {
      setCurrentStep((prev) => (prev - 1) as 0 | 1 | 2 | 3);
    }
  }

  const canContinue =
    (currentStep === 0 && skinType !== null) ||
    (currentStep === 1 && concerns.length >= 1) ||
    (currentStep === 2 && ageRange !== null) ||
    (currentStep === 3 && routine !== null);

  return (
    <div className="animate-fade-up">
      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={
              i <= currentStep
                ? "h-1.5 w-5 rounded-full bg-coral-400 transition-all duration-300"
                : "h-1.5 w-1.5 rounded-full bg-cream-300 transition-all duration-300"
            }
          />
        ))}
      </div>

      {/* Back button */}
      {currentStep > 0 && (
        <button
          onClick={handleBack}
          className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700 transition-colors mb-6 -mt-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Retour
        </button>
      )}

      {/* Step 0: Skin type */}
      {currentStep === 0 && (
        <div>
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl font-bold mb-2">
              Quel est ton type de peau ?
            </h2>
            <p className="text-stone-500 text-sm">Choisis l'option qui te correspond le mieux.</p>
          </div>
          <div className="space-y-3 mb-8">
            {SKIN_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => setSkinType(type.value)}
                className={`w-full flex gap-3 rounded-2xl border p-4 text-left transition-all duration-150 ${
                  skinType === type.value
                    ? "bg-coral-50 border-coral-400"
                    : "bg-white border-cream-200 hover:border-cream-300"
                }`}
              >
                <div
                  className={`mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
                    skinType === type.value
                      ? "border-coral-400"
                      : "border-cream-300"
                  }`}
                >
                  {skinType === type.value && (
                    <div className="h-2 w-2 rounded-full bg-coral-400" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-sm">{type.label}</p>
                  <p className="text-sm text-stone-500">{type.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 1: Concerns */}
      {currentStep === 1 && (
        <div>
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl font-bold mb-2">
              Tes préoccupations principales ?
            </h2>
            <p className="text-stone-500 text-sm">Sélectionne jusqu'à 3 préoccupations.</p>
          </div>
          <div className="flex flex-wrap gap-3 mb-3">
            {CONCERNS.map((concern) => {
              const selected = concerns.includes(concern);
              const maxReached = concerns.length >= 3 && !selected;
              return (
                <button
                  key={concern}
                  onClick={() => toggleConcern(concern)}
                  disabled={maxReached}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-150 border ${
                    selected
                      ? "bg-coral-400 text-white border-coral-400"
                      : maxReached
                      ? "bg-white border-cream-200 text-stone-400 opacity-50 cursor-not-allowed"
                      : "bg-white border-cream-300 text-stone-600 hover:border-coral-300"
                  }`}
                >
                  {concern}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-stone-400 mb-8">
            {concerns.length}/3 sélectionnées
          </p>
        </div>
      )}

      {/* Step 2: Age range */}
      {currentStep === 2 && (
        <div>
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl font-bold mb-2">
              Ta tranche d&apos;âge ?
            </h2>
            <p className="text-stone-500 text-sm">Pour affiner les recommandations.</p>
          </div>
          <div className="flex flex-wrap gap-3 mb-8">
            {AGE_RANGES.map((range) => (
              <button
                key={range}
                onClick={() => setAgeRange(range)}
                className={`h-12 px-6 rounded-full text-sm font-medium border transition-all duration-150 ${
                  ageRange === range
                    ? "bg-coral-400 text-white border-coral-400"
                    : "bg-white border-cream-300 text-stone-600 hover:border-coral-300"
                }`}
              >
                {range} ans
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Routine */}
      {currentStep === 3 && (
        <div>
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl font-bold mb-2">
              Ta routine actuelle ?
            </h2>
            <p className="text-stone-500 text-sm">Décris ton niveau de routine beauté.</p>
          </div>
          <div className="space-y-3 mb-8">
            {ROUTINES.map((r) => (
              <button
                key={r.value}
                onClick={() => setRoutine(r.value)}
                className={`w-full flex gap-3 rounded-2xl border p-4 text-left transition-all duration-150 ${
                  routine === r.value
                    ? "bg-coral-50 border-coral-400"
                    : "bg-white border-cream-200 hover:border-cream-300"
                }`}
              >
                <div
                  className={`mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
                    routine === r.value
                      ? "border-coral-400"
                      : "border-cream-300"
                  }`}
                >
                  {routine === r.value && (
                    <div className="h-2 w-2 rounded-full bg-coral-400" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-sm">{r.label}</p>
                  <p className="text-sm text-stone-500">{r.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Continue / Submit button */}
      <Button
        size="lg"
        className="w-full"
        disabled={!canContinue}
        onClick={handleContinue}
      >
        {currentStep === 3 ? "Analyser ma peau →" : "Continuer"}
      </Button>
    </div>
  );
}
