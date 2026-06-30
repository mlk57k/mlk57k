const testimonials = [
  {
    name: "Léa M.",
    age: "27 ans",
    text: "Le seul moment de la journée où je m'arrête vraiment. Ça m'a aidée à mieux dormir sans que je comprenne vraiment pourquoi au début.",
    color: "#BD6E4C",
  },
  {
    name: "Thomas R.",
    age: "34 ans",
    text: "Je pensais que tenir un journal c'était pas pour moi. La voix a tout changé — je parle 2 minutes et ça suffit.",
    color: "#8FA086",
  },
  {
    name: "Sophie K.",
    age: "29 ans",
    text: "J'aime que ça ne me juge pas et ne me donne pas de conseils non demandés. Juste une question qui me fait réfléchir.",
    color: "#CDA45C",
  },
];

export function SocialProof() {
  return (
    <section id="temoignages" className="bg-cream-100 py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-coral-500 mb-4">Témoignages</p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-stone-900">
            Ils ferment mieux leur journée.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {testimonials.map(({ name, age, text, color }) => (
            <div key={name} className="bg-white border border-cream-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: color }}>
                  {name[0]}
                </span>
                <div>
                  <p className="font-semibold text-stone-900 text-sm leading-tight">{name}</p>
                  <p className="text-xs text-stone-400">{age}</p>
                </div>
              </div>
              <p className="font-display text-base leading-snug text-stone-700 font-medium">
                &ldquo;{text}&rdquo;
              </p>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-stone-400 mt-8">
          Ancrage ne remplace pas un suivi médical ou thérapeutique.
        </p>
      </div>
    </section>
  );
}
