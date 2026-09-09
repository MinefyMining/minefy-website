import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { MotionConfig } from "motion/react";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

// Sitewide fallback only — every route below (/mineracao, /agrofy,
// institutional pages) defines its own generateMetadata that overrides this.
// Uses the mineração namespace since that's the default world (see
// `proxy.ts` — unmatched/dev hosts fall back to mineração).
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);

  // O NextIntlClientProvider NÃO vive mais aqui: entregava o dicionário
  // INTEIRO (50KB, com a copy dos dois mundos) no payload de toda página.
  // Cada route group agora monta o próprio provider com um `pick` só dos
  // namespaces que seus Client Components realmente usam (MIKE-ARQUITETURA
  // 2.3) — Server Components seguem com getTranslations, sem provider.
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
