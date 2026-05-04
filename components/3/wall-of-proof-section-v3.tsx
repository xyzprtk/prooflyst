"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { FadeIn, StaggerContainer, StaggerItem } from "./motion-utils";

const wallItems = [
  {
    content: "This space is reserved for our very first user. Will it be you?",
    author: "You",
    role: "Your role",
    company: "Your company",
  },
  {
    content: "Imagine your best customer saying something amazing about your product right here.",
    author: "Future You",
    role: "Founder",
    company: "Your startup",
  },
  {
    content: "We built this because collecting feedback shouldn't require a messy spreadsheet.",
    author: "The Prooflyst Team",
    role: "Builders",
    company: "Prooflyst",
  },
];

export function WallOfProofSectionV3() {
  return (
    <section className="py-32">
      <div className="mx-auto max-w-7xl px-6">
        <FadeIn className="max-w-2xl mb-20">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4">
            Your proof, all in one place.
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            Not a list. Not a doc. A living system of credibility.
          </p>
        </FadeIn>

        <StaggerContainer className="grid md:grid-cols-3 gap-6" staggerDelay={0.12}>
          {wallItems.map((item, index) => (
            <StaggerItem key={index}>
              <motion.div
                whileHover={{ y: -2, borderColor: "rgba(59, 130, 246, 0.2)" }}
                transition={{ duration: 0.2 }}
              >
                <Card className="border-border/40 bg-muted/30 rounded-xl hover:border-foreground/10 transition-colors h-full">
                  <CardContent className="p-6">
                    <p className="text-sm text-foreground leading-relaxed mb-6">
                      &ldquo;{item.content}&rdquo;
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-medium text-primary">
                          {item.author.split(" ").map((n) => n[0]).join("")}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.author}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.role}, {item.company}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
