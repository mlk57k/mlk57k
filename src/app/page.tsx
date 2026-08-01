import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { SocialProof } from "@/components/landing/social-proof";
import { CTABanner } from "@/components/landing/cta-banner";

export default function Home() {
  return (
    <div className="bg-[#FBF7EE] text-[#33241A]">
      <div className="mx-auto max-w-[1040px] bg-[#FBF7EE]">
        <Navbar />
        <main>
          <Hero />
          <HowItWorks />
          <SocialProof />
          <CTABanner />
        </main>
        <Footer />
      </div>
    </div>
  );
}
