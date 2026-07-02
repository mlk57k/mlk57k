import { testimonials } from "./testimonials";

export function SocialProof() {
  // Aucun faux témoignage : tant qu'il n'y a pas de vrais retours,
  // on affiche une section "premiers testeurs" honnête.
  if (testimonials.length === 0) {
    return (
      <section id="temoignages" className="bg-cream-100 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-coral-500 mb-4">
            Premiers testeurs
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-stone-900 mb-5">
            Rejoins les premiers à tester Ancrage.
          </h2>
          <p className="text-stone-500 text-base leading-relaxed max-w-xl mx-auto">
            Ancrage vient d&apos;ouvrir. Les premiers retours de la bêta arrivent bientôt — en
            attendant, l&apos;essai est gratuit, sans carte, et tu te fais ton propre avis.
          </p>
          <p className="text-center text-sm text-stone-400 mt-8">
            Ancrage ne remplace pas un suivi médical ou thérapeutique.
          </p>
        </div>
      </section>
    );
  }

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
                  {age && <p className="text-xs text-stone-400">{age}</p>}
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
