import { testimonials } from "./testimonials";

export function SocialProof() {
  const hasReal = testimonials.length > 0;

  return (
    <section className="px-5 sm:px-8 lg:px-14 py-16 sm:py-[76px] text-center">
      <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.16em] text-[#B4694A]">
        Premiers testeurs
      </span>
      <h2 className="font-display font-normal text-[#33241A] text-[1.9rem] sm:text-[38px] leading-[1.12] max-w-[20ch] mx-auto mt-3.5 mb-4">
        Rejoins les premiers à tester Ancrage.
      </h2>
      <p className="text-[15.5px] leading-[1.65] text-[#6B5545] max-w-[58ch] mx-auto">
        Ancrage vient d&apos;ouvrir. Les premiers retours de la bêta arrivent bientôt — en
        attendant, l&apos;essai est gratuit, sans carte, et tu te fais ton propre avis.
      </p>

      {/* Vrais témoignages uniquement (aucun faux avis). La carte n'apparaît
          que lorsqu'un témoignage réel est ajouté dans testimonials.ts. */}
      {hasReal && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-[720px] mx-auto mt-9">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-[20px] border border-[#33241A]/[0.12] bg-white p-[30px] text-left">
              <p className="font-display italic text-[20px] leading-[1.4] text-[#33241A]">
                « {t.text} »
              </p>
              <span className="block text-[13.5px] text-[#9A8270] mt-3">
                {t.name}
                {t.age ? `, ${t.age}` : ""}
              </span>
            </div>
          ))}
        </div>
      )}

      <p className="text-[12.5px] text-[#9A8270] mt-[22px]">
        Ancrage ne remplace pas un suivi médical ou thérapeutique.
      </p>
    </section>
  );
}
