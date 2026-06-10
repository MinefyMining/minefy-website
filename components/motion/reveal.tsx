"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

const OFFSET: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 28 },
  down: { y: -28 },
  left: { x: 28 },
  right: { x: -28 },
  none: {},
};

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Entrance direction. Default: "up" */
  direction?: Direction;
  /** Delay in seconds. Default: 0 */
  delay?: number;
  /** Re-trigger every time it enters the viewport. Default: false (once) */
  repeat?: boolean;
}

/**
 * Scroll-reveal wrapper backed by motion `whileInView` with a spring.
 * Honors `prefers-reduced-motion` (renders content static).
 */
export function Reveal({
  children,
  className = "",
  direction = "up",
  delay = 0,
  repeat = false,
}: RevealProps) {
  const reduce = useReducedMotion();
  const offset = OFFSET[direction];

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: !repeat, amount: 0.2, margin: "0px 0px -10% 0px" }}
      transition={{
        type: "spring",
        stiffness: 90,
        damping: 18,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 95, damping: 18 },
  },
};

interface StaggerProps {
  children: ReactNode;
  className?: string;
}

/** Container that staggers the entrance of `<StaggerItem>` children on scroll. */
export function Stagger({ children, className = "" }: StaggerProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
    >
      {children}
    </motion.div>
  );
}

/** Child of `<Stagger>`. */
export function StaggerItem({ children, className = "" }: StaggerProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}
