"use client";

import { motion } from "framer-motion";
import { TerminalCard } from "./terminal-card";
import { FadeIn } from "./motion-utils";

const logLines = [
  { level: "ERROR", text: "feedback scattered across Slack threads, screenshots, and scattered docs", color: "text-red-400/80" },
  { level: "WARN", text: "messy, unsearchable, and impossible to act on", color: "text-yellow-400/80" },
  { level: "INFO", text: "", color: "" },
  { level: "OK", text: "Prooflyst fixes that.", color: "text-primary" },
];

export function PainSectionV3() {
  return (
    <section className="py-32">
      <div className="mx-auto max-w-3xl px-6">
        <FadeIn>
          <TerminalCard title="pain.log" variant="error">
            <div className="font-mono text-sm space-y-3">
              {logLines.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                  className="flex items-start gap-3"
                >
                  {line.level ? (
                    <>
                      <span className={line.color}>[{line.level}]</span>
                      <span className="text-white/70">{line.text}</span>
                    </>
                  ) : (
                    <span>&nbsp;</span>
                  )}
                </motion.div>
              ))}
            </div>
          </TerminalCard>
        </FadeIn>
      </div>
    </section>
  );
}
