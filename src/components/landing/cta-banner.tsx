import Link from "next/link";

export function CTABanner() {
  return (
    <section className="px-5 sm:px-8 lg:px-14 pb-6">
      <div className="rounded-[26px] bg-[#C0714F] px-6 sm:px-12 py-14 sm:py-16 text-center text-[#FBF7EE]">
        <h2 className="font-display font-normal text-[1.9rem] sm:text-[38px] mb-3.5">
          Ce soir, dépose ta journée.
        </h2>
        <p className="text-[15px] sm:text-base leading-[1.6] text-[#FBF7EE]/85 max-w-[50ch] mx-auto mb-6">
          Trois minutes suffisent. Ancrage t&apos;écoute et te renvoie un reflet doux pour
          fermer l&apos;esprit plus léger.
        </p>
        <Link
          href="/journal"
          className="inline-block rounded-full bg-[#FBF7EE] px-8 py-[15px] text-base font-bold text-[#8F4A2C] transition-colors hover:bg-[#ffffff]"
        >
          Commencer ce soir
        </Link>
        <p className="text-[13px] text-[#FBF7EE]/70 mt-3.5">10 confidences offertes à l&apos;inscription</p>
      </div>
    </section>
  );
}
