"use client";

import { createContext, useContext, useEffect, useMemo, useSyncExternalStore } from "react";

// Colours live in globals.css (:root for day, [data-theme="dark"] for night). The theme is
// written to <html data-theme> by the inline script in the root layout before first paint, and
// again here whenever it changes, so every section switches from CSS alone.

const ThemeContext = createContext(null);

function getStoredTheme() {
  if (typeof window === "undefined") {
    return "light";
  }

  const storedTheme = window.localStorage.getItem("site-theme");
  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function subscribeToThemeChange(callback) {
  window.addEventListener("storage", callback);
  window.addEventListener("site-theme-change", callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("site-theme-change", callback);
  };
}

function saveTheme(theme) {
  window.localStorage.setItem("site-theme", theme);
  document.documentElement.dataset.theme = theme;
  window.dispatchEvent(new Event("site-theme-change"));
}

export function ThemeProvider({ children }) {
  const theme = useSyncExternalStore(subscribeToThemeChange, getStoredTheme, () => "light");

  // read the stored value, not `theme`: on the hydration pass `theme` is still the server's "light"
  // and writing it would flash the day theme for a frame
  useEffect(() => {
    document.documentElement.dataset.theme = getStoredTheme();
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme: saveTheme,
      toggleTheme: () => saveTheme(theme === "dark" ? "light" : "dark"),
    }),
    [theme],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}
