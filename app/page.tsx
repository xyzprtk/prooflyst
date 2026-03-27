import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero";
import { SocialProofSection } from "@/components/social-proof";
import { HowItWorksSection } from "@/components/how-it-works";
import { WallOfProofSection } from "@/components/wall-of-proof";
import { CodePreviewSection } from "@/components/code-preview";
import { WhyProoflystSection } from "@/components/why-prooflyst";
import { PricingSection } from "@/components/pricing";
import { PhilosophySection } from "@/components/philosophy";
import { FinalCTASection } from "@/components/final-cta";
import { Footer } from "@/components/footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
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
