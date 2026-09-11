import type { ReactNode } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface Scene {
  num: string;
  label: string;
  tagline: string;
  cta: string;
}

interface HeroStageProps {
  badge: string;
  title: ReactNode;
  subtitle: string;
  scroller: Scene;
  ia: Scene;
  scrollerImageAlt: string;
  scrollerMediaNote: string;
}

/** The opening presents mining only; AI has its own dedicated chapter below. */
export function HeroStage({
  badge,
  title,
  subtitle,
  scroller,
  scrollerImageAlt,
  scrollerMediaNote,
}: HeroStageProps) {
  return (
    <section className="bg-[#08080A] pb-12 pt-28 text-white lg:pt-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <div className="grid gap-6 pb-10 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-16 lg:pb-14">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#E8C877]">{badge}</p>
            <h1 className="mt-5 max-w-3xl text-[clamp(2rem,4.3vw,4rem)] font-semibold leading-[1.08] tracking-[-0.04em]">{title}</h1>
          </div>
          <p className="max-w-lg text-base leading-relaxed text-white/60 lg:pb-1 lg:text-lg">{subtitle}</p>
        </div>
      </div>
        <figure>
          <div className="relative isolate w-full overflow-hidden bg-[#08080A]">
            <Image
              src="/images/premium/scroller-cinematic.jpg"
              alt={scrollerImageAlt}
              width={1672}
              height={941}
              priority
              sizes="100vw"
              className="h-auto w-full"
            />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(to right, #08080A 0%, #08080A80 5%, transparent 19%, transparent 81%, #08080A80 95%, #08080A 100%)" }} />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(to bottom, #08080A 0%, #08080A70 7%, transparent 24%, transparent 72%, #08080A90 91%, #08080A 100%)" }} />
          </div>
          <figcaption className="mx-auto mt-3 max-w-7xl px-5 text-right sm:px-6 font-mono text-[9px] uppercase tracking-[0.16em] text-white/40">{scrollerMediaNote}</figcaption>
        </figure>
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <div className="mt-5 grid gap-6 border-b border-white/10 pb-10 md:grid-cols-[1fr_1.4fr_auto] md:items-center md:gap-10">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#E8C877]">{scroller.num} · {scroller.label}</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Scroller</h2>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-white/65 sm:text-base">{scroller.tagline}</p>
          <a href="#mineracao" className="inline-flex w-fit items-center gap-3 rounded-lg border border-[#D4AF37]/40 px-5 py-3.5 text-sm font-semibold text-[#E8C877] transition-colors hover:bg-[#D4AF37]/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37]">{scroller.cta}<ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  );
}
