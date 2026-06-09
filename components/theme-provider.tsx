"use client";

import {
  createContext,
  use,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";

type Theme = "light" | "dark" | "system";

interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: Theme;
  themes: Theme[];
}

const ThemeProviderContext = createContext<ThemeProviderState>({
  theme: "system",
  setTheme: () => {},
  resolvedTheme: "light",
  themes: ["light", "dark", "system"],
});

export function useTheme() {
  return use(ThemeProviderContext);
}

interface ThemeProviderProps {
  children: React.ReactNode;
  attribute?: "class" | `data-${string}`;
  defaultTheme?: Theme;
  enableSystem?: boolean;
}

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "system",
  enableSystem = true,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return defaultTheme;
    try {
      const savedTheme = localStorage.getItem("theme") as Theme | null;
      return savedTheme || defaultTheme;
    } catch {
      return defaultTheme;
    }
  });

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem("theme", newTheme);
    } catch {
      // ignore
    }
  }, []);

  const resolvedTheme =
    typeof window === "undefined"
      ? "light"
      : theme === "system" && enableSystem
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : theme;

  useEffect(() => {
    const root = document.documentElement;
    const resolved =
      theme === "system" && enableSystem
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : theme;

    if (attribute === "class") {
      root.classList.remove("light", "dark");
      if (resolved) {
        root.classList.add(resolved);
      }
    } else {
      root.setAttribute(attribute, resolved);
    }

    root.style.colorScheme = resolved === "dark" ? "dark" : "light";
  }, [theme, attribute, enableSystem]);

  useEffect(() => {
    if (!enableSystem || typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => {
      if (theme === "system") {
        const root = document.documentElement;
        const resolved = mediaQuery.matches ? "dark" : "light";
        if (attribute === "class") {
          root.classList.remove("light", "dark");
          root.classList.add(resolved);
        } else {
          root.setAttribute(attribute, resolved);
        }
        root.style.colorScheme = resolved === "dark" ? "dark" : "light";
      }
    };

    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, [theme, attribute, enableSystem]);

  const contextValue = useMemo(
    () => ({
      theme,
      setTheme,
      resolvedTheme,
      themes: ["light", "dark", "system"] as Theme[],
    }),
    [theme, setTheme, resolvedTheme]
  );

  return (
    <ThemeProviderContext.Provider value={contextValue}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
