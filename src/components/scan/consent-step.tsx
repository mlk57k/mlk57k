"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ShieldCheck, Lock, Trash2 } from "lucide-react";

export function ConsentStep({ onAccept }: { onAccept: () => void }) {
  const [checked, setChecked] = useState(false);

  return (
    <div className="animate-fade-up">
      <div className="text-center mb-8">
        <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-coral-50 flex items-center justify-center">
          <ShieldCheck className="h-7 w-7 text-coral-400" />
        </div>
        <h1 className="font-display text-2xl font-bold mb-2">Avant de commencer</h1>
        <p className="text-stone-500 text-sm">
          On a besoin de ton accord pour analyser ta photo. Pas de blabla, on
          est clairs avec toi.
        </p>
      </div>

      <div className="space-y-3 mb-8">
        {[
          {
            icon: Lock,
            title: "Ta photo reste privée",
            text: "Elle sert uniquement à l'analyse, jamais revendue à des tiers.",
          },
          {
            icon: Trash2,
            title: "Aucun stockage par défaut",
            text: "On garde seulement le résultat, pas l'image elle-même.",
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="flex gap-3 rounded-2xl bg-white border border-cream-200 p-4"
            >
              <Icon className="h-5 w-5 text-coral-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">{item.title}</p>
                <p className="text-sm text-stone-500">{item.text}</p>
              </div>
            </div>
          );
        })}
      </div>

      <label className="flex items-start gap-3 rounded-2xl bg-coral-50 border border-coral-100 p-4 mb-6 cursor-pointer">
        <Checkbox
          checked={checked}
          onCheckedChange={(v) => setChecked(v === true)}
          className="mt-0.5"
          aria-label="J'accepte les conditions de traitement de ma photo"
        />
        <span className="text-sm text-foreground/90">
          J&apos;accepte que ma photo soit utilisée uniquement pour
          l&apos;analyse et ne soit pas revendue à des tiers.
        </span>
      </label>

      <Button
        size="lg"
        className="w-full"
        disabled={!checked}
        onClick={onAccept}
      >
        Continuer
      </Button>
    </div>
  );
}
