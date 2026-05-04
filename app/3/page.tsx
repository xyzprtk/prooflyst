import { NavbarV3 } from "@/components/3/navbar-v3";
import { HeroSectionV3 } from "@/components/3/hero-section-v3";
import { PainSectionV3 } from "@/components/3/pain-section-v3";
import { SectionDivider } from "@/components/3/section-divider";
import { HowItWorksSectionV3 } from "@/components/3/how-it-works-section-v3";
import { WallOfProofSectionV3 } from "@/components/3/wall-of-proof-section-v3";
import { CodePreviewSectionV3 } from "@/components/3/code-preview-section-v3";
import { WhyProoflystSectionV3 } from "@/components/3/why-prooflyst-section-v3";
import { PricingSectionV3 } from "@/components/3/pricing-section-v3";
import { PhilosophySectionV3 } from "@/components/3/philosophy-section-v3";
import { FinalCTASectionV3 } from "@/components/3/final-cta-section-v3";
import { Footer } from "@/components/footer";

export default function LandingPageV3() {
  return (
    <main className="min-h-screen">
      <NavbarV3 />
      <HeroSectionV3 />
      <SectionDivider />
      <PainSectionV3 />
      <SectionDivider />
      <HowItWorksSectionV3 />
      <SectionDivider />
      <WallOfProofSectionV3 />
      <SectionDivider />
      <CodePreviewSectionV3 />
      <SectionDivider />
      <WhyProoflystSectionV3 />
      <SectionDivider />
      <PricingSectionV3 />
      <SectionDivider />
      <PhilosophySectionV3 />
      <SectionDivider />
      <FinalCTASectionV3 />
      <Footer />
    </main>
  );
}
