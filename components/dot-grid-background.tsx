"use client";

import { useRef } from "react";

interface DotGridBackgroundProps {
  className?: string;
}

/**
 * Interactive dot grid (21st.dev 2083 style): a faint white dot matrix with a
 * gold "spotlight" of dots that follows the cursor. Pure CSS masks driven by
 * --mx/--my CSS vars — no React re-render on mousemove.
 */
export function DotGridBackground({ className = "" }: DotGridBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      className={`dotgrid ${className}`}
      style={{ pointerEvents: "auto" }}
      aria-hidden="true"
    >
      <div className="dotgrid-base" />
      <div className="dotgrid-glow" />
    </div>
  );
}
