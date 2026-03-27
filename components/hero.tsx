import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Check } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.05),transparent_50%)]" />
      </div>
      
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl">
          <Badge variant="secondary" className="mb-6 bg-primary/10 text-primary hover:bg-primary/20 border-none">
            Now in Public Beta
          </Badge>
          
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl mb-6">
          Proof, but structured.
            {/* <span className="block text-primary">stop screenshotting testimonials</span> */}
          </h1>
          
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
          Stop screenshotting testimonials. Start building a proof system.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed max-w-2xl mb-8">
          Collect, verify, and showcase social proof — without the mess.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="text-base px-8">
              Start Building
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8">
              View Documentation
            </Button>
          </div>
          
          <div className="mt-12 flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>Free tier forever</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>Open source SDK</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
