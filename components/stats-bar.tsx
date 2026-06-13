"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";

interface StatItem {
  value: string;
  label: string;
}

/** Parsed target: either a pure decoration string or an animatable number. */
type ParsedTarget =
  | { animatable: false }
  | {
      animatable: true;
      prefix: string;
      suffix: string;
      numericValue: number;
      isDecimal: boolean;
      decimalPlaces: number;
    };

function parseTarget(target: string): ParsedTarget {
  // Extract numeric portion and surrounding decoration (prefix/suffix)
  const match = target.match(/^([^0-9-]*)(-?[\d,.]+)(.*)$/);
  if (!match) return { animatable: false };

  const rawNumber = match[2].replace(",", ".");
  const numericValue = parseFloat(rawNumber);
  if (isNaN(numericValue)) return { animatable: false };

  const isDecimal = rawNumber.includes(".");
  return {
    animatable: true,
    prefix: match[1],
    suffix: match[3],
    numericValue,
    isDecimal,
    decimalPlaces: isDecimal ? (rawNumber.split(".")[1]?.length ?? 1) : 0,
  };
}

function useCountUp(target: string, isVisible: boolean) {
  const parsed = useMemo(() => parseTarget(target), [target]);
  // Non-animatable targets render verbatim from the first paint (derived state,
  // no effect needed). Animatable ones count up from "0" once visible.
  const [display, setDisplay] = useState(() =>
    parsed.animatable ? "0" : target
  );

  useEffect(() => {
    if (!isVisible || !parsed.animatable) return;

    const { prefix, suffix, numericValue, isDecimal, decimalPlaces } = parsed;
    const duration = 1800;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = numericValue * eased;

      const formatted = isDecimal
        ? current.toFixed(decimalPlaces)
        : Math.round(current).toString();

      setDisplay(`${prefix}${formatted}${suffix}`);

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isVisible, parsed]);

  return parsed.animatable ? display : target;
}

function StatCounter({ value, label }: StatItem) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const display = useCountUp(value, visible);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex flex-col items-center justify-center gap-1 py-6 px-4">
      <span className="text-2xl md:text-3xl font-bold text-primary tabular-nums leading-none">
        {display}
      </span>
      <span className="text-xs md:text-sm text-muted-foreground text-center leading-snug mt-1">
        {label}
      </span>
    </div>
  );
}

export function StatsBar() {
  const t = useTranslations("home");
  const items = t.raw("stats.items") as StatItem[];

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 divide-x-0 md:divide-x divide-border/40">
        {items.map((item, index) => (
          <div key={index} className="relative">
            {/* Vertical divider for mobile — after every odd item except last row */}
            {index % 2 === 0 && index < items.length - 1 && (
              <span className="md:hidden absolute right-0 top-1/4 bottom-1/4 w-px bg-border/40" />
            )}
            <StatCounter value={item.value} label={item.label} />
          </div>
        ))}
      </div>
    </div>
  );
}
