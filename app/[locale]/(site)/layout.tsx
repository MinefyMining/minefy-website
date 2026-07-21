import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ScrollProgress } from "@/components/scroll-progress";
import { CursorGlow } from "@/components/cursor-glow";

/**
 * Chrome shared by every "inside a sector" page (Mineração + Agrofy +
 * institutional pages) — header, footer, scroll progress, cursor glow and
 * the film-grain overlay. Deliberately NOT applied to `app/[locale]/page.tsx`
 * (the sector-chooser splash at `/`), which is full-bleed and chromeless by
 * design. Route group `(site)` keeps this scoped without affecting URLs.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollProgress />
      <CursorGlow />
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <div className="grain" aria-hidden="true" />
    </>
  );
}
