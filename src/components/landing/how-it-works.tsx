import { Camera, Cpu, Sparkles } from "lucide-react";

const steps = [
  {
    icon: Camera,
    number: "01",
    title: "Prends ton selfie",
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
    <section id="how" className="grain relative py-20 sm:py-28 bg-cream-50">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="text-center mb-16">
          <p className="text-coral-400 font-semibold text-xs uppercase tracking-[0.2em] mb-4">
            Comment ça marche
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-stone-900">
            Simple comme un <span className="text-gradient-coral italic">selfie</span>
          </h2>
        </div>

        <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Ligne connectrice */}
          <div className="hidden sm:block absolute top-[4.5rem] left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-coral-200 to-transparent" />

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="card-premium group relative flex flex-col items-center text-center p-8"
              >
                {/* Icône avec numéro */}
                <div className="relative mb-6">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-coral-50 to-cream-100 border border-cream-200 shadow-soft flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <Icon className="h-7 w-7 text-coral-500" />
                  </div>
                  <span className="absolute -top-2.5 -right-2.5 h-6 w-6 rounded-full bg-gradient-to-br from-coral-400 to-coral-500 text-white text-[10px] font-bold flex items-center justify-center shadow-glow-coral">
                    {i + 1}
                  </span>
                </div>

                <h3 className="font-display text-xl font-bold text-stone-900 mb-2">{step.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed max-w-[220px]">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
