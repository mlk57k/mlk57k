export function HowItWorks() {
  const steps = [
    {
      n: "1",
      title: "Tu écris ou tu parles.",
      body: "Comme ça vient, sans te relire. Au clavier les soirs bavards, à la voix les soirs fatigués.",
    },
    {
      n: "2",
      title: "Ancrage te répond.",
      body: "Un reflet bienveillant et une question douce. Jamais de jugement, jamais un diagnostic.",
    },
    {
      n: "3",
      title: "Tout reste privé.",
      body: "Chiffré, exportable, effaçable quand tu veux. Tes écrits ne servent jamais à entraîner un modèle.",
    },
  ];

  return (
    <section id="how" className="bg-cream-50 py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-coral-500 mb-4">Comment ça marche</p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-stone-900">
            Tu déposes,<br className="hidden sm:block" /> Ancrage reflète.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {steps.map(({ n, title, body }) => (
            <div key={n} className="bg-white border border-cream-200 rounded-2xl p-6 flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-coral-50 flex-none flex items-center justify-center font-display text-lg font-semibold text-coral-500">
                {n}
              </div>
              <div>
                <p className="font-semibold text-stone-900 text-sm mb-1.5">{title}</p>
                <p className="text-stone-500 text-sm leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
