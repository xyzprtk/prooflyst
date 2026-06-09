"use client";

import { useState } from "react";
import { LazyMotion, m, AnimatePresence, domAnimation } from "motion/react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  value: string;
  size?: "sm" | "md";
  className?: string;
}

export function CopyButton({ value, size = "sm", className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  const buttonSize = size === "sm" ? "h-7 w-7" : "h-9 w-9";

  return (
    <LazyMotion features={domAnimation}>
    <m.button
      onClick={handleCopy}
      whileTap={{ scale: 0.85 }}
      className={cn(
        "inline-flex items-center justify-center rounded-lg hover:bg-muted transition-colors",
        buttonSize,
        className
      )}
      title="Copy"
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <m.div
            key="check"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Check className={cn(iconSize, "text-green-600")} />
          </m.div>
        ) : (
          <m.div
            key="copy"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Copy className={iconSize} />
          </m.div>
        )}
      </AnimatePresence>
    </m.button>
    </LazyMotion>
  );
}
