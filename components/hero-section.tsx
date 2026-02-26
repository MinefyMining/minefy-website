import Image from "next/image";

interface HeroSectionProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
}

export function HeroSection({ imageSrc, imageAlt, title, subtitle, ctaText, ctaHref }: HeroSectionProps) {
  return (
    <section className="relative flex min-h-[60vh] md:min-h-[80vh] items-center justify-center overflow-hidden">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 text-center px-4 max-w-4xl">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg md:text-xl text-white/80 mb-8">{subtitle}</p>
        )}
        {ctaText && ctaHref && (
          <a
            href={ctaHref}
            className="inline-block rounded-[1.25rem] bg-white text-black px-8 py-3 font-medium hover:bg-white/90 transition-colors"
          >
            {ctaText}
          </a>
        )}
      </div>
    </section>
  );
}
