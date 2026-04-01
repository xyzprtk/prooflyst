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

function LogoInner() {
  return (
    <div className="relative h-8 w-8">
      <Image
        src="/logos/logo-dark.png"
        alt="Prooflyst"
        width={32}
        height={32}
        className="absolute inset-0 block dark:hidden"
      />
      <Image
        src="/logos/logo-light.png"
        alt="Prooflyst"
        width={32}
        height={32}
        className="absolute inset-0 hidden dark:block"
      />
    </div>
  );
}

function LogoInverseInner() {
  return (
    <div className="relative h-8 w-8">
      <Image
        src="/logos/logo-light.png"
        alt="Prooflyst"
        width={32}
        height={32}
        className="absolute inset-0 block dark:hidden"
      />
      <Image
        src="/logos/logo-dark.png"
        alt="Prooflyst"
        width={32}
        height={32}
        className="absolute inset-0 hidden dark:block"
      />
    </div>
  );
}

const Logo = dynamic(() => Promise.resolve(LogoInner), { ssr: false });
const LogoInverse = dynamic(() => Promise.resolve(LogoInverseInner), { ssr: false });

function LogoPlaceholder() {
  return <div className="h-8 w-8" />;
}

export function Navbar() {
  const scrolled = useScrollState();

  return (
    <nav
      className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 rounded-2xl",
        scrolled
          ? "bg-background/80 backdrop-blur-xl shadow-lg border border-border/50"
          : "bg-background/60 backdrop-blur-sm"
      )}
    >
      <div className="flex h-14 items-center justify-between px-6 min-w-[800px] max-w-5xl">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
          <span className="text-lg font-semibold tracking-tight text-foreground">Prooflyst</span>
        </Link>
        <div className="hidden items-center gap-1 rounded-full bg-muted p-1 md:flex">
          <Link
            href="#features"
            className="rounded-full px-4 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-background transition-colors"
          >
            Features
          </Link>
          <Link
            href="#api"
            className="rounded-full px-4 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-background transition-colors"
          >
            API
          </Link>
          <Link
            href="#pricing"
            className="rounded-full px-4 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-background transition-colors"
          >
            Pricing
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="https://github.com/xyzprtk/prooflyst"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full px-4 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            GitHub
          </Link>
          <Link
            href="/dashboard/setup"
            className={cn(
              "rounded-full px-5 py-2 text-sm font-medium transition-colors",
              "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}

export function NavbarInverse() {
  const scrolled = useScrollState();

  return (
    <nav
      className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 rounded-2xl bg-slate-900 dark:bg-white",
        scrolled && "backdrop-blur-xl shadow-lg border border-slate-700/50 dark:border-slate-200/50"
      )}
    >
      <div className="flex h-14 items-center justify-between px-6 min-w-[800px] max-w-5xl">
        <Link href="/" className="flex items-center gap-2">
          <LogoInverse />
          <span className="text-lg font-semibold tracking-tight text-white dark:text-slate-900">Prooflyst</span>
        </Link>
        <div className="hidden items-center gap-1 rounded-full bg-white/10 dark:bg-slate-900/10 p-1 md:flex">
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
