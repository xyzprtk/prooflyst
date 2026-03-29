"use client";

import dynamic from "next/dynamic";
import Image from "next/image";

function LogoInner({ size = 32 }: { size?: number }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <Image
        src="/logos/logo-light.png"
        alt="Prooflyst"
        width={size}
        height={size}
        className="absolute inset-0 block dark:hidden"
      />
      <Image
        src="/logos/logo-dark.png"
        alt="Prooflyst"
        width={size}
        height={size}
        className="absolute inset-0 hidden dark:block"
      />
    </div>
  );
}

export const Logo = dynamic(() => Promise.resolve(LogoInner), {
  ssr: false,
  loading: () => <div style={{ width: 32, height: 32 }} />,
});