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
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrolled;
}

function LogoInverseInner() {
  return (
    <div className="relative h-6 w-6">
      <Image
        src="/logos/logo-light.png"
        alt="Prooflyst"
        width={24}
        height={24}
        className="absolute inset-0 block dark:hidden"
      />
      <Image
        src="/logos/logo-dark.png"
        alt="Prooflyst"
        width={24}
        height={24}
        className="absolute inset-0 hidden dark:block"
      />
    </div>
  );
}

const LogoInverse = dynamic(() => Promise.resolve(LogoInverseInner), { ssr: false });

export function NavbarV2() {
  const scrolled = useScrollState();

  return (
    <nav
      className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 rounded-full",
        "bg-slate-900 dark:bg-white",
        scrolled
          ? "backdrop-blur-xl border border-slate-700/50 dark:border-slate-200/50"
          : "border border-white/10 dark:border-slate-900/10"
      )}
    >
      <div className="flex h-12 items-center justify-between px-5 min-w-[720px] max-w-3xl">
        <Link href="/" className="flex items-center gap-2">
          <LogoInverse />
          <span className="text-base font-semibold tracking-tight text-white dark:text-slate-900">
            Prooflyst
          </span>
        </Link>

        <div className="hidden items-center gap-1 rounded-full bg-white/5 dark:bg-slate-900/5 p-1 md:flex">
          <Link
            href="#features"
            className="rounded-full px-4 py-1.5 text-sm text-slate-300 dark:text-slate-600 hover:text-white dark:hover:text-slate-900 hover:bg-white/5 dark:hover:bg-slate-900/5 transition-colors"
          >
            Features
          </Link>
          <Link
            href="#api"
            className="rounded-full px-4 py-1.5 text-sm text-slate-300 dark:text-slate-600 hover:text-white dark:hover:text-slate-900 hover:bg-white/5 dark:hover:bg-slate-900/5 transition-colors"
          >
            API
          </Link>
          <Link
            href="#pricing"
            className="rounded-full px-4 py-1.5 text-sm text-slate-300 dark:text-slate-600 hover:text-white dark:hover:text-slate-900 hover:bg-white/5 dark:hover:bg-slate-900/5 transition-colors"
          >
            Pricing
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle inverse />
          <Link
            href="https://github.com/xyzprtk/prooflyst"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full px-4 py-1.5 text-sm text-slate-300 dark:text-slate-600 hover:text-white dark:hover:text-slate-900 hover:bg-white/10 dark:hover:bg-slate-900/10 transition-colors"
          >
            GitHub
          </Link>
          <Link
            href="/dashboard/setup"
            className={cn(
              "rounded-full px-5 py-2 text-sm font-medium transition-colors",
              "bg-white text-slate-900 hover:bg-white/90 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-900/90"
            )}
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
