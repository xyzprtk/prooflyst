"use client";

import Image from "next/image";

interface LogoProps {
  size?: number;
}

export function Logo({ size = 20 }: LogoProps) {
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
