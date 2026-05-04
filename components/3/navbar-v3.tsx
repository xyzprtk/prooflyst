"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";
import Link from "next/link";

function useScrollState() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return scrolled;
}

function LogoInverseInner() {
  return (
    <div className="relative h-5 w-5">
      <Image src="/logos/logo-light.png" alt="Prooflyst" width={20} height={20} className="absolute inset-0 block dark:hidden" />
      <Image src="/logos/logo-dark.png" alt="Prooflyst" width={20} height={20} className="absolute inset-0 hidden dark:block" />
    </div>
  );
}

const LogoInverse = dynamic(() => Promise.resolve(LogoInverseInner), { ssr: false });

export function NavbarV3() {
  const scrolled = useScrollState();

  return (
    <nav
      className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 rounded-full",
        "bg-[#0a0a0a] dark:bg-[#fafafa] border border-white/10 dark:border-black/10",
        scrolled && "backdrop-blur-xl"
      )}
    >
      <div className="flex h-12 items-center justify-between px-6 min-w-[720px] max-w-3xl">
        <Link href="/" className="flex items-center gap-2">
          <LogoInverse />
          <span className="text-sm font-mono font-medium tracking-tight text-white dark:text-black">
            prooflyst
          </span>
        </Link>

        <div className="hidden items-center gap-1 rounded-full border border-white/10 dark:border-black/10 bg-white/[0.04] dark:bg-black/[0.04] p-1 md:flex">
          {[
            { label: "features", href: "#features" },
            { label: "api", href: "#api" },
            { label: "pricing", href: "#pricing" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-full px-4 py-1.5 text-xs font-mono text-white/40 dark:text-black/40 hover:text-white dark:hover:text-black hover:bg-white/10 dark:hover:bg-black/10 transition-colors"
            >
              <span className="text-primary/60 group-hover:text-primary transition-colors">$ </span>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle inverse />
          <Link
            href="https://github.com/xyzprtk/prooflyst"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full px-4 py-1.5 text-xs font-mono text-white/40 dark:text-black/40 hover:text-white dark:hover:text-black hover:bg-white/10 dark:hover:bg-black/10 transition-colors"
          >
            gh
          </Link>
          <Link
            href="/dashboard/setup"
            className={cn(
              "rounded-full px-5 py-2 text-xs font-mono font-medium transition-colors",
              "bg-white text-black hover:bg-white/90 dark:bg-black dark:text-white dark:hover:bg-black/90"
            )}
          >
            [ start ]
          </Link>
        </div>
      </div>
    </nav>
  );
}
