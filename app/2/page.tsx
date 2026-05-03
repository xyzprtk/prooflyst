import { NavbarV2 } from "@/components/2/navbar-v2";
import { HeroSectionV2 } from "@/components/2/hero-section-v2";
import { SocialProofSectionV2 } from "@/components/2/social-proof-section-v2";
import { HowItWorksSectionV2 } from "@/components/2/how-it-works-section-v2";
import { WallOfProofSectionV2 } from "@/components/2/wall-of-proof-section-v2";
import { CodePreviewSectionV2 } from "@/components/2/code-preview-section-v2";
import { WhyProoflystSectionV2 } from "@/components/2/why-prooflyst-section-v2";
import { PricingSectionV2 } from "@/components/2/pricing-section-v2";
import { PhilosophySectionV2 } from "@/components/2/philosophy-section-v2";
import { FinalCTASectionV2 } from "@/components/2/final-cta-section-v2";
import { Footer } from "@/components/footer";

export default function LandingPageV2() {
  return (
    <main className="min-h-screen">
      <NavbarV2 />
      <HeroSectionV2 />
      <SocialProofSectionV2 />
      <HowItWorksSectionV2 />
      <WallOfProofSectionV2 />
      <CodePreviewSectionV2 />
      <WhyProoflystSectionV2 />
      <PricingSectionV2 />
      <PhilosophySectionV2 />
      <FinalCTASectionV2 />
      <Footer />
    </main>
  );
}
