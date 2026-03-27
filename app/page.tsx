import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero";
import { FeaturesSection } from "@/components/features";
import { CodePreviewSection } from "@/components/code-preview";
import { HowItWorksSection } from "@/components/how-it-works";
import { PricingSection } from "@/components/pricing";
import { Footer } from "@/components/footer";

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
