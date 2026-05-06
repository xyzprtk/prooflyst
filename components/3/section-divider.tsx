"use client";

import { motion } from "motion/react";

export function SectionDivider() {
  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="h-px bg-border/40 origin-left"
        />
      </div>
    </div>
  );
}
