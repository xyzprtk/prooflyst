import { Navbar } from "@/components/landing/navbar";
import { HeroSection } from "@/components/landing/hero";
import { PainSection } from "@/components/landing/pain-section";
import { SectionDivider } from "@/components/landing/section-divider";
import { HowItWorksSection } from "@/components/landing/how-it-works";
import { WallOfProofSection } from "@/components/landing/wall-of-proof";
import { CodePreviewSection } from "@/components/landing/code-preview";
import { WhyProoflystSection } from "@/components/landing/why-prooflyst";
import { PricingSection } from "@/components/landing/pricing";
import { PhilosophySection } from "@/components/landing/philosophy";
import { FinalCTASection } from "@/components/landing/final-cta";
import { Footer } from "@/components/footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <SectionDivider />
      <PainSection />
      <SectionDivider />
      <HowItWorksSection />
      <SectionDivider />
      <WallOfProofSection />
      <SectionDivider />
      <CodePreviewSection />
      <SectionDivider />
      <WhyProoflystSection />
      <SectionDivider />
      <PricingSection />
      <SectionDivider />
      <PhilosophySection />
      <SectionDivider />
      <FinalCTASection />
      <Footer />
    </main>
  );
}
