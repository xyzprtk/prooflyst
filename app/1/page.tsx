import { NavbarInverse } from "@/components/navbar";
import { HeroSection } from "@/components/1/hero-section";
import { SocialProofSection } from "@/components/1/social-proof-section";
import { HowItWorksSection } from "@/components/1/how-it-works-section";
import { WallOfProofSection } from "@/components/wall-of-proof";
import { CodePreviewSection } from "@/components/code-preview";
import { WhyProoflystSection } from "@/components/1/why-prooflyst-section";
import { PricingSection } from "@/components/pricing";
import { PhilosophySection } from "@/components/1/philosophy-section";
import { FinalCTASection } from "@/components/1/final-cta-section";
import { Footer } from "@/components/footer";

export default function LandingPageV1() {
  return (
    <main className="min-h-screen">
      <NavbarInverse />
      <HeroSection />
      <SocialProofSection />
      <HowItWorksSection />
      <WallOfProofSection />
      <CodePreviewSection />
      <WhyProoflystSection />
      <PricingSection />
      <PhilosophySection />
      <FinalCTASection />
      <Footer />
    </main>
  );
}