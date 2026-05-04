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

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
    </svg>
  );
}

export function NavbarV3() {
  const scrolled = useScrollState();

  return (
    <nav
      className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 rounded-full",
        "bg-slate-900 dark:bg-white border border-white/10 dark:border-slate-900/10",
        scrolled && "backdrop-blur-xl border-white/10 dark:border-slate-200/50"
      )}
    >
      <div className="flex h-12 items-center justify-between px-6 min-w-[720px] max-w-3xl">
        <Link href="/" className="flex items-center gap-2">
          <LogoInverse />
          <span className="text-sm font-semibold tracking-tight text-white dark:text-slate-900">
            Prooflyst
          </span>
        </Link>

        <div className="hidden items-center gap-1 rounded-full bg-white/5 dark:bg-slate-900/5 p-1 md:flex">
          {[
            { label: "Features", href: "#features" },
            { label: "API", href: "#api" },
            { label: "Pricing", href: "#pricing" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-1.5 text-sm text-slate-300 dark:text-slate-600 hover:text-white dark:hover:text-slate-900 hover:bg-white/10 dark:hover:bg-slate-900/10 transition-colors"
            >
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
            className="rounded-full p-2 text-slate-300 dark:text-slate-600 hover:text-white dark:hover:text-slate-900 hover:bg-white/10 dark:hover:bg-slate-900/10 transition-colors"
          >
            <GitHubIcon className="h-4 w-4" />
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
