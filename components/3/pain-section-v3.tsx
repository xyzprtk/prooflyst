"use client";

import { motion } from "framer-motion";
import { FadeIn } from "./motion-utils";

export function PainSectionV3() {
  return (
    <section className="py-32">
      <div className="mx-auto max-w-3xl px-6">
        <FadeIn>
          <div className="rounded-xl border border-border bg-card p-8 md:p-10">
            <div className="space-y-4">
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0, duration: 0.5 }}
                className="text-lg md:text-xl text-foreground/80 leading-relaxed"
              >
                Most teams track customer feedback across Slack threads, screenshots, and scattered docs. It&apos;s messy, unsearchable, and impossible to act on.
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-xl md:text-2xl font-semibold text-primary"
              >
                Prooflyst fixes that.
              </motion.p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
