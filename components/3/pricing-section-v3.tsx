"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TerminalCard } from "./terminal-card";
import { FadeIn, StaggerContainer, StaggerItem } from "./motion-utils";

const freeFeatures = [
  "unlimited_testimonials",
  "hosted_collection_form",
  "basic_embed_widget",
  "community_support",
];

const proFeatures = [
  "everything_in_free",
  "api_access",
  "custom_domains",
  "priority_support",
  "advanced_analytics",
];

export function PricingSectionV3() {
  return (
    <section id="pricing" className="py-32">
      <div className="mx-auto max-w-7xl px-6">
        <FadeIn className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-2xl md:text-3xl font-mono font-medium tracking-tight mb-4">
            Simple pricing. No nonsense.
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            Start free, scale when you need to.
          </p>
        </FadeIn>

        <StaggerContainer className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto" staggerDelay={0.12}>
          <StaggerItem>
            <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
              <TerminalCard title="free.plan">
                <div className="mb-6">
                  <h3 className="text-lg font-mono font-medium mb-1">Free</h3>
                  <p className="text-xs font-mono text-white/40">for getting started</p>
                </div>
                <div className="mb-8">
                  <span className="text-4xl font-mono font-medium">$0</span>
                  <span className="text-white/40 text-sm font-mono ml-2">forever</span>
                </div>
                <ul className="space-y-3 mb-10">
                  {freeFeatures.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm font-mono text-white/70">
                      <span className="text-emerald-400/60">+</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" size="lg" className="w-full rounded-full font-mono text-sm border-white/20 hover:bg-white/5">
                  $ start_free
                </Button>
              </TerminalCard>
            </motion.div>
          </StaggerItem>

          <StaggerItem>
            <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
              <TerminalCard title="pro.plan" variant="primary">
                <div className="mb-6">
                  <h3 className="text-lg font-mono font-medium mb-1">Pro</h3>
                  <p className="text-xs font-mono text-primary/50">for people who care about growth</p>
                </div>
                <div className="mb-8">
                  <span className="text-4xl font-mono font-medium">$9</span>
                  <span className="text-white/40 text-sm font-mono ml-2">/month</span>
                </div>
                <ul className="space-y-3 mb-10">
                  {proFeatures.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm font-mono text-white/70">
                      <span className="text-primary/60">+</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button size="lg" className="w-full rounded-full font-mono text-sm">
                  $ upgrade_pro
                </Button>
              </TerminalCard>
            </motion.div>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </section>
  );
}
