import { MiningHeader } from "@/components/mining-header";
import { MiningFooter } from "@/components/mining-footer";
import { ScrollProgress } from "@/components/scroll-progress";
import { CursorGlow } from "@/components/cursor-glow";

/**
 * Chrome for the MINEFY MINING ecosystem — gold header/footer, scroll
 * progress and cursor glow, and the film-grain overlay. Route group
 * `(mineracao)` keeps this scoped to `/mineracao`, `/quem-somos`,
 * `/solucoes`, `/projetos` and `/contato` without affecting URLs.
 *
 * Deliberately NOT applied to `app/[locale]/page.tsx` (the sector-chooser
 * splash at `/`, chromeless by design) nor to any Agrofy route — see
 * `(agrofy)/layout.tsx` for that separate ecosystem's chrome. The two never
 * share a layout so a mineração page can never render an Agrofy nav item
 * (or vice versa).
 */
export default function MineracaoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollProgress variant="gold" />
      <CursorGlow variant="gold" />
      <MiningHeader />
      <main className="min-h-screen">{children}</main>
      <MiningFooter />
      <div className="grain" aria-hidden="true" />
    </>
  );
}
