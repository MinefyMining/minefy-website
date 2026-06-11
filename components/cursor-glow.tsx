"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

/**
 * Soft gold glow that trails the cursor on fine-pointer (desktop) devices.
 * Purely decorative, pointer-transparent, and disabled on touch / reduced
 * motion. Adds a subtle "alive" feel without distracting from content.
 */
export function CursorGlow() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const x = useMotionValue(-500);
  const y = useMotionValue(-500);
  const sx = useSpring(x, { stiffness: 180, damping: 26, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 180, damping: 26, mass: 0.5 });

  useEffect(() => {
    if (reduce) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    setEnabled(true);
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [reduce, x, y]);

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
