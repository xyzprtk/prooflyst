import { Navbar } from "./sections/navbar";
import { HeroSection } from "./sections/hero";
import { FeaturesSection } from "./sections/features";
import { CodePreviewSection } from "./sections/code-preview";
import { HowItWorksSection } from "./sections/how-it-works";
import { PricingSection } from "./sections/pricing";
import { Footer } from "./sections/footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <CodePreviewSection />
      <HowItWorksSection />
      <PricingSection />
      <Footer />
    </main>
  );
}
