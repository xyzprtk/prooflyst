"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { TypewriterText } from "./motion-utils";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,#fafafa_0%,#f5f5f5_40%,#fafafa_100%)] dark:bg-[linear-gradient(180deg,#050505_0%,#0a0a0a_40%,#060606_100%)]" />

      <div className="mx-auto max-w-4xl px-6 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight mb-6">
            Proof, but structured.
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto mb-12"
        >
          <TypewriterText
            text="Collect, verify, and showcase testimonials, without the mess."
            delay={0.7}
            speed={25}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <Button
            size="lg"
            className="rounded-full text-base px-8 h-11"
            render={<Link href="/dashboard/setup" />}
          >
            Start Building
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full text-base px-8 h-11 border-border/60 bg-transparent hover:bg-foreground/5"
            render={<Link href="/dashboard/login" />}
          >
            Open Dashboard
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.6 }}
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-primary" />
            <span>Free tier forever</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-primary" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-primary" />
            <span>Open source SDK</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
