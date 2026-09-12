import { NextIntlClientProvider } from "next-intl";
import { MiningHeader } from "@/components/mining-header";
import { MiningFooter } from "@/components/mining-footer";
import { ScrollProgress } from "@/components/scroll-progress";
import { CursorGlow } from "@/components/cursor-glow";
import { LogoIntro } from "@/components/logo-intro";
import { SITE_ORIGIN } from "@/lib/site";
import type { Metadata } from "next";

/**
 * Chrome for the MINEFY MINING ecosystem — gold header/footer, scroll
 * progress and cursor glow, and the film-grain overlay. Route group
 * `(mineracao)` keeps this scoped to the mining-world routes without
 * affecting URLs.
 *
 * `<LogoIntro blocking landing="header" targetId="site-logo" />` plays a once-per-real-page-load,
 * opaque brand opening; the logo moves into the header before the page is revealed.
 *
 * The `NextIntlClientProvider` here delivers ONLY the namespaces this
 * world's Client Components consume (`pick` — MIKE-ARQUITETURA 2.3): the
 * Agrofy copy never reaches a mineração payload, and vice versa. Server
 * Components keep using `getTranslations` (full dictionary, server-side).
 */

// Ano do copyright é computado no SERVIDOR e congela no output estático —
// ISR de 24h garante que a virada de ano se corrige sozinha sem deploy.
export const revalidate = 86400;

/**
 * metadataBase POR ROUTE GROUP (padrão "origem por group, constante" do
 * MIKE-ARQUITETURA 1.5): resolve URLs relativas de metadata — em especial
 * o og:image da convenção `opengraph-image.tsx` — para a origem pública
 * do mundo Minefy. Canonical continua absoluto via `canonicalFor`.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN.mineracao),
};

/** Namespaces que os Client Components deste mundo realmente usam. */
const CLIENT_NAMESPACES = ["nav", "footer", "contact", "home"] as const;

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function MineracaoLayout({ children, params }: Props) {
  const { locale } = await params;
  const all = (await import(`@/messages/${locale}.json`)).default as Record<
    string,
    unknown
  >;
  const messages = Object.fromEntries(
    CLIENT_NAMESPACES.map((ns) => [ns, all[ns]]),
  );
  const year = new Date().getFullYear();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {/* Opaque opening, then a logo transition into the header reveals the page. */}
      <LogoIntro blocking landing="header" targetId="site-logo" />
      <ScrollProgress variant="gold" />
      <CursorGlow variant="gold" />
      <MiningHeader />
      <main className="min-h-screen">{children}</main>
      <MiningFooter year={year} />
      <div className="grain" aria-hidden="true" />
    </NextIntlClientProvider>
  );
}
