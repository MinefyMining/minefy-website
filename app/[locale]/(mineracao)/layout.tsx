import { MiningHeader } from "@/components/mining-header";
import { MiningFooter } from "@/components/mining-footer";
import { ScrollProgress } from "@/components/scroll-progress";
import { CursorGlow } from "@/components/cursor-glow";
import { LogoIntro } from "@/components/logo-intro";

/**
 * Chrome for the MINEFY MINING ecosystem — gold header/footer, scroll
 * progress and cursor glow, and the film-grain overlay. Route group
 * `(mineracao)` keeps this scoped to `/mineracao`, `/quem-somos`,
 * `/solucoes`, `/projetos` and `/contato` without affecting URLs.
 *
 * `<LogoIntro />` (gold, default props) plays the once-per-real-page-load
 * fly-into-header brand intro anchored on `MiningHeader`'s `#site-logo`.
 * `backgroundSrc` opens it directly on the same clean sunset mining photo
 * `HeroHome` uses as its own background (`hero-mineracao-bg.jpg`), so when
 * the overlay fades out the reveal is seamless — no photo swap underneath.
 *
 * Deliberately NOT applied to `app/[locale]/page.tsx` (the sector-chooser
 * splash at `/`, chromeless by design) nor to any Agrofy route — see
 * `(agrofy)/layout.tsx` for that separate ecosystem's chrome (its own green
 * `LogoIntro` instance). The two never share a layout so a mineração page
 * can never render an Agrofy nav item (or vice versa).
 */
export default function MineracaoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LogoIntro backgroundSrc="/images/home-hero/hero-mineracao-bg.jpg" />
      <ScrollProgress variant="gold" />
      <CursorGlow variant="gold" />
      <MiningHeader />
      <main className="min-h-screen">{children}</main>
      <MiningFooter />
      <div className="grain" aria-hidden="true" />
    </>
  );
}
