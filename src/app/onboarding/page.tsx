"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppLogo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const INTENTIONS = [
  "Mieux dormir, l'esprit posé",
  "Comprendre mes humeurs",
  "Prendre du recul sur mes journées",
  "Juste écrire, sans but précis",
];

const REMINDER_TIMES = [
  { label: "20:00", hour: 20 },
  { label: "20:30", hour: 20 },
  { label: "21:00", hour: 21 },
  { label: "21:30", hour: 21 },
  { label: "22:00", hour: 22 },
  { label: "22:30", hour: 22 },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [intention, setIntention] = useState<string | null>(null);
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderHour, setReminderHour] = useState(21);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { createClient } = await import("@/lib/supabase/client");
      const { data: { user } } = await createClient().auth.getUser();
      if (!user) router.replace("/auth?next=/onboarding");
    })();
  }, [router]);

  async function finish() {
    setSaving(true);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from("profiles")
          .update({
            objectifs: intention ?? "",
            reminder_enabled: reminderEnabled,
            reminder_hour: reminderHour,
          })
          .eq("id", user.id);
      }
    } finally {
      router.replace("/journal?bienvenue=1");
    }
  }

  const progressDots = [1, 2, 3];

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <AppLogo size="md" />
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {progressDots.map((n) => (
            <span
              key={n}
              className={cn(
                "rounded-full transition-all",
                n === step ? "w-6 h-2 bg-coral-400" : "w-2 h-2 bg-coral-100"
              )}
            />
          ))}
        </div>

        {/* Step 1 — Intention */}
        {step === 1 && (
          <div className="animate-fade-up">
            <p className="text-xs font-semibold uppercase tracking-widest text-coral-500 mb-4">1 · Ton intention</p>
            <h1 className="font-display text-3xl font-semibold text-stone-900 leading-tight mb-3">
              Qu&apos;est-ce qui<br />t&apos;amène ici ?
            </h1>
            <p className="text-stone-500 text-base leading-relaxed mb-7">
              Choisis ce qui te ressemble. Ça oriente le ton d&apos;Ancrage — tu pourras changer plus tard.
            </p>

            <div className="flex flex-col gap-3 mb-8">
              {INTENTIONS.map((item) => (
                <button
                  key={item}
                  onClick={() => setIntention(item)}
                  className={cn(
                    "text-left px-5 py-4 rounded-2xl border-2 text-[15px] font-medium transition-all",
                    intention === item
                      ? "border-coral-400 bg-coral-50 text-coral-500"
                      : "border-cream-200 bg-white text-stone-700 hover:border-coral-100"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>

            <Button size="lg" className="w-full" disabled={!intention} onClick={() => setStep(2)}>
              Continuer
            </Button>
          </div>
        )}

        {/* Step 2 — Rituel */}
        {step === 2 && (
          <div className="animate-fade-up">
            <p className="text-xs font-semibold uppercase tracking-widest text-coral-500 mb-4">2 · Ton rituel</p>
            <h1 className="font-display text-3xl font-semibold text-stone-900 leading-tight mb-3">
              Un rappel,<br />tout en douceur.
            </h1>
            <p className="text-stone-500 text-base leading-relaxed mb-7">
              On t&apos;enverra une seule notification, à l&apos;heure que tu choisis. Discrète, jamais culpabilisante.
            </p>

            {/* Toggle */}
            <div className="bg-white border border-cream-200 rounded-2xl px-5 py-4 mb-4 flex items-center justify-between">
              <span className="font-medium text-stone-900">Rappel du soir</span>
              <button
                onClick={() => setReminderEnabled(!reminderEnabled)}
                className={cn(
                  "w-11 h-6 rounded-full relative transition-colors",
                  reminderEnabled ? "bg-coral-400" : "bg-cream-300"
                )}
                aria-checked={reminderEnabled}
                role="switch"
              >
                <span
                  className={cn(
                    "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all",
                    reminderEnabled ? "right-0.5" : "left-0.5"
                  )}
                />
              </button>
            </div>

            {reminderEnabled && (
              <div className="bg-white border border-cream-200 rounded-2xl px-5 py-5 mb-8">
                <p className="text-center text-sm text-stone-400 mb-2">Chaque soir vers</p>
                <p className="font-display text-center text-5xl font-semibold text-stone-900 mb-5">
                  {String(reminderHour).padStart(2, "0")}
                  <span className="text-stone-400">:</span>
                  00
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {REMINDER_TIMES.map(({ label, hour }) => (
                    <button
                      key={label}
                      onClick={() => setReminderHour(hour)}
                      className={cn(
                        "px-4 py-2 rounded-full border text-sm font-medium transition-all",
                        reminderHour === hour && label.endsWith("00") && hour === reminderHour
                          ? "bg-coral-50 border-coral-200 text-coral-500"
                          : "bg-white border-cream-200 text-stone-600 hover:border-coral-100"
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!reminderEnabled && <div className="mb-8" />}

            <Button size="lg" className="w-full" onClick={() => setStep(3)}>
              {reminderEnabled ? "Activer le rappel" : "Continuer sans rappel"}
            </Button>
          </div>
        )}

        {/* Step 3 — Fonctionnement */}
        {step === 3 && (
          <div className="animate-fade-up">
            <p className="text-xs font-semibold uppercase tracking-widest text-coral-500 mb-4">3 · Comment ça marche</p>
            <h1 className="font-display text-3xl font-semibold text-stone-900 leading-tight mb-7">
              Tu déposes,<br />Ancrage reflète.
            </h1>

            <div className="flex flex-col gap-3 mb-8">
              {[
                { n: "1", title: "Tu écris ou tu parles.", body: "Comme ça vient, sans te relire." },
                { n: "2", title: "Ancrage te répond.", body: "Un reflet bienveillant et une question douce." },
                { n: "3", title: "Tout reste privé.", body: "Chiffré, exportable, effaçable quand tu veux." },
              ].map(({ n, title, body }) => (
                <div key={n} className="bg-white border border-cream-200 rounded-2xl px-5 py-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-coral-50 flex-none flex items-center justify-center font-display font-semibold text-coral-500">
                    {n}
                  </div>
                  <div>
                    <span className="font-semibold text-stone-900 text-sm">{title}</span>{" "}
                    <span className="text-stone-500 text-sm">{body}</span>
                  </div>
                </div>
              ))}
            </div>

            <Button size="lg" className="w-full" disabled={saving} onClick={finish}>
              {saving ? "Un instant…" : "Écrire ma première entrée"}
            </Button>
            <p className="text-center text-xs text-stone-400 mt-3">
              Ancrage ne remplace pas un suivi médical.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
