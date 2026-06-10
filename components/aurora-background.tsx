import { FloatingParticles } from "@/components/floating-particles";

interface AuroraBackgroundProps {
  /** Show the subtle animated grid overlay. Default: true */
  grid?: boolean;
  /** Show floating particles. Default: true */
  particles?: boolean;
  /** Extra classes for the wrapper */
  className?: string;
}

/**
 * Animated ambient background — drifting aurora blobs (gold/amber/bronze),
 * an optional masked grid and floating particles. Pure CSS animation
 * (transform/opacity only), GPU-friendly, and fully neutralized under
 * `prefers-reduced-motion` via globals.css.
 *
 * Render it as the first child of a `relative overflow-hidden` section.
 */
export function AuroraBackground({
  grid = true,
  particles = true,
  className = "",
}: AuroraBackgroundProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <div className="aurora-layer">
        <span className="aurora-blob aurora-blob--gold left-[-10%] top-[-15%] h-[55vw] w-[55vw] max-h-[680px] max-w-[680px]" />
        <span className="aurora-blob aurora-blob--amber right-[-15%] top-[10%] h-[45vw] w-[45vw] max-h-[560px] max-w-[560px]" />
        <span className="aurora-blob aurora-blob--bronze left-[25%] bottom-[-20%] h-[50vw] w-[50vw] max-h-[600px] max-w-[600px]" />
      </div>
      {grid && <div className="bg-grid" />}
      {particles && <FloatingParticles />}
    </div>
  );
}
