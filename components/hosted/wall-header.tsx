"use client";

import { useState, useEffect } from "react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface WallHeaderProps {
  siteName: string;
  heading?: string;
  count: number;
  slug: string;
  accentColor?: string;
}

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

export function WallHeader({
  siteName,
  heading,
  count,
  slug,
  accentColor,
}: WallHeaderProps) {
  const scrolled = useScrollState();

  return (
    <>
      <nav
        className={cn(
          "fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 rounded-2xl",
          scrolled
            ? "bg-background/80 backdrop-blur-xl shadow-lg border border-border/50"
            : "bg-background/60 backdrop-blur-sm border border-transparent"
        )}
      >
        <div className="flex h-14 items-center justify-between px-6 min-w-[340px] sm:min-w-[600px] max-w-3xl">
          <Link href="/" className="flex items-center gap-2">
            <Logo size={28} />
            <span className="text-lg font-semibold tracking-tight text-foreground">
              Prooflyst
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a
              href={`/t/${slug}`}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-medium transition-colors",
                !accentColor && "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
              {...(accentColor
                ? { style: { backgroundColor: accentColor, color: "white" } }
                : {})}
            >
              Share your experience
            </a>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-6 pt-24 pb-8">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {heading ?? `What people say about ${siteName}`}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {count} testimonial{count !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
    </>
  );
}