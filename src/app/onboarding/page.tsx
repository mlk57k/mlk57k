"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppLogo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { buildObjectifsText } from "@/lib/profile";

const OBJECTIFS = [
  { emoji: "🌊", label: "Gérer le stress et l'anxiété" },
  { emoji: "🌙", label: "Mieux dormir, l'esprit posé" },
  { emoji: "🧭", label: "Mieux me connaître" },
  { emoji: "🙏", label: "Cultiver la gratitude" },
  { emoji: "📖", label: "Garder une trace de ma vie" },
  { emoji: "🍃", label: "Prendre du recul sur mes journées" },
];

const ETATS = [
  { color: "#8FA086", label: "Serein" },
  { color: "#CDA45C", label: "Léger" },
  { color: "#BD6E4C", label: "Mêlé" },
  { color: "#D3917C", label: "Sensible" },
  { color: "#7C8AA0", label: "Lourd" },
];

const REMINDER_HOURS = [19, 20, 21, 22];

const TOTAL_STEPS = 5;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [prenom, setPrenom] = useState("");
  const [objectifs, setObjectifs] = useState<string[]>([]);
  const [etat, setEtat] = useState<string | null>(null);
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

  function toggleObjectif(label: string) {
    setObjectifs((prev) =>
      prev.includes(label) ? prev.filter((o) => o !== label) : [...prev, label]
    );
  }

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
            objectifs: buildObjectifsText({ prenom, objectifs, etatInitial: etat ?? "" }),
            reminder_enabled: reminderEnabled,
            reminder_hour: reminderHour,
          })
          .eq("id", user.id);
      }
    } finally {
      router.replace("/journal?bienvenue=1");
    }
  }

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <AppLogo size="md" />
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((n) => (
            <span
              key={n}
              className={cn(
                "rounded-full transition-all",
                n === step ? "w-6 h-2 bg-coral-400" : n < step ? "w-2 h-2 bg-coral-300" : "w-2 h-2 bg-coral-100"
              )}
            />
          ))}
        </div>

        {/* Step 1 — Prénom */}
        {step === 1 && (
          <div className="animate-fade-up">
            <p className="text-xs font-semibold uppercase tracking-widest text-coral-500 mb-4">1 · Toi</p>
            <h1 className="font-display text-3xl font-semibold text-stone-900 leading-tight mb-3">
              Comment tu<br />t&apos;appelles ?
            </h1>
            <p className="text-stone-500 text-base leading-relaxed mb-7">
              Ton coach s&apos;adressera à toi par ton prénom. Rien d&apos;autre — pas de nom, pas de photo.
            </p>

            <input
              type="text"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              placeholder="Ton prénom"
              maxLength={30}
              autoFocus
              className="w-full h-14 px-5 rounded-2xl border-2 border-cream-200 bg-white text-lg text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-coral-400 mb-8"
            />

            <Button size="lg" className="w-full" disabled={!prenom.trim()} onClick={() => setStep(2)}>
              Continuer
            </Button>
            <button
              onClick={() => setStep(2)}
              className="block mx-auto mt-3 text-sm text-stone-400 hover:text-stone-600"
            >
              Passer
            </button>
          </div>
        )}

        {/* Step 2 — Objectifs (multi) */}
        {step === 2 && (
          <div className="animate-fade-up">
            <p className="text-xs font-semibold uppercase tracking-widest text-coral-500 mb-4">2 · Ton intention</p>
            <h1 className="font-display text-3xl font-semibold text-stone-900 leading-tight mb-3">
              Qu&apos;est-ce qui<br />t&apos;amène ici ?
            </h1>
            <p className="text-stone-500 text-base leading-relaxed mb-7">
              Choisis tout ce qui te parle — le coach adapte son ton et ses questions.
            </p>

            <div className="flex flex-col gap-3 mb-8">
              {OBJECTIFS.map(({ emoji, label }) => (
                <button
                  key={label}
                  onClick={() => toggleObjectif(label)}
                  className={cn(
                    "text-left px-5 py-4 rounded-2xl border-2 text-[15px] font-medium transition-all flex items-center gap-3",
                    objectifs.includes(label)
                      ? "border-coral-400 bg-coral-50 text-coral-600"
                      : "border-cream-200 bg-white text-stone-700 hover:border-coral-100"
                  )}
                >
                  <span className="text-xl">{emoji}</span>
                  {label}
                </button>
              ))}
            </div>

            <Button size="lg" className="w-full" disabled={objectifs.length === 0} onClick={() => setStep(3)}>
              Continuer
            </Button>
          </div>
        )}

        {/* Step 3 — État actuel */}
        {step === 3 && (
          <div className="animate-fade-up">
            <p className="text-xs font-semibold uppercase tracking-widest text-coral-500 mb-4">3 · Ton point de départ</p>
            <h1 className="font-display text-3xl font-semibold text-stone-900 leading-tight mb-3">
              Comment tu te sens<br />ces derniers temps ?
            </h1>
            <p className="text-stone-500 text-base leading-relaxed mb-7">
              Il n&apos;y a pas de bonne réponse. C&apos;est ton point de départ, pas une étiquette.
            </p>

            <div className="flex flex-col gap-3 mb-8">
              {ETATS.map(({ color, label }) => (
                <button
                  key={label}
                  onClick={() => setEtat(label)}
                  className={cn(
                    "text-left px-5 py-4 rounded-2xl border-2 text-[15px] font-medium transition-all flex items-center gap-3",
                    etat === label
                      ? "border-coral-400 bg-coral-50 text-coral-600"
                      : "border-cream-200 bg-white text-stone-700 hover:border-coral-100"
                  )}
                >
                  <span className="w-3 h-3 rounded-full flex-none" style={{ background: color }} />
                  {label}
                </button>
              ))}
            </div>

            <Button size="lg" className="w-full" disabled={!etat} onClick={() => setStep(4)}>
              Continuer
            </Button>
          </div>
        )}

        {/* Step 4 — Rituel */}
        {step === 4 && (
          <div className="animate-fade-up">
            <p className="text-xs font-semibold uppercase tracking-widest text-coral-500 mb-4">4 · Ton rituel</p>
            <h1 className="font-display text-3xl font-semibold text-stone-900 leading-tight mb-3">
              Un rappel,<br />tout en douceur.
            </h1>
            <p className="text-stone-500 text-base leading-relaxed mb-7">
              Une seule notification par jour, à l&apos;heure que tu choisis. Discrète, jamais culpabilisante.
            </p>

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
                  <span className="text-stone-400">:</span>00
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {REMINDER_HOURS.map((hour) => (
                    <button
                      key={hour}
                      onClick={() => setReminderHour(hour)}
                      className={cn(
                        "px-4 py-2 rounded-full border text-sm font-medium transition-all",
                        reminderHour === hour
                          ? "bg-coral-50 border-coral-200 text-coral-500"
                          : "bg-white border-cream-200 text-stone-600 hover:border-coral-100"
                      )}
                    >
                      {hour}:00
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!reminderEnabled && <div className="mb-8" />}

            <Button size="lg" className="w-full" onClick={() => setStep(5)}>
              {reminderEnabled ? "Activer le rappel" : "Continuer sans rappel"}
            </Button>
          </div>
        )}

        {/* Step 5 — Fonctionnement */}
        {step === 5 && (
          <div className="animate-fade-up">
            <p className="text-xs font-semibold uppercase tracking-widest text-coral-500 mb-4">5 · Comment ça marche</p>
            <h1 className="font-display text-3xl font-semibold text-stone-900 leading-tight mb-7">
              {prenom.trim() ? `${prenom.trim()}, tu déposes.` : "Tu déposes,"}<br />Ancrage reflète.
            </h1>

            <div className="flex flex-col gap-3 mb-8">
              {[
                { n: "1", title: "Tu écris ou tu parles.", body: "Comme ça vient, sans te relire." },
                { n: "2", title: "Ancrage te répond.", body: "Un reflet bienveillant et une question douce." },
                { n: "3", title: "Il apprend avec toi.", body: "Tendances, humeurs, thèmes récurrents — visibles dans ton bilan." },
                { n: "4", title: "Tout reste privé.", body: "Chiffré, exportable, effaçable quand tu veux." },
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
