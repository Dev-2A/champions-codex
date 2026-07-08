import { create } from "zustand";

const STORAGE_KEY = "cc-theme";

function getInitialTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    /* noop */
  }
  return "dark"; // 기본: 다크
}

function applyTheme(theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
}

export const useThemeStore = create((set, get) => ({
  theme: getInitialTheme(),
  toggleTheme: () => {
    const next = get().theme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* noop */
    }
    applyTheme(next);
    set({ theme: next });
  },
  setTheme: (theme) => {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* noop */
    }
    applyTheme(theme);
    set({ theme });
  },
}));
