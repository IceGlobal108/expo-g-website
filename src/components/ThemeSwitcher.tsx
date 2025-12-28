import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Palette } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";

const themeOptions = [
  { id: "theme-cosmic", label: "Cosmic", swatch: "linear-gradient(135deg, #7f5af0, #2cb1ff)" },
  { id: "theme-sand", label: "Sand", swatch: "linear-gradient(135deg, #f4e6d2, #f7c59f)" },
  { id: "theme-emerald", label: "Emerald", swatch: "linear-gradient(135deg, #1dbf73, #35c9a7)" },
  { id: "theme-royal", label: "Royal", swatch: "linear-gradient(135deg, #7c5cff, #4ea9ff)" },
  { id: "theme-mono", label: "Mono", swatch: "linear-gradient(135deg, #111, #555)" },
  { id: "theme-ocean", label: "Ocean", swatch: "linear-gradient(135deg, #4db6ff, #2dd4bf)" },
  { id: "theme-sunset", label: "Sunset", swatch: "linear-gradient(135deg, #ff8a4c, #f565c7)" },
  { id: "theme-antique", label: "Antique", swatch: "linear-gradient(135deg, #f0e6d2, #c89d73)" },
  { id: "theme-ice", label: "Ice", swatch: "linear-gradient(135deg, #e7f1ff, #9bd8ff)" },
  { id: "theme-ember", label: "Ember", swatch: "linear-gradient(135deg, #ff9d4a, #f25f5c)" },
  { id: "theme-blush", label: "Blush", swatch: "linear-gradient(135deg, #f9d7d7, #f9b4c6)" },
  { id: "theme-mint", label: "Mint", swatch: "linear-gradient(135deg, #dcf7ec, #9be6c7)" },
  { id: "theme-sky", label: "Sky", swatch: "linear-gradient(135deg, #e7f5ff, #a7d8ff)" },
];

const STORAGE_KEY = "expo-theme";

export const ThemeSwitcher = ({ className }: { className?: string }) => {
  const [current, setCurrent] = useState<string>("theme-cosmic");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && themeOptions.find((t) => t.id === stored)) {
      setCurrent(stored);
    }
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    themeOptions.forEach((t) => root.classList.remove(t.id));
    root.classList.add(current);
    localStorage.setItem(STORAGE_KEY, current);
  }, [current]);

  const activeTheme = useMemo(() => themeOptions.find((t) => t.id === current), [current]);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-xl border border-border/60 bg-card/70 px-3 py-2 shadow-sm",
        className,
      )}
    >
      <Palette className="w-4 h-4 text-primary" />
      <Select value={current} onValueChange={setCurrent}>
        <SelectTrigger className="w-44 border-0 bg-transparent px-0 h-auto focus:ring-0 focus:ring-offset-0">
          <div className="flex items-center gap-2 text-sm">
            <span
              className="h-4 w-4 rounded-full border border-border/70"
              style={{ backgroundImage: activeTheme?.swatch }}
              aria-hidden
            />
            <span className="text-foreground/90">{activeTheme?.label ?? "Theme"}</span>
          </div>
        </SelectTrigger>
        <SelectContent align="end">
          {themeOptions.map((theme) => (
            <SelectItem key={theme.id} value={theme.id}>
              <div className="flex items-center gap-2">
                <span
                  className="h-4 w-4 rounded-full border border-border/70"
                  style={{ backgroundImage: theme.swatch }}
                  aria-hidden
                />
                <span>{theme.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
