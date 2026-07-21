import { AgroHeader } from "@/components/agro-header";
import { AgroFooter } from "@/components/agro-footer";
import { ScrollProgress } from "@/components/scroll-progress";
import { CursorGlow } from "@/components/cursor-glow";

/**
 * Chrome for the AGROFY ecosystem — green header/footer, scroll progress and
 * cursor glow, and the film-grain overlay. Route group `(agrofy)` keeps this
 * scoped to `/agrofy` and `/agrofy/contato` without affecting URLs.
 *
 * This is a fully separate layout from `(mineracao)/layout.tsx` — it never
 * imports `MiningHeader`/`MiningFooter`, so a visitor inside `/agrofy` can
 * never see a mineração nav item or a link back to mineração pages. The only
 * place both sectors coexist is `app/[locale]/page.tsx` (the chooser at `/`),
 * which uses neither layout.
 */
export default function AgrofyLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollProgress variant="green" />
      <CursorGlow variant="green" />
      <AgroHeader />
      <main className="min-h-screen">{children}</main>
      <AgroFooter />
      <div className="grain" aria-hidden="true" />
    </>
  );
}
