"use client";

import { motion } from "framer-motion";
import { TerminalCard } from "./terminal-card";
import { FadeIn } from "./motion-utils";

const spaghettiCode = `// The Old Way: Managing testimonials
const fs = require('fs');
const csv = fs.readFileSync('testimonials.csv', 'utf8');
const rows = csv.split('\\n').slice(1);
const testimonials = [];

for (const row of rows) {
  const cols = row.split(',');
  const text = cols[0].replace(/[<>]/g, '');
  const author = cols[1].trim();
  testimonials.push({ text, author });
}

let html = '<div class="testimonials">';
for (const t of testimonials) {
  html += \`<div class="review">
    <p>"\${t.text}"</p>
    <strong>\${t.author}</strong>
  </div>\`;
}
html += '</div>';
fs.writeFileSync('output.html', html);`;

const prooflystCode = `// The Prooflyst Way: Clean API
const response = await fetch(
  'https://api.prooflyst.io/v1/testimonials', {
  headers: { 'Authorization': 'Bearer YOUR_API_KEY' }
});

const { data } = await response.json();
// data is ready to use
renderTestimonials(data);`;

export function WhyProoflystSectionV3() {
  return (
    <section className="py-32">
      <div className="mx-auto max-w-7xl px-6">
        <FadeIn className="mb-20 max-w-xl">
          <h2 className="text-2xl md:text-3xl font-mono font-medium tracking-tight mb-4">
            Stop writing spaghetti code.
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            One API call. That&apos;s it.
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-6 relative">
          {/* VS indicator */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="h-10 w-10 rounded-full bg-background border border-border/50 flex items-center justify-center font-mono text-xs text-muted-foreground"
            >
              VS
            </motion.div>
          </div>

          <FadeIn direction="left">
            <TerminalCard title="old_way.js" variant="error">
              <pre className="text-xs text-red-300/70 font-mono overflow-x-auto leading-relaxed">
                <code>{spaghettiCode}</code>
              </pre>
            </TerminalCard>
          </FadeIn>

          <FadeIn direction="right" delay={0.15}>
            <TerminalCard title="prooflyst.js" variant="primary">
              <pre className="text-xs text-blue-300/80 font-mono overflow-x-auto leading-relaxed">
                <code>{prooflystCode}</code>
              </pre>
            </TerminalCard>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
