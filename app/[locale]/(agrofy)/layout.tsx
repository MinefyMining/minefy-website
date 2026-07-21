import { AgroHeader } from "@/components/agro-header";
import { AgroFooter } from "@/components/agro-footer";
import { ScrollProgress } from "@/components/scroll-progress";
import { CursorGlow } from "@/components/cursor-glow";
import { LogoIntro } from "@/components/logo-intro";

/**
 * Chrome for the AGROFY ecosystem — green header/footer, scroll progress and
 * cursor glow, and the film-grain overlay. Route group `(agrofy)` keeps this
 * scoped to `/agrofy` and `/agrofy/contato` without affecting URLs.
 *
 * `<LogoIntro variant="green" .../>` plays Agrofy's own once-per-session
 * fly-into-header brand intro, anchored on `AgroHeader`'s `#site-logo` — a
 * separate `sessionKey` ("agrofy-intro") keeps it fully independent from the
 * mineração intro, so visiting one world never skips the intro on the other.
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
      />
      <ScrollProgress variant="green" />
      <CursorGlow variant="green" />
      <AgroHeader />
      <main className="min-h-screen">{children}</main>
      <AgroFooter />
      <div className="grain" aria-hidden="true" />
    </>
  );
}
