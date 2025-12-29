import { useLayoutEffect } from "react";
import { themeOptions } from "@/data/themes";

const DEFAULT_THEME = "theme-minimal";

const ThemeLoader = () => {
  useLayoutEffect(() => {
    const applyTheme = (id: string) => {
      const valid = themeOptions.find((t) => t.id === id) ? id : DEFAULT_THEME;
      const root = document.documentElement;
      themeOptions.forEach((t) => root.classList.remove(t.id));
      root.classList.add(valid);
      try {
        localStorage.setItem("platform_theme", valid);
      } catch {
        /* ignore */
      }
    };

    // Apply immediately from cache to prevent flash
    try {
      const cached = localStorage.getItem("platform_theme");
      applyTheme(cached || DEFAULT_THEME);
    } catch {
      applyTheme(DEFAULT_THEME);
    }

    // Then refresh from API
    const load = async () => {
      try {
        const base = import.meta.env.VITE_API_BASE_URL || "";
        const res = await fetch(`${base}/theme`);
        if (!res.ok) throw new Error("theme fetch failed");
        const data = await res.json();
        applyTheme(data?.current || DEFAULT_THEME);
      } catch {
        // keep cached/default
      }
    };
    load();
  }, []);

  return null;
};

export default ThemeLoader;
