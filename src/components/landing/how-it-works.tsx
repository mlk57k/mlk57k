import { Camera, Cpu, Sparkles } from "lucide-react";

const steps = [
  {
    icon: Camera,
    number: "01",
    title: "Prends ta selfie",
    description:
      "Utilise la caméra frontale de ton téléphone ou upload une photo existante. Lumière naturelle = meilleur résultat.",
  },
  {
    icon: Cpu,
    number: "02",
    title: "L'IA analyse",
    description:
      "Notre IA étudie des dizaines de paramètres en quelques secondes : texture, éclat, zones à chouchouter.",
  },
  {
    icon: Sparkles,
    number: "03",
    title: "Reçois ton aperçu",
    description:
      "Score, âge estimé de ta peau, et une routine sur-mesure pour booster tes résultats. Le tout, pour toi.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="py-16 sm:py-24 bg-white/50">
      <div className="mx-auto max-w-5xl px-4">
        <div className="text-center mb-12">
          <p className="text-coral-500 font-semibold text-sm uppercase tracking-widest mb-3">
            Simple comme bonjour
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold">Comment ça marche ?</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-beige-200 shadow-sm"
              >
                {/* Connecteur entre les cartes */}
                {i < steps.length - 1 && (
                  <div className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <div className="h-0.5 w-6 bg-beige-300" />
                  </div>
                )}

                <div className="mb-4 relative">
                  <div className="h-14 w-14 rounded-2xl bg-coral-50 flex items-center justify-center">
                    <Icon className="h-7 w-7 text-coral-500" />
                  </div>
                  <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-coral-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>

                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
