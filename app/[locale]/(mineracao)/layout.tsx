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
 * `<LogoIntro blocking={false} />` plays a once-per-real-page-load,
 * NON-BLOCKING brand signature anchored on `MiningHeader`'s `#site-logo` —
 * the page renders and stays interactive underneath from the first frame.
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
      {/* Non-blocking brand signature (P1 fix 2026-09-09): content is visible
          and clickable from the first frame — no opaque cover, no scroll
          lock, shorter beat. Agrofy keeps its own (blocking) instance. */}
      <LogoIntro blocking={false} />
      <ScrollProgress variant="gold" />
      <CursorGlow variant="gold" />
      <MiningHeader />
      <main className="min-h-screen">{children}</main>
      <MiningFooter />
      <div className="grain" aria-hidden="true" />
    </>
  );
}
