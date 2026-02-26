import Image from "next/image";

interface HeroSectionProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  align?: "left" | "center";
}

export function HeroSection({
  imageSrc,
  imageAlt,
  title,
  subtitle,
  ctaText,
  ctaHref,
  align = "center",
}: HeroSectionProps) {
  const isLeft = align === "left";

  return (
    <section className="relative flex min-h-[60vh] md:min-h-[80vh] items-center overflow-hidden">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/60" />
      <div
        className={`relative z-10 px-6 md:px-12 lg:px-20 max-w-3xl ${
          isLeft ? "text-left" : "text-center mx-auto"
        }`}
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-base md:text-lg text-white/70 mb-8 max-w-lg">
            {subtitle}
          </p>
        )}
        {ctaText && ctaHref && (
          <a
            href={ctaHref}
            className="inline-block rounded-full border-2 border-primary text-white px-8 py-3 font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            {ctaText}
          </a>
        )}
      </div>
    </section>
  );
}
