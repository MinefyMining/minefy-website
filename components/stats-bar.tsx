"use client";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

interface StatItem {
  value: string;
  label: string;
}

function useCountUp(target: string, isVisible: boolean) {
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!isVisible) return;

    // Extract numeric portion and surrounding decoration (prefix/suffix)
    const match = target.match(/^([^0-9-]*)(-?[\d,.]+)(.*)$/);
    if (!match) {
      setDisplay(target);
      return;
    }

    const prefix = match[1];
    const rawNumber = match[2].replace(",", ".");
    const suffix = match[3];
    const numericValue = parseFloat(rawNumber);

    if (isNaN(numericValue)) {
      setDisplay(target);
      return;
    }

    const isDecimal = rawNumber.includes(".");
    const decimalPlaces = isDecimal ? (rawNumber.split(".")[1]?.length ?? 1) : 0;
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

    requestAnimationFrame(tick);
  }, [isVisible, target]);

  return display;
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
