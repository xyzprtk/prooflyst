"use client";

import { motion } from "framer-motion";
import { TerminalCard } from "./terminal-card";
import { FadeIn, StaggerContainer, StaggerItem } from "./motion-utils";

const steps = [
  {
    comment: "// step_01: init",
    title: "Add your site",
    description: "Create a site in seconds. Get a hosted submission form and a wall of proofs ready to go.",
    ascii: (
      <pre className="font-mono text-[9px] leading-[1.2] text-white/30 select-none">
{`┌──────────────┐
│  browser     │
│  ┌────────┐  │
│  │ your   │  │
│  │ site   │  │
│  └────────┘  │
└──────────────┘`}
      </pre>
    ),
  },
  {
    comment: "// step_02: collect",
    title: "Collect testimonials",
    description: "Share your form link. Let people submit their thoughts. No friction, no follow-ups.",
    ascii: (
      <pre className="font-mono text-[9px] leading-[1.2] text-white/30 select-none">
{`┌──────────────┐
│  message     │
│  ┌────────┐  │
│  │ great  │  │
│  │ work!  │  │
│  └────────┘  │
└──────────────┘`}
      </pre>
    ),
  },
  {
    comment: "// step_03: embed",
    title: "Embed anywhere",
    description: "Copy a snippet. Paste it on your landing page. Your proof system goes live instantly.",
    ascii: (
      <pre className="font-mono text-[9px] leading-[1.2] text-white/30 select-none">
{`┌──────────────┐
│  &lt;script&gt;    │
│  src=...     │
│  &lt;/script&gt;   │
│              │
└──────────────┘`}
      </pre>
    ),
  },
];

export function HowItWorksSectionV3() {
  return (
    <section id="features" className="py-32">
      <div className="mx-auto max-w-7xl px-6">
        <FadeIn className="mb-20 max-w-xl">
          <p className="text-xs font-mono text-muted-foreground mb-3">// how_it_works</p>
          <h2 className="text-2xl md:text-3xl font-mono font-medium tracking-tight mb-4">
            Three steps. No complexity.
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            Start collecting proof today.
          </p>
        </FadeIn>

        <StaggerContainer className="grid md:grid-cols-3 gap-6 relative" staggerDelay={0.15}>
          {steps.map((step, i) => (
            <StaggerItem key={i}>
              <TerminalCard title={step.comment.replace("// ", "")} className="h-full">
                <div className="mb-6 flex justify-center">
                  {step.ascii}
                </div>
                <h3 className="text-lg font-mono font-medium tracking-tight mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  {step.description}
                </p>
              </TerminalCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
