"use client";

import { motion } from "motion/react";
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

function TerminalCard({ children, title, variant = "default" }: { children: React.ReactNode; title: string; variant?: "default" | "error" | "primary" }) {
  const borderColors = {
    default: "border-border/50",
    error: "border-destructive/20",
    primary: "border-primary/20",
  };
  const titleColors = {
    default: "text-muted-foreground",
    error: "text-destructive/60",
    primary: "text-primary/60",
  };

  return (
    <div className={`rounded-xl border overflow-hidden bg-card ${borderColors[variant]}`}>
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/30">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500/50" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/50" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-500/50" />
        </div>
        <span className={`text-[10px] font-mono ml-2 ${titleColors[variant]}`}>{title}</span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export function WhyProoflystSection() {
  return (
    <section className="py-32">
      <div className="mx-auto max-w-7xl px-6">
        <FadeIn className="mb-20 max-w-xl">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4">
            Developer Contrast
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            Stop writing spaghetti code to manage testimonials.
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-6 relative">
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
