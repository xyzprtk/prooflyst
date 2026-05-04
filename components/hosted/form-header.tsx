"use client";

import { useState, useEffect } from "react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface FormHeaderProps {
  siteName: string;
  heading?: string;
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

export function FormHeader({
  siteName,
  heading,
  slug,
  accentColor,
}: FormHeaderProps) {
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
              href={`/wall/${slug}`}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-medium transition-colors",
                !accentColor && "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
              {...(accentColor
                ? { style: { backgroundColor: accentColor, color: "white" } }
                : {})}
            >
              View testimonials
            </a>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-lg px-6 pt-24 pb-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            {heading ?? `Share your experience`}
          </h1>
          <p className="text-muted-foreground">
            We&apos;d love to hear what you think about {siteName}.
          </p>
        </div>
      </div>
    </>
  );
}