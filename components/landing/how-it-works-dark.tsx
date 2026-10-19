"use client";

import Image from "next/image";
import { m } from "motion/react";
import { FadeIn, StaggerContainer, StaggerItem } from "./motion-utils";

const steps = [
  {
    number: "01",
    title: "Add your site",
    description: "Create a site in seconds. Get a hosted submission form and a wall of proofs ready to go.",
    image: "/illustrations/step-01.png",
    alt: "Isometric illustration of a browser window being constructed with floating UI elements",
  },
  {
    number: "02",
    title: "Collect testimonials",
    description: "Share your form link. Let people submit their thoughts. No friction, no follow-ups.",
    image: "/illustrations/step-02.png",
    alt: "Isometric illustration of testimonial cards flowing into a collection box",
  },
  {
    number: "03",
    title: "Embed anywhere",
    description: "Copy a snippet. Paste it on your landing page. Your proof system goes live instantly.",
    image: "/illustrations/step-03.png",
    alt: "Isometric illustration of code transforming into a live website with testimonials",
  },
];

function StepCard({ step, index }: { step: typeof steps[0]; index: number }) {
  return (
    <m.div
      className="h-full"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="h-full flex flex-col">
        {/* Step number + indicator */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.06] text-sm font-mono font-medium text-white/80">
            {step.number}
          </div>
          <div className="h-1.5 w-1.5 rounded-full bg-white/40" />
        </div>

        {/* Image - blends directly with the dark background */}
        <div className="flex-1 flex items-center justify-center min-h-[220px]">
          <div className="w-full max-w-[280px] relative aspect-square">
            <Image
              src={step.image}
              alt={step.alt}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 33vw"
              priority={index === 0}
            />
          </div>
        </div>

        {/* Text */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold tracking-tight mb-2 text-white/90">
            {step.title}
          </h3>
          <p className="text-sm text-white/40 leading-relaxed">
            {step.description}
          </p>
        </div>
      </div>
    </m.div>
  );
}

export function HowItWorksSectionDark() {
  return (
    <section id="features" className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Rounded dark container - like Stripe's hero */}
        <div className="relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden bg-[#0a0a0a]">
          {/* Rough grain texture overlay */}
          <div 
            className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat",
              backgroundSize: "256px 256px",
            }}
          />

          {/* Subtle inner gradient for depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] via-transparent to-transparent pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 px-6 sm:px-10 py-12 sm:py-16">
            <FadeIn className="mb-12 sm:mb-16 max-w-xl">
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-4 text-white">
                How it works
              </h2>
              <p className="text-base text-white/40 leading-relaxed">
                Three steps. No complexity. Start collecting proof today.
              </p>
            </FadeIn>

            <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10" staggerDelay={0.15}>
              {steps.map((step, i) => (
                <StaggerItem key={step.number}>
                  <StepCard step={step} index={i} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
