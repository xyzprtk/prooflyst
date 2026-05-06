"use client";

import { motion } from "motion/react";

export function PainSection() {
  return (
    <section className="py-32">
      <div className="mx-auto max-w-5xl px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-2xl md:text-3xl lg:text-4xl text-foreground/90 leading-snug tracking-tight"
        >
          Most teams track customer feedback across Slack threads, screenshots, and scattered docs. It&apos;s messy, unsearchable, and impossible to act on.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-xl md:text-2xl lg:text-3xl font-semibold text-primary mt-8"
        >
          Prooflyst fixes that.
        </motion.p>
      </div>
    </section>
  );
}
