import type { ComponentType } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Mail, Phone, MessageCircle, MapPin } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { ScrollReveal } from "@/components/scroll-reveal";
import { AuroraBackground } from "@/components/aurora-background";

type Props = { params: Promise<{ locale: string }> };

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  mail: Mail,
  phone: Phone,
  whatsapp: MessageCircle,
  location: MapPin,
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "agrofy.contactPage.metadata" });
  return { title: t("title"), description: t("description") };
}

/**
 * Agrofy's own contact page — reuses the shared `ContactForm` component
 * (same fields/validation as the mineração contact page) but with the green
 * Agrofy accent and copy, and posts with `division="agrofy"` so the
 * notification email is labeled by origin. Rendered under `(agrofy)/layout`
 * (green header/footer) — never shares chrome with `/contato` (mineração).
 */
export default async function AgrofyContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("agrofy.contactPage");
  const tContact = await getTranslations("contact");

  const infoItems = tContact.raw("info.items") as Array<{
    icon: string;
    label: string;
    value: string;
    href: string;
  }>;

  return (
    <div className="agro-theme min-h-screen bg-background">
      {/* ── Hero with agro photo ── */}
      <section className="relative min-h-[45vh] flex items-end overflow-hidden">
        <Image
          src="/images/agro/pulverizador-autopropelido.jpg"
          alt="Pulverizador autopropelido de grande porte em operação — divisão Agrofy"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/50 to-transparent" />
        <AuroraBackground grid={false} particles={false} className="opacity-45" />
        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 pb-12 pt-32 flex items-center gap-4">
          <Image
            src="/images/agro/agrofy-logo.png"
            alt="Agrofy — divisão de agronegócio da Minefy"
            width={200}
            height={200}
            priority
            className="h-12 w-12 drop-shadow-[0_6px_24px_rgba(0,0,0,0.55)] sm:h-14 sm:w-14"
          />
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
              <h2 className="text-2xl font-bold text-foreground mb-3">
                {t("title")}
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={80}>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                {t("intro")}
              </p>
            </ScrollReveal>

            <div className="space-y-3">
              {infoItems.map((item, index) => {
                const Icon = iconMap[item.icon] ?? Mail;

                const card = (
                  <div className="bg-card p-4 rounded-lg border border-border flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-[#16A34A]" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                        {item.label}
                      </p>
                      <p className="text-sm font-medium text-foreground">
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
            <div className="bg-card rounded-xl p-8 border border-border">
              <ContactForm variant="full" division="agrofy" />
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
