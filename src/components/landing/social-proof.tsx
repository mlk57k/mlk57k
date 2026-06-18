import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Léa M.",
    age: 23,
    text: "J'étais sceptique mais mon score de peau est exactement ce que ma dermatologue m'avait dit. Bluffant !",
    score: 88,
  },
  {
    name: "Camille R.",
    age: 27,
    text: "La routine suggérée m'a vraiment aidée, j'ai commencé la vitamine C et franchement ma peau a changé.",
    score: 74,
  },
  {
    name: "Inès B.",
    age: 21,
    text: "Super appli, j'adore pouvoir suivre mes progrès mois après mois. Mon score a augmenté de 12 points !",
    score: 91,
  },
];

export function SocialProof() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4">
        <div className="text-center mb-12">
          <p className="text-coral-500 font-semibold text-sm uppercase tracking-widest mb-3">
            Elles l&apos;ont testé
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold">Ce qu&apos;elles en disent</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl bg-white border border-beige-200 p-6 shadow-sm"
            >
              <div className="flex items-center gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-coral-400 text-coral-400" />
                ))}
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed mb-4 italic">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.age} ans</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Score</p>
                  <p className="text-xl font-bold text-gradient-coral">{t.score}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
