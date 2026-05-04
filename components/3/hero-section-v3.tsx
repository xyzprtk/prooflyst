"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AsciiLogo } from "./ascii-art";
import { TypewriterText } from "./motion-utils";

export function HeroSectionV3() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Monochrome gradient bg — light in light mode, dark in dark mode */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,#fafafa_0%,#f5f5f5_40%,#fafafa_100%)] dark:bg-[linear-gradient(180deg,#050505_0%,#0a0a0a_40%,#060606_100%)]" />

      <div className="mx-auto max-w-4xl px-6 py-32 text-center">
        {/* ASCII Logo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="mb-8 flex justify-center"
        >
          <AsciiLogo />
        </motion.div>

        {/* Headline with terminal prompt */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-mono font-medium tracking-tight mb-6">
            <span className="text-primary">&gt;</span>{" "}
            Proof, but structured.
          </h1>
        </motion.div>

        {/* Typewriter subheadline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto mb-12 font-mono"
        >
          <TypewriterText
            text="Collect, verify, and showcase testimonials — without the mess."
            delay={0.8}
            speed={25}
          />
        </motion.div>

        {/* Terminal-style CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <Button
            size="lg"
            className="rounded-full text-sm font-mono px-8 h-11 bg-primary text-primary-foreground hover:bg-primary/90"
            render={<Link href="/dashboard/setup" />}
          >
            $ ./start_building
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full text-sm font-mono px-8 h-11 border-border/60 bg-transparent hover:bg-foreground/5"
            render={<Link href="/dashboard/login" />}
          >
            $ ./open_dashboard
          </Button>
        </motion.div>

        {/* Trust badges as comments */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.8 }}
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-mono text-muted-foreground"
        >
          <span># free_tier_forever</span>
          <span># no_credit_card</span>
          <span># open_source</span>
        </motion.div>
      </div>
    </section>
  );
}
