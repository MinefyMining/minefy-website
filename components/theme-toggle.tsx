"use client";

import { Sun, Moon } from "lucide-react";
import { useIsLight, useMounted } from "@/lib/use-theme-store";

/** Dark/light theme toggle — flips `html.light` and persists in localStorage. */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const light = useIsLight();
  const mounted = useMounted();

  function toggle() {
    const next = !document.documentElement.classList.contains("light");
    document.documentElement.classList.toggle("light", next);
    try {
      localStorage.setItem("minefy-theme", next ? "light" : "dark");
    } catch {
      // ignore
    }
    // `light` updates automatically via the MutationObserver in useIsLight.
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={light ? "Mudar para tema escuro" : "Mudar para tema claro"}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground/70 transition-colors hover:border-primary/50 hover:text-primary ${className}`}
    >
      {mounted && light ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </button>
  );
}
