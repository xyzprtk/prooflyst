"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { FadeIn } from "./motion-utils";

export function FinalCTASectionV3() {
  return (
    <section className="py-40 relative">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(59,130,246,0.03)_0%,transparent_50%)]" />

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tighter mb-6">
            Your product already has proof.
          </h2>
        </FadeIn>

        <FadeIn delay={0.1}>
          <p className="text-lg text-muted-foreground leading-relaxed mb-10">
            You just haven&apos;t structured it yet.
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="inline-block"
          >
            <Button
              size="lg"
              className="rounded-full text-base px-8 h-11 mb-6"
              render={<Link href="/dashboard/setup" />}
            >
              Start building your proof system
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div>
            <Link
              href="https://github.com/xyzprtk/prooflyst"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Or read the docs →
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
