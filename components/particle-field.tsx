"use client";

import { useEffect, useRef } from "react";

interface ParticleFieldProps {
  className?: string;
  /** base density divisor — higher = fewer particles. Default 16000 */
  density?: number;
  /** connection distance in px. Default 130 */
  linkDistance?: number;
  /** node/link color as an "r,g,b" triplet. Default gold "212,168,71". */
  colorRgb?: string;
  /** cursor-proximity highlight color as an "r,g,b" triplet. Default "245,217,139". */
  highlightRgb?: string;
}

type P = { x: number; y: number; vx: number; vy: number };

/**
 * Interactive particle constellation rendered on a 2D canvas: nodes drift
 * and link to nearby nodes; the cursor pulls nearby nodes and lights their
 * links. DPR-aware, pauses when offscreen/hidden, and renders a single static
 * frame under `prefers-reduced-motion`. Pointer-transparent.
 *
 * Color is parametrized (`colorRgb`/`highlightRgb`) rather than hardcoded so
 * the Agrofy division can reuse this exact engine in green (`AgroHeroHome`)
 * without a duplicate canvas implementation — defaults reproduce the
 * original gold mining look byte-for-byte.
 */
export function ParticleField({
  className = "",
  density = 16000,
  linkDistance = 130,
  colorRgb = "212,168,71",
  highlightRgb = "245,217,139",
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const context = canvasEl.getContext("2d");
    if (!context) return;
    // Explicit non-null aliases so the type survives inside nested closures.
    const canvas: HTMLCanvasElement = canvasEl;
    const ctx: CanvasRenderingContext2D = context;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0,
      h = 0;
    let particles: P[] = [];
    const mouse = { x: -9999, y: -9999 };
    let raf = 0;
    let running = true;

    function resize() {
      const parent = canvas.parentElement;
      const rect = parent ? parent.getBoundingClientRect() : { width: window.innerWidth, height: window.innerHeight };
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(150, Math.max(28, Math.floor((w * h) / density)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
      }));
    }

    function step() {
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        // cursor attraction
        const dxm = mouse.x - p.x;
        const dym = mouse.y - p.y;
        const dm2 = dxm * dxm + dym * dym;
        if (dm2 < 150 * 150) {
          const f = (1 - Math.sqrt(dm2) / 150) * 0.6;
          p.x += (dxm / Math.sqrt(dm2 || 1)) * f;
          p.y += (dym / Math.sqrt(dm2 || 1)) * f;
        }
      }

      // links
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < linkDistance * linkDistance) {
            const o = (1 - Math.sqrt(d2) / linkDistance) * 0.5;
            ctx.strokeStyle = `rgba(${colorRgb},${o})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // nodes
      for (const p of particles) {
        const near = Math.hypot(mouse.x - p.x, mouse.y - p.y) < 150;
        ctx.fillStyle = near ? `rgba(${highlightRgb},0.95)` : `rgba(${colorRgb},0.7)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, near ? 2.4 : 1.6, 0, Math.PI * 2);
        ctx.fill();
      }

      if (running && !reduce) raf = requestAnimationFrame(step);
    }

    function onMove(e: PointerEvent) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }
    function onLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }

    resize();
    step(); // at least one frame (covers reduced-motion)

    const ro = new ResizeObserver(() => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      resize();
    });
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerout", onLeave, { passive: true });

    const io = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting;
        if (running && !reduce) {
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(step);
        } else {
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerout", onLeave);
    };
  }, [density, linkDistance, colorRgb, highlightRgb]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden="true"
    />
  );
}
