"use client";

import { useEffect, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

/**
 * Soft gold glow that trails the cursor on fine-pointer (desktop) devices.
 * Purely decorative, pointer-transparent, and disabled on touch / reduced
 * motion. Adds a subtle "alive" feel without distracting from content.
 */

const FINE_POINTER = "(pointer: fine)";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/** Subscribe to changes on a media query without a setState-in-effect gate. */
function subscribeMedia(query: string, onChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia(query);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

/**
 * The glow is enabled only on a fine pointer with motion allowed. Read via
 * `useSyncExternalStore` so SSR/first render return `false` (no mismatch) and
 * the value stays live if the user switches input device or motion preference.
 */
function useGlowEnabled(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const unsubFine = subscribeMedia(FINE_POINTER, onChange);
      const unsubMotion = subscribeMedia(REDUCED_MOTION, onChange);
      return () => {
        unsubFine();
        unsubMotion();
      };
    },
    () =>
      window.matchMedia(FINE_POINTER).matches &&
      !window.matchMedia(REDUCED_MOTION).matches,
    () => false
  );
}

export function CursorGlow() {
  const enabled = useGlowEnabled();
  const x = useMotionValue(-500);
  const y = useMotionValue(-500);
  const sx = useSpring(x, { stiffness: 180, damping: 26, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 180, damping: 26, mass: 0.5 });

  useEffect(() => {
    if (!enabled) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed z-[55] hidden lg:block"
      style={{
        x: sx,
        y: sy,
        translateX: "-50%",
        translateY: "-50%",
        width: 460,
        height: 460,
        borderRadius: "9999px",
        background:
          "radial-gradient(circle, rgba(212,168,71,0.10), rgba(212,168,71,0.04) 35%, transparent 70%)",
        mixBlendMode: "screen",
      }}
    />
  );
}
