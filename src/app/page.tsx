import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { BeforeAfter } from "@/components/landing/before-after";
import { SocialProof } from "@/components/landing/social-proof";
import { FAQ } from "@/components/landing/faq";
import { CTABanner } from "@/components/landing/cta-banner";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <BeforeAfter />
        <SocialProof />
        <CTABanner />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
