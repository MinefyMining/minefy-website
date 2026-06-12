"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** Thin gold progress bar pinned to the very top, tracking page scroll. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed left-0 right-0 top-0 z-[70] h-0.5 origin-left bg-gradient-to-r from-[#D4A847] via-[#F5D98B] to-[#D4A847]"
      aria-hidden="true"
    />
  );
}
