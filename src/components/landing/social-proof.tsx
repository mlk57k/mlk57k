import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Léa M.",
    age: 23,
    initials: "LM",
    text: "J'étais sceptique mais mon score est exactement ce que ma dermatologue m'avait dit. Bluffant !",
    score: 88,
  },
  {
    name: "Camille R.",
    age: 27,
    initials: "CR",
    text: "La routine suggérée m'a vraiment aidée. J'ai commencé la vitamine C et ma peau a changé.",
    score: 74,
  },
  {
    name: "Inès B.",
    age: 21,
    initials: "IB",
    text: "J'adore pouvoir suivre mes progrès mois après mois. Mon score a augmenté de 12 points !",
    score: 91,
  },
];

export function SocialProof() {
  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="text-center mb-16">
          <p className="text-coral-400 font-semibold text-xs uppercase tracking-[0.2em] mb-4">
            Elles l&apos;ont testé
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-stone-900">
            Ce qu&apos;elles en disent
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl bg-cream-50 border border-cream-200 p-6 hover:border-coral-200 transition-colors duration-200 cursor-default"
            >
              {/* Stars */}
              <div className="flex items-center gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-coral-400 text-coral-400" />
                ))}
              </div>

              {/* Texte */}
              <p className="text-sm text-stone-600 leading-relaxed mb-6 italic">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Auteur */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-coral-200 to-coral-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-stone-900">{t.name}</p>
                    <p className="text-xs text-stone-400">{t.age} ans</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-medium text-stone-400 uppercase tracking-wider">Score</p>
                  <p className="font-display text-2xl font-bold text-gradient-coral">{t.score}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
