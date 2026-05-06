"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  hoverLift?: boolean;
  glass?: boolean;
}

const easeOut = [0.22, 1, 0.36, 1] as const;

export function AnimatedCard({
  children,
  className,
  delay = 0,
  hoverLift = true,
  glass = false,
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: easeOut, delay }}
      whileHover={
        hoverLift
          ? { y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }
          : undefined
      }
      className={cn(
        "rounded-2xl border border-border/50 bg-card shadow-sm transition-shadow",
        glass && "bg-card/70 backdrop-blur-xl",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
