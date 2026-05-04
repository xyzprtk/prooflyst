"use client";

import { motion } from "framer-motion";
import { TerminalCard } from "./terminal-card";
import { FadeIn, StaggerContainer, StaggerItem } from "./motion-utils";

const wallItems = [
  { content: "This completely changed how we handle customer feedback. Game changer.", author: "sarah_chen", role: "product_lead", company: "techcorp" },
  { content: "Finally, a system that makes sense. No more scattered screenshots.", author: "marcus_johnson", role: "founder", company: "startupxyz" },
  { content: "The API is so clean. Took me 10 minutes to integrate.", author: "alex_rivera", role: "engineer", company: "devstudio" },
  { content: "We use this for every product launch now. Essential tool.", author: "emma_wilson", role: "marketing_director", company: "growthco" },
  { content: "Structured proof is 10x more valuable than random testimonials.", author: "david_park", role: "ceo", company: "scaleup" },
  { content: "Worth every penny. The organization features alone saved us hours.", author: "lisa_thompson", role: "operations", company: "flowsystems" },
];

export function WallOfProofSectionV3() {
  return (
    <section className="py-32">
      <div className="mx-auto max-w-7xl px-6">
        <FadeIn className="max-w-2xl mb-20">
          <p className="text-xs font-mono text-muted-foreground mb-3">// wall_of_proof</p>
          <h2 className="text-2xl md:text-3xl font-mono font-medium tracking-tight mb-4">
            Your proof, all in one place.
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            Not a list. Not a doc. A living system of credibility.
          </p>
        </FadeIn>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-4" staggerDelay={0.08}>
          {wallItems.map((item, index) => (
            <StaggerItem key={index}>
              <motion.div
                whileHover={{ y: -2, borderColor: "rgba(59, 130, 246, 0.2)" }}
                transition={{ duration: 0.2 }}
              >
                <TerminalCard
                  title={`${item.author}@${item.company}`}
                  className={index === 1 || index === 4 ? "lg:mt-10" : ""}
                >
                  <p className="text-sm text-white/70 leading-relaxed mb-4">
                    <span className="text-primary/60">&gt; </span>
                    {item.content}
                  </p>
                  <div className="flex items-center gap-2 text-xs font-mono text-white/40">
                    <span className="text-primary/40">~</span>
                    <span>{item.role}</span>
                  </div>
                </TerminalCard>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
