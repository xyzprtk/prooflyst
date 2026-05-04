import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(59,130,246,0.08),transparent_60%)]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-32 text-center">
        <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl mb-6">
          Proof, but structured.
        </h1>

        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-4">
          Stop screenshotting testimonials. Start building a proof system.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10">
          Collect, verify, and showcase social proof — without the mess.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button size="lg" className="rounded-full text-base px-8 h-11" render={<Link href="/dashboard/setup" />}>
            Start Building
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full text-base px-8 h-11"
            render={<Link href="/dashboard/login" />}
          >
            Open Dashboard
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground">
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
    </section>
  );
}