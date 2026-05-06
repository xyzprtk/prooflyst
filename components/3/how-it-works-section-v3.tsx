"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { FadeIn, StaggerContainer, StaggerItem } from "./motion-utils";

function IsometricBrowser() {
  return (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto max-w-[180px] mx-auto">
      <path d="M20 130 L100 170 L180 130 L100 90 Z" fill="currentColor" fillOpacity="0.04" />
      <path d="M40 50 L100 20 L160 50 L100 80 Z" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1" />
      <path d="M40 50 L40 110 L100 140 L100 80 Z" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1" />
      <path d="M100 80 L100 140 L160 110 L160 50 Z" fill="currentColor" fillOpacity="0.03" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1" />
      <path d="M40 50 L100 20 L160 50 L100 80 Z" fill="currentColor" fillOpacity="0.08" />
      <circle cx="65" cy="52" r="2.5" fill="#EF4444" fillOpacity="0.8" />
      <circle cx="75" cy="47" r="2.5" fill="#F59E0B" fillOpacity="0.8" />
      <circle cx="85" cy="42" r="2.5" fill="#10B981" fillOpacity="0.8" />
      <path d="M55 75 L85 60" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" strokeLinecap="round" />
      <path d="M55 85 L75 75" stroke="currentColor" strokeOpacity="0.12" strokeWidth="2" strokeLinecap="round" />
      <path d="M55 95 L70 87" stroke="currentColor" strokeOpacity="0.12" strokeWidth="2" strokeLinecap="round" />
      <motion.path
        d="M110 65 L140 50 L140 70 L110 85 Z"
        fill="#3B82F6"
        fillOpacity="0.2"
        animate={{ fillOpacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.path
        d="M110 85 L140 70 L140 90 L110 105 Z"
        fill="#3B82F6"
        fillOpacity="0.12"
        animate={{ fillOpacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
    </svg>
  );
}

function IsometricForm() {
  return (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto max-w-[180px] mx-auto">
      <path d="M20 130 L100 170 L180 130 L100 90 Z" fill="currentColor" fillOpacity="0.04" />
      <path d="M50 60 L100 35 L150 60 L100 85 Z" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1" />
      <path d="M50 60 L50 110 L100 135 L100 85 Z" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1" />
      <path d="M100 85 L100 135 L150 110 L150 60 Z" fill="currentColor" fillOpacity="0.03" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1" />
      <path d="M60 78 L90 63 L90 73 L60 88 Z" fill="currentColor" fillOpacity="0.1" />
      <path d="M60 93 L85 80 L85 90 L60 103 Z" fill="currentColor" fillOpacity="0.06" />
      <motion.path
        d="M60 108 L95 90 L95 100 L60 118 Z"
        fill="#3B82F6"
        fillOpacity="0.25"
        animate={{ fillOpacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <path d="M120 45 L145 32 L145 52 L120 65 Z" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1" />
      <path d="M120 45 L120 65 L105 72 L105 52 Z" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1" />
      <motion.path
        d="M125 52 L138 45"
        stroke="#3B82F6"
        strokeOpacity="0.4"
        strokeWidth="1.5"
        strokeLinecap="round"
        animate={{ pathLength: [0, 1, 1], opacity: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
      <motion.path
        d="M125 58 L132 54"
        stroke="#3B82F6"
        strokeOpacity="0.3"
        strokeWidth="1.5"
        strokeLinecap="round"
        animate={{ pathLength: [0, 1, 1], opacity: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
    </svg>
  );
}

function IsometricEmbed() {
  return (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto max-w-[180px] mx-auto">
      <path d="M20 130 L100 170 L180 130 L100 90 Z" fill="currentColor" fillOpacity="0.04" />
      <path d="M45 55 L100 27 L155 55 L100 83 Z" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1" />
      <path d="M45 55 L45 105 L100 133 L100 83 Z" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1" />
      <path d="M100 83 L100 133 L155 105 L155 55 Z" fill="currentColor" fillOpacity="0.03" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1" />
      <motion.path
        d="M58 72 L78 62"
        stroke="#3B82F6"
        strokeOpacity="0.4"
        strokeWidth="2"
        strokeLinecap="round"
        animate={{ pathLength: [0, 1, 1], opacity: [0, 1, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <path d="M58 82 L88 67" stroke="currentColor" strokeOpacity="0.15" strokeWidth="2" strokeLinecap="round" />
      <path d="M58 92 L82 80" stroke="currentColor" strokeOpacity="0.15" strokeWidth="2" strokeLinecap="round" />
      <motion.path
        d="M58 102 L72 95"
        stroke="#10B981"
        strokeOpacity="0.4"
        strokeWidth="2"
        strokeLinecap="round"
        animate={{ pathLength: [0, 1, 1], opacity: [0, 1, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <path d="M115 65 L108 70 L115 75" stroke="#F59E0B" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M135 65 L142 70 L135 75" stroke="#F59E0B" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <motion.path
        d="M125 35 L150 22 L150 42 L125 55 Z"
        fill="currentColor"
        fillOpacity="0.08"
        stroke="currentColor"
        strokeOpacity="0.15"
        strokeWidth="1"
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.path
        d="M125 35 L125 55 L110 62 L110 42 Z"
        fill="currentColor"
        fillOpacity="0.05"
        stroke="currentColor"
        strokeOpacity="0.15"
        strokeWidth="1"
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.path
        d="M130 45 L142 38"
        stroke="#3B82F6"
        strokeOpacity="0.4"
        strokeWidth="1.5"
        strokeLinecap="round"
        animate={{ pathLength: [0, 1, 1], opacity: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
      />
    </svg>
  );
}

const steps = [
  {
    number: "01",
    title: "Add your site",
    description: "Create a site in seconds. Get a hosted submission form and a wall of proofs ready to go.",
    illustration: IsometricBrowser,
  },
  {
    number: "02",
    title: "Collect testimonials",
    description: "Share your form link. Let people submit their thoughts. No friction, no follow-ups.",
    illustration: IsometricForm,
  },
  {
    number: "03",
    title: "Embed anywhere",
    description: "Copy a snippet. Paste it on your landing page. Your proof system goes live instantly.",
    illustration: IsometricEmbed,
  },
];

function StepCard({ step, index }: { step: typeof steps[0]; index: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["4deg", "-4deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-4deg", "4deg"]);

  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / rect.width - 0.5);
    y.set(mouseY / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const Illustration = step.illustration;

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="h-full"
    >
      <Card className="border-border bg-background h-full group relative overflow-hidden">
        {/* Glare */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
          style={{
            background: useTransform(
              [glareX, glareY],
              ([latestX, latestY]) =>
                `radial-gradient(circle at ${latestX}% ${latestY}%, rgba(255,255,255,0.07) 0%, transparent 60%)`
            ),
          }}
        />

        {/* Hover border */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-[-1px] rounded-xl bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 opacity-40" />
        </div>

        <CardContent className="p-6 relative z-0">
          {/* Step header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-sm font-mono font-medium text-primary">
              {step.number}
            </div>
            <motion.div
              className="h-1.5 w-1.5 rounded-full bg-primary"
              animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          {/* Floating isometric illustration */}
          <motion.div
            className="mb-6 flex justify-center"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 4 + index, repeat: Infinity, ease: "easeInOut" }}
          >
            <Illustration />
          </motion.div>

          <h3 className="text-lg font-semibold tracking-tight mb-2">
            {step.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {step.description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function HowItWorksSectionV3() {
  return (
    <section id="features" className="py-32">
      <div className="mx-auto max-w-7xl px-6">
        <FadeIn className="mb-20 max-w-xl">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4">
            How it works
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            Three steps. No complexity. Start collecting proof today.
          </p>
        </FadeIn>

        <StaggerContainer className="grid md:grid-cols-3 gap-6 relative" staggerDelay={0.15}>
          {steps.map((step, i) => (
            <StaggerItem key={step.number}>
              <StepCard step={step} index={i} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
