"use client";

import { motion, useScroll, useSpring } from "motion/react";

const GRADIENTS = {
  gold: "bg-gradient-to-r from-[#D4A847] via-[#F5D98B] to-[#D4A847]",
  green: "bg-gradient-to-r from-[#16A34A] via-[#4ADE80] to-[#16A34A]",
} as const;

/**
 * Thin progress bar pinned to the very top, tracking page scroll. Defaults
 * to the mineração gold gradient; the Agrofy layout passes `variant="green"`
 * so the sector's ambient chrome never leaks the other sector's color.
 */
export function ScrollProgress({ variant = "gold" }: { variant?: keyof typeof GRADIENTS }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className={`fixed left-0 right-0 top-0 z-[70] h-0.5 origin-left ${GRADIENTS[variant]}`}
      aria-hidden="true"
    />
  );
}
