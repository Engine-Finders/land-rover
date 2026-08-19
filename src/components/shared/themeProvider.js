"use client";

import { createContext, useContext, useEffect, useMemo, useSyncExternalStore } from "react";

const themes = {
  light: {
    "--color-page": "#f8f7f2",
    "--color-page-soft": "#efeee8",
    "--color-surface": "#ffffff",
    "--color-surface-raised": "rgba(255, 255, 255, 0.96)",
    "--color-surface-glass": "rgba(255, 255, 255, 0.84)",
    "--color-table-surface": "rgba(255, 255, 255, 0.97)",
    "--color-text": "#17201c",
    "--color-text-muted": "#4b5751",
    "--color-text-soft": "#748078",
    "--color-border": "#d5dad4",
    "--color-border-strong": "#aebbb3",
    "--color-primary": "#175f46",
    "--color-primary-strong": "#0d4935",
    "--color-primary-soft": "#e4f0e9",
    "--color-chrome": "#103d30",
    "--color-accent": "#b4863f",
    "--color-accent-red": "#a93b43",
    "--color-accent-red-soft": "#f8e9ea",
    "--color-accent-green": "#2f805c",
    "--color-accent-green-soft": "#e3f1e9",
    "--color-shadow": "rgba(22, 54, 42, 0.12)",
    "--color-hero-overlay": "rgba(248, 247, 242, 0.66)",
    "--color-hero-fade": "rgba(248, 247, 242, 0.96)",
    "--color-navbar": "rgba(248, 247, 242, 0.96)",
    "--color-glass-border": "rgba(23, 95, 70, 0.16)",
    "--color-glass-shadow": "rgba(22, 54, 42, 0.1)",
    "--color-btn-hover": "rgba(255, 255, 255, 0.12)",
    "--color-btn-hover-text": "#ffffff",
  },
  dark: {
    "--color-page": "#0d1c18",
    "--color-page-soft": "#142722",
    "--color-surface": "#182e28",
    "--color-surface-raised": "rgba(27, 49, 42, 0.96)",
    "--color-surface-glass": "rgba(20, 42, 35, 0.86)",
    "--color-table-surface": "rgba(24, 46, 39, 0.97)",
    "--color-text": "#f4f3ed",
    "--color-text-muted": "#d2dbd5",
    "--color-text-soft": "#a5b6ad",
    "--color-border": "#38584d",
    "--color-border-strong": "#58776c",
    "--color-primary": "#69b58a",
    "--color-primary-strong": "#8bcaa4",
    "--color-primary-soft": "rgba(105, 181, 138, 0.16)",
    "--color-chrome": "#24533f",
    "--color-accent": "#d4aa68",
    "--color-accent-red": "#ee7c82",
    "--color-accent-red-soft": "rgba(238, 124, 130, 0.16)",
    "--color-accent-green": "#7bc39a",
    "--color-accent-green-soft": "rgba(123, 195, 154, 0.16)",
    "--color-shadow": "rgba(0, 9, 6, 0.42)",
    "--color-hero-overlay": "rgba(13, 28, 24, 0.58)",
    "--color-hero-fade": "rgba(13, 28, 24, 0.94)",
    "--color-navbar": "rgba(11, 27, 23, 0.95)",
    "--color-glass-border": "rgba(151, 205, 174, 0.24)",
    "--color-glass-shadow": "rgba(0, 9, 6, 0.34)",
    "--color-btn-hover": "rgba(255, 255, 255, 0.12)",
    "--color-btn-hover-text": "#ffffff",
  },
};

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
  window.dispatchEvent(new Event("site-theme-change"));
}

export function ThemeProvider({ children }) {
  const theme = useSyncExternalStore(subscribeToThemeChange, getStoredTheme, () => "light");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
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
      <div style={themes[theme]}>{children}</div>
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
