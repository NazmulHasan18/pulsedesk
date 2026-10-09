"use client";

import { createContext, useContext, useEffect, useMemo, useSyncExternalStore } from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const storageKey = "pulsedesk-theme";
const listeners = new Set<() => void>();

function getStoredTheme(): Theme | null {
  if (typeof window === "undefined") {
    return null;
  }

  const storedTheme = window.localStorage.getItem(storageKey);
  return storedTheme === "light" || storedTheme === "dark" ? storedTheme : null;
}

function getClientTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  return getStoredTheme() ??
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
}

function getServerTheme(): Theme {
  return "light";
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function setTheme(theme: Theme) {
  window.localStorage.setItem(storageKey, theme);
  listeners.forEach((listener) => listener());
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // React hydrates from the light server snapshot, then reconciles the browser
  // preference through useSyncExternalStore without a state update in an effect.
  const theme = useSyncExternalStore(subscribe, getClientTheme, getServerTheme);

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => setTheme(theme === "dark" ? "light" : "dark"),
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}
