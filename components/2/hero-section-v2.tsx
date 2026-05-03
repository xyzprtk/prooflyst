import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";

export function HeroSectionV2() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20">
      <div className="mx-auto max-w-5xl px-6 py-32 text-center">
        <h1 className="text-6xl font-semibold tracking-tighter sm:text-7xl lg:text-8xl mb-6">
          Proof, but structured.
        </h1>

        <p className="text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto mb-12">
          Collect, verify, and showcase testimonials — without the mess.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button
            size="lg"
            className="rounded-full text-base px-8 h-11"
            render={<Link href="/dashboard/setup" />}
          >
            Start Building
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full text-base px-8 h-11 border-border/60 bg-transparent hover:bg-foreground/5"
            render={<Link href="/dashboard/login" />}
          >
            Open Dashboard
          </Button>
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-px bg-border" />
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
      </div>
    </section>
  );
}
