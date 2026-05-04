"use client";

import { FadeIn } from "./motion-utils";

export function PhilosophySectionV3() {
  return (
    <section className="py-40 border-t border-border/20">
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tighter mb-12">
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
            <p className="text-xl font-semibold text-foreground">
              Because trust isn&apos;t built once. It&apos;s built continuously.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
