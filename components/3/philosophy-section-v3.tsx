"use client";

import { FadeIn } from "./motion-utils";
import { AsciiGridPattern } from "./ascii-art";

export function PhilosophySectionV3() {
  return (
    <section className="py-40 border-t border-border/20 relative overflow-hidden">
      <AsciiGridPattern />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <FadeIn>
          <p className="text-xs font-mono text-muted-foreground mb-6">// philosophy</p>
          <h2 className="text-3xl md:text-4xl font-mono font-medium tracking-tighter mb-12">
            Proof compounds.
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              Every testimonial you collect is an asset. But only if you can actually use it.
            </p>
            <p>
              Prooflyst turns scattered praise into something structured, searchable, and reusable.
            </p>
            <p className="text-xl font-mono font-medium text-primary">
              Because trust isn&apos;t built once. It&apos;s built continuously.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
