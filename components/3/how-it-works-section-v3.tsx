"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FadeIn, StaggerContainer, StaggerItem } from "./motion-utils";

const steps = [
  {
    number: "01",
    title: "Add your site",
    description: "Create a site in seconds. Get a hosted submission form and a wall of proofs ready to go.",
  },
  {
    number: "02",
    title: "Collect testimonials",
    description: "Share your form link. Let people submit their thoughts. No friction, no follow-ups.",
  },
  {
    number: "03",
    title: "Embed anywhere",
    description: "Copy a snippet. Paste it on your landing page. Your proof system goes live instantly.",
  },
];

export function HowItWorksSectionV3() {
  return (
    <section id="features" className="py-32">
      <div className="mx-auto max-w-7xl px-6">
        <FadeIn className="mb-20 max-w-xl">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4">
            How it works
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            Three steps. No complexity. Start collecting proof today.
          </p>
        </FadeIn>

        <StaggerContainer className="grid md:grid-cols-3 gap-6 relative" staggerDelay={0.15}>
          {steps.map((step) => (
            <StaggerItem key={step.number}>
              <Card className="border-border/50 bg-card h-full hover:border-foreground/10 transition-colors">
                <CardContent className="p-6">
                  <div className="text-sm text-muted-foreground mb-4 font-mono">
                    {step.number}
                  </div>
                  <h3 className="text-lg font-semibold tracking-tight mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
