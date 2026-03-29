"use client";

import Image from "next/image";

export function Logo({ size = 32 }: { size?: number }) {
  return (
    <div className="relative" style={{ width: size, height: size }} suppressHydrationWarning>
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