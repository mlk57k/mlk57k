import Link from "next/link";

const MINI_FEATURES = [
  {
    title: "Écris ou parle",
    body: "Au clavier les soirs bavards, à la voix les soirs fatigués.",
  },
  {
    title: "Un reflet, pas un conseil",
    body: "L'IA reformule et pose une question. Jamais de jugement.",
  },
  {
    title: "Vois ta semaine",
    body: "Tes humeurs se dessinent doucement, sans te noter.",
  },
];

export function Hero() {
  return (
    <section className="px-5 sm:px-8 lg:px-14 pt-16 sm:pt-20 pb-14 sm:pb-16 flex flex-col items-center text-center gap-6 sm:gap-7">
      <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.16em] text-[#B4694A]">
        Journal du soir · IA
      </span>

      <h1 className="font-display font-normal text-[#33241A] leading-[1.06] tracking-[-0.015em] text-[2.5rem] sm:text-5xl lg:text-6xl max-w-[16ch]">
        Pose ta journée <em className="text-[#B4694A] font-normal italic">avant de dormir.</em>
      </h1>

      <p className="text-[17px] sm:text-[19px] leading-[1.6] text-[#6B5545] max-w-[46ch]">
        Trois minutes pour écrire ou parler. Ancrage t&apos;écoute et te renvoie une pensée
        douce — pour fermer la journée l&apos;esprit plus léger.
      </p>

      <div className="flex flex-col items-center gap-3">
        <Link
          href="/journal"
          className="inline-block rounded-full bg-[#C0714F] px-8 py-4 text-base font-bold text-[#FBF7EE] shadow-[0_10px_30px_rgba(192,113,79,0.3)] transition-colors hover:bg-[#96543A]"
        >
          Commencer ce soir
        </Link>
        <span className="text-[13px] text-[#9A8270]">10 confidences offertes à l&apos;inscription</span>
      </div>

      {/* Carte mockup : aperçu d'une entrée de journal */}
      <div className="w-full max-w-[620px] mt-5 rounded-[22px] border border-[#33241A]/10 bg-[#ffffff] p-5 sm:p-[26px] text-left flex flex-col gap-[13px] shadow-[0_24px_50px_rgba(51,36,26,0.1)]">
        <div className="flex justify-between text-[11px] tracking-[0.12em] text-[#9A8270]">
          <span>21:42</span>
          <span>JOURNAL DU SOIR · IA</span>
        </div>
        <div className="flex gap-2">
          <span className="text-xs px-3 py-[5px] rounded-full bg-[#F3EBDC] text-[#6B5545]">Mêlé</span>
          <span className="text-xs px-3 py-[5px] rounded-full bg-[#C0714F] text-[#FBF7EE]">Serein</span>
          <span className="text-xs px-3 py-[5px] rounded-full bg-[#F3EBDC] text-[#6B5545]">Léger</span>
        </div>
        <div className="text-[15px] leading-[1.55] text-[#33241A]">
          Grosse journée, la réunion s&apos;est mieux passée…
        </div>
        <div className="rounded-[14px] bg-[#FBF3E8] px-4 py-[14px] text-[14.5px] leading-[1.55] text-[#7A4A31]">
          <span className="block text-[10px] tracking-[0.14em] text-[#B4694A] mb-[5px]">ANCRAGE</span>
          Tu as tenu une journée chargée avec brio. 🌿
        </div>
        <div className="text-[13px] text-[#9A8270]">Continuer à écrire… →</div>
      </div>

      {/* Trois mini-atouts */}
      <div className="w-full max-w-[680px] mt-5 flex flex-col sm:flex-row gap-6 sm:gap-9 text-left">
        {MINI_FEATURES.map((f) => (
          <div key={f.title} className="flex-1 flex flex-col gap-1.5 max-w-[210px] mx-auto sm:mx-0">
            <strong className="text-[15px] font-semibold text-[#33241A]">{f.title}</strong>
            <span className="text-[13.5px] leading-[1.55] text-[#6B5545]">{f.body}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
