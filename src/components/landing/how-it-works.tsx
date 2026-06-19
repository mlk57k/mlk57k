import { Camera, Cpu, Sparkles } from "lucide-react";

const steps = [
  {
    icon: Camera,
    number: "01",
    title: "Prends ta selfie",
    description: "Caméra frontale ou galerie photo. Lumière naturelle pour un meilleur résultat.",
  },
  {
    icon: Cpu,
    number: "02",
    title: "L'IA analyse",
    description: "Notre IA étudie texture, éclat, hydratation et zones à améliorer en quelques secondes.",
  },
  {
    icon: Sparkles,
    number: "03",
    title: "Ton aperçu complet",
    description: "Score sur 100, âge cutané estimé, et une routine personnalisée rien que pour toi.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="py-20 sm:py-28 bg-cream-50">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="text-center mb-16">
          <p className="text-coral-400 font-semibold text-xs uppercase tracking-[0.2em] mb-4">
            Comment ça marche
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-stone-900">
            Simple comme une selfie
          </h2>
        </div>

        <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Ligne connectrice */}
          <div className="hidden sm:block absolute top-8 left-[calc(16.66%+2rem)] right-[calc(16.66%+2rem)] h-px bg-gradient-to-r from-cream-200 via-coral-200 to-cream-200" />

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="relative flex flex-col items-center text-center">
                {/* Icône avec numéro */}
                <div className="relative mb-6">
                  <div className="h-16 w-16 rounded-2xl bg-white border border-cream-200 shadow-md shadow-cream-200/60 flex items-center justify-center">
                    <Icon className="h-7 w-7 text-coral-400" />
                  </div>
                  <span className="absolute -top-2.5 -right-2.5 h-6 w-6 rounded-full bg-coral-400 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                    {i + 1}
                  </span>
                </div>

                <h3 className="font-display text-xl font-bold text-stone-900 mb-2">{step.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed max-w-[200px]">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
