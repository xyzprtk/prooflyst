"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "./motion-utils";

const freeFeatures = [
  "Collect testimonials",
  "Hosted collection form",
  "Basic embed widget",
  "Community support",
];

const proFeatures = [
  "Everything in Free",
  "API access",
  "Custom domains",
  "Priority support",
  "Advanced analytics",
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-32">
      <div className="mx-auto max-w-7xl px-6">
        <FadeIn className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4">
            Simple pricing. No nonsense.
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            Start free, scale when you need to. No hidden fees.
          </p>
        </FadeIn>

        <StaggerContainer className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto" staggerDelay={0.12}>
          <StaggerItem>
            <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
              <Card className="border-border/60 relative overflow-hidden rounded-xl h-full">
                <CardContent className="p-8">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold">Free</h3>
                    <p className="text-sm text-muted-foreground">For getting started</p>
                  </div>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">$0</span>
                    <span className="text-muted-foreground text-sm ml-2">forever</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {freeFeatures.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-foreground">
                        <Check className="h-4 w-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" size="lg" className="w-full rounded-full">
                    Start free
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </StaggerItem>

          <StaggerItem>
            <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
              <Card className="border-primary/30 relative overflow-hidden rounded-xl h-full">
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-bl-lg">
                  Popular
                </div>
                <CardContent className="p-8">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold">Pro</h3>
                    <p className="text-sm text-muted-foreground">For people who care about growth</p>
                  </div>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">$9</span>
                    <span className="text-muted-foreground text-sm ml-2">/month</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {proFeatures.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-foreground">
                        <Check className="h-4 w-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button size="lg" className="w-full rounded-full">
                    Upgrade to Pro
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </section>
  );
}
