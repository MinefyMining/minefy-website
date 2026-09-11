import { NextIntlClientProvider } from "next-intl";
import { AgroHeader } from "@/components/agro-header";
import { AgroFooter } from "@/components/agro-footer";
import { ScrollProgress } from "@/components/scroll-progress";
import { CursorGlow } from "@/components/cursor-glow";
import { LogoIntro } from "@/components/logo-intro";
import { SITE_ORIGIN } from "@/lib/site";
import type { Metadata } from "next";

/**
 * Chrome for the AGROFY ecosystem — green header/footer, scroll progress and
 * cursor glow, and the film-grain overlay. Route group `(agrofy)` keeps this
 * scoped to `/agrofy` and `/agrofy/contato` without affecting URLs.
 *
 * `<LogoIntro variant="green" .../>` plays Agrofy's own once-per-real-page-load
 * fly-into-header brand intro, anchored on `AgroHeader`'s `#site-logo` — a
 * separate `sessionKey` ("agrofy-intro") keeps it fully independent from the
 * mineração intro, so visiting one world never skips the intro on the other.
 * `backgroundSrc` opens it on the same clean sunset lavoura photo
 * `AgroHeroHome` uses as its own background (`hero-agrofy-bg.jpg`), so the
 * overlay fade-out reveals the identical scene underneath — no photo swap.
 *
 * This is a fully separate layout from `(mineracao)/layout.tsx` — it never
 * imports `MiningHeader`/`MiningFooter`, so a visitor inside `/agrofy` can
 * never see a mineração nav item or a link back to mineração pages. The only
 * place both sectors coexist is `app/[locale]/page.tsx` (the chooser at `/`),
 * which uses neither layout.
 */
// Ano do copyright computado no servidor; ISR de 24h corrige a virada de
// ano sem deploy (mesma regra do layout mineração).
export const revalidate = 86400;

/**
 * metadataBase POR ROUTE GROUP (padrão "origem por group, constante" do
 * MIKE-ARQUITETURA 1.5): resolve URLs relativas de metadata — em especial
 * o og:image da convenção `opengraph-image.tsx` — para a origem pública
 * do mundo Agrofy. Canonical continua absoluto via `canonicalFor`.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN.agro),
};

/** Namespaces que os Client Components do mundo agro realmente usam.
 * (`footer` entra porque `agro-footer.tsx` reusa `footer.social`/links.) */
const CLIENT_NAMESPACES = ["agroNav", "agroFooter", "footer", "agrofy", "contact"] as const;

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function AgrofyLayout({ children, params }: Props) {
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
    {/* Regra R4: `.agro-theme` aplicado UMA vez, no wrapper raiz do mundo
        agro — nenhuma página precisa (nem deve) reaplicar a classe. */}
    <div className="agro-theme">
      {/* Intro-only asset: `agrofy-logo-intro.png` re-pads the shared
          `agrofy-logo.png` to the SAME content-to-canvas fill as the Minefy
          gold logo (61.3%), so both intros are born with identical visible
          artwork size (~147px in the 240px box) and the same breathing room
          inside the generative ring. `fillCompensation` = headerFill/introFill
          (0.9112/0.6133) keeps the fly-into-header landing pixel-continuous
          with the header's uncropped `agrofy-logo.png`. */}
      <LogoIntro
        variant="green"
        logoSrc="/images/agro/agrofy-logo-intro.png"
        alt="Agrofy"
        logoWidth={1024}
        logoHeight={1024}
        sessionKey="agrofy-intro"
        fillCompensation={1.486}
        backgroundSrc="/images/home-hero/hero-agrofy-bg.jpg"
      />
      <ScrollProgress variant="green" />
      <CursorGlow variant="green" />
      <AgroHeader />
      <main className="min-h-screen">{children}</main>
      <AgroFooter year={year} />
      <div className="grain" aria-hidden="true" />
    </div>
    </NextIntlClientProvider>
  );
}
