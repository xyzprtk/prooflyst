"use client";

import { useEffect, useRef } from "react";
import { useMotionValue, useTransform, animate } from "motion/react";

interface CountUpProps {
  value: number;
  duration?: number;
  format?: (n: number) => string;
  className?: string;
}

export function CountUp({
  value,
  duration = 1.2,
  format = (n) => Math.round(n).toString(),
  className,
}: CountUpProps) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v) => format(v));
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
    });
    return controls.stop;
  }, [value, duration, motionValue]);

  useEffect(() => {
    const unsub = rounded.on("change", (v) => {
      if (ref.current) ref.current.textContent = v;
    });
    return unsub;
  }, [rounded]);

  return <span ref={ref} className={className}>{format(0)}</span>;
}
