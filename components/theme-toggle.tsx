"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sun, Moon, Laptop } from "lucide-react";

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

  function updateMode(nextMode: ThemeMode) {
    setMode(nextMode);
    localStorage.setItem("theme", nextMode);
    applyTheme(nextMode);
  }

  const sunClasses = inverse
    ? "h-4 w-4"
    : "h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0";

  const moonClasses = inverse
    ? "h-4 w-4"
    : "absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100";

  const buttonClassName = inverse
    ? "h-9 w-9 text-white hover:bg-white/10"
    : "h-9 w-9";

  const iconWrapperStyle = inverse
    ? { ["--icon-color" as string]: "var(--inverse-icon-color, currentColor)" }
    : {};

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" className={buttonClassName}>
            {inverse ? (
              <>
                <Sun className={`${sunClasses} block dark:hidden`} />
                <Moon className={`${moonClasses} hidden dark:block text-slate-900`} />
              </>
            ) : (
              <>
                <Sun className={sunClasses} />
                <Moon className={moonClasses} />
              </>
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        }
      />
      <DropdownMenuContent
        align="end"
        className={inverse ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700" : ""}
      >
        <DropdownMenuItem
          onClick={() => updateMode("light")}
          className={inverse ? "text-slate-900 dark:text-white focus:bg-slate-100 dark:focus:bg-slate-800" : ""}
        >
          <Sun className="mr-2 h-4 w-4" />
          Light {mode === "light" ? "✓" : ""}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => updateMode("dark")}
          className={inverse ? "text-slate-900 dark:text-white focus:bg-slate-100 dark:focus:bg-slate-800" : ""}
        >
          <Moon className="mr-2 h-4 w-4" />
          Dark {mode === "dark" ? "✓" : ""}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => updateMode("system")}
          className={inverse ? "text-slate-900 dark:text-white focus:bg-slate-100 dark:focus:bg-slate-800" : ""}
        >
          <Laptop className="mr-2 h-4 w-4" />
          System {mode === "system" ? "✓" : ""}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
