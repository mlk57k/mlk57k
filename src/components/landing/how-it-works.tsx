const STEPS = [
  {
    n: "01",
    title: "Tu écris ou tu parles.",
    body: "Comme ça vient, sans te relire. Au clavier les soirs bavards, à la voix les soirs fatigués.",
  },
  {
    n: "02",
    title: "Ancrage te répond.",
    body: "Un reflet bienveillant et une question douce. Jamais de jugement, jamais un diagnostic.",
  },
  {
    n: "03",
    title: "Tout reste privé.",
    body: "Chiffré, exportable, effaçable quand tu veux. Tes écrits ne servent jamais à entraîner un modèle.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="bg-[#F3EBDC] px-5 sm:px-8 lg:px-14 py-16 sm:py-[76px]">
      <div className="text-center mb-10 sm:mb-[52px]">
        <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.16em] text-[#B4694A]">
          Comment ça marche
        </span>
        <h2 className="font-display font-normal text-[#33241A] text-[2rem] sm:text-[42px] leading-[1.12] mt-3.5">
          Tu déposes, Ancrage reflète.
        </h2>
      </div>

      <div className="max-w-[640px] mx-auto flex flex-col">
        {STEPS.map((step, i) => (
          <div
            key={step.n}
            className={`flex gap-5 sm:gap-6 py-6 border-t border-[#33241A]/[0.12] ${
              i === STEPS.length - 1 ? "border-b" : ""
            }`}
          >
            <span className="font-display text-[26px] sm:text-[30px] text-[#C0714F] w-9 sm:w-11 flex-none leading-none">
              {step.n}
            </span>
            <div className="flex flex-col gap-1.5">
              <strong className="text-[17px] sm:text-lg font-semibold text-[#33241A]">{step.title}</strong>
              <span className="text-[15px] leading-[1.6] text-[#6B5545]">{step.body}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
