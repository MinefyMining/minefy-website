import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ScrollReveal } from "@/components/scroll-reveal";

interface AgroTeaserProps {
  kicker: string;
  title: string;
  text: string;
  cta: string;
}

/**
 * Home-page teaser block for the Agrofy division — a compact banner (not a
 * full section) pointing to `/agrofy`. Scoped to its own green accent inline
 * (this component lives outside `.agro-theme`, since it renders on the
 * mining-branded home page) so it doesn't need any global CSS override.
 */
export function AgroTeaser({ kicker, title, text, cta }: AgroTeaserProps) {
  return (
    <section className="px-6 pb-4">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <Link
            href="/agrofy"
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#16A34A]/25 md:flex-row md:items-stretch focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A]"
          >
            <div className="relative h-48 w-full shrink-0 md:h-auto md:w-2/5">
              <Image
                src="/images/agro/aerea-talhoes-lavoura.jpg"
                alt="Vista aérea de lavoura — divisão Agrofy"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0A0A0A]/40 md:bg-gradient-to-r md:from-transparent md:via-[#0A0A0A]/10 md:to-[#0A0A0A]" aria-hidden="true" />
            </div>

            <div className="relative flex flex-1 flex-col gap-3 bg-card p-8 md:p-10">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#16A34A]/40 bg-[#16A34A]/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#4ADE80]">
                <Image src="/images/agro/agrofy-logo.png" alt="" width={64} height={64} className="h-4 w-4 shrink-0" />
                {kicker}
              </span>
              <h3 className="text-xl font-bold text-foreground md:text-2xl">{title}</h3>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                {text}
              </p>
              <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-[#4ADE80]">
                {cta}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
