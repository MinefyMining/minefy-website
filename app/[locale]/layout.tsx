import "../globals.css";
import { Inter, JetBrains_Mono } from "next/font/google";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { MotionConfig } from "motion/react";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";

// Self-hosted via next/font — eliminates the render-blocking Google Fonts
// @import and the extra network round-trip. Same families and weights as before.
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

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

/**
 * Root layout da árvore de páginas (SITE-I18N): todas as páginas vivem sob
 * `[locale]`; as demais rotas de `app/` são route handlers/convenções sem
 * layout (api, ícones, robots, sitemap). Por isso este layout é quem renderiza
 * <html> — com `lang` DINÂMICO por locale (SEO: o HTML inicial já sai no
 * idioma certo, sem flash em PT). O antigo `app/layout.tsx` com lang fixo
 * "pt-BR" foi aposentado nesta mudança.
 */
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
  return (
    <html
      lang={locale}
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Apply saved theme before paint to avoid a flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js');try{var p=new URLSearchParams(location.search).get('theme');var t=p||localStorage.getItem('minefy-theme');if(p){localStorage.setItem('minefy-theme',p)}if(t==='light'){document.documentElement.classList.add('light')}else{document.documentElement.classList.remove('light')}}catch(e){}`,
          }}
        />
      </head>
      <body className="antialiased">
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </body>
    </html>
  );
}
