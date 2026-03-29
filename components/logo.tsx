"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export function Logo({ size = 32 }: { size?: number }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="relative" style={{ width: size, height: size }}>
        <Image
          src="/logos/logo-dark.png"
          alt="Prooflyst"
          width={size}
          height={size}
          className="absolute inset-0"
        />
      </div>
    );
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <Image
        src="/logos/logo-dark.png"
        alt="Prooflyst"
        width={size}
        height={size}
        className="absolute inset-0 block dark:hidden"
      />
      <Image
        src="/logos/logo-light.png"
        alt="Prooflyst"
        width={size}
        height={size}
        className="absolute inset-0 hidden dark:block"
      />
    </div>
  );
}