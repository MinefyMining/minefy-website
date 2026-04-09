import type { ComponentType } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Mail, Phone, MessageCircle, MapPin } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { ScrollReveal } from "@/components/scroll-reveal";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact.metadata" });
  return { title: t("title"), description: t("description") };
}

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  mail: Mail,
  phone: Phone,
  whatsapp: MessageCircle,
  location: MapPin,
};

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  const infoItems = t.raw("info.items") as Array<{
    icon: string;
    label: string;
    value: string;
    href: string;
  }>;

  return (
    <div className="min-h-screen bg-[#0A0A0A]">

      {/* ── Hero with mine photo ── */}
      <section className="relative min-h-[45vh] flex items-end overflow-hidden">
        <Image
          src="/images/mining/mine-mountain-view.jpg"
          alt="Vista panorâmica de mina a céu aberto"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/50 to-transparent" />
        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 pb-12 pt-32">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            {t("hero.title")}
          </h1>
        </div>
      </section>

      {/* ── Contact Section ── */}
      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Left: info */}
          <div>
            <ScrollReveal>
              <h2 className="text-2xl font-bold text-white mb-3">
                {t("title")}
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={80}>
              <p className="text-[#888] mb-8 leading-relaxed">
                {t("intro")}
              </p>
            </ScrollReveal>

            <div className="space-y-3">
              {infoItems.map((item, index) => {
                const Icon = iconMap[item.icon] ?? Mail;

                const card = (
                  <div className="bg-[#111] p-4 rounded-lg border border-[#222] flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-[#D4A847]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#888] uppercase tracking-wider mb-0.5">
                        {item.label}
                      </p>
                      <p className="text-sm font-medium text-white">
                        {item.value}
                      </p>
                    </div>
                  </div>
                );

                return (
                  <ScrollReveal key={item.label} delay={100 + index * 60}>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="block hover:opacity-80 transition-opacity duration-200"
                      >
                        {card}
                      </a>
                    ) : (
                      card
                    )}
                  </ScrollReveal>
                );
              })}
            </div>
          </div>

          {/* Right: form */}
          <ScrollReveal delay={150}>
            <div className="bg-[#111] rounded-xl p-8 border border-[#222]">
              <ContactForm variant="full" />
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
