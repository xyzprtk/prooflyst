"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

type ThemeMode = "light" | "dark" | "system";

function applyTheme(mode: ThemeMode) {
  if (typeof window === "undefined") return;
  const root = document.documentElement;

  const shouldUseDark =
    mode === "dark" ||
    (mode === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  root.classList.toggle("dark", shouldUseDark);
}

export function ThemeToggle({ inverse = false }: { inverse?: boolean }) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "system";
    const saved = localStorage.getItem("theme") as ThemeMode | null;
    return saved === "light" || saved === "dark" || saved === "system"
      ? saved
      : "system";
  });

  useEffect(() => {
    applyTheme(mode);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (mode === "system") {
        applyTheme("system");
      }
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [mode]);

  function cycleTheme() {
    const nextMode = mode === "light" ? "dark" : mode === "dark" ? "system" : "light";
    setMode(nextMode);
    localStorage.setItem("theme", nextMode);
    applyTheme(nextMode);
  }

  const isDark = mode === "dark" || (mode === "system" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const buttonClassName = inverse
    ? "h-9 w-9 text-white dark:text-slate-900 hover:bg-white/10 dark:hover:bg-slate-900/10"
    : "h-9 w-9";

  return (
    <Button
      variant="ghost"
      size="icon"
      className={buttonClassName}
      onClick={cycleTheme}
      title={mode === "light" ? "Light mode" : mode === "dark" ? "Dark mode" : "System mode"}
    >
      {inverse ? (
        <>
          <Sun className="h-4 w-4 block dark:hidden" />
          <Moon className="h-4 w-4 hidden dark:block" />
        </>
      ) : (
        <>
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </>
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
