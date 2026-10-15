"use client";

import { useState, useEffect, Suspense } from "react";
import { MiningBrand } from "@/components/mining-brand";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Menu, ExternalLink } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LocaleFlags } from "@/components/locale-flags";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";

/**
 * Header for the MINEFY MINING ecosystem only (gold branding). Rendered by
 * `app/[locale]/(mineracao)/layout.tsx`. Every link here stays inside the
 * mining sector — there is deliberately no "Agrofy" item. Since the
 * sector-chooser splash was retired in favor of domain-based routing
 * (`proxy.ts` — `minefymining.com` serves this world at its root), the logo
 * and "Home" link point at `/`, not `/mineracao`.
 * See `agro-header.tsx` for the Agrofy counterpart; the two never share nav
 * items.
 *
 * Brand (WEBSITE-QA-20261011): the wordmark approved for the cinematic home
 * replaces the retired circular emblem. `MiningBrand` swaps the on-dark /
 * on-light asset by theme and by hero surface; the header top sits on a dark
 * photo by default, so it is forced dark until the page is scrolled.
 */
export function MiningHeader() {
  const t = useTranslations("nav");
  const tFooter = useTranslations("footer");
  const themeLabels = { toDark: t("themeToDark"), toLight: t("themeToLight") };
  const rawPathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const homeHref = "/";

  // Duas divisões no lugar do item único "Soluções" (CEO 2026-09-10):
  // Mineração e IA & TI são as entradas principais — ambas vivem em
  // /solucoes, ancoradas nas respectivas seções. A rota /solucoes e todas
  // as âncoras antigas continuam válidas.
  const navLinks = [
    { key: "home", href: homeHref },
    { key: "mining", href: "/solucoes#mineracao" },
    { key: "iaTi", href: "/solucoes#ia-ti" },
    { key: "about", href: "/quem-somos" },
    { key: "experiences", href: "/experiencias" },
    { key: "projects", href: "/projetos" },
    { key: "contact", href: "/contato" },
  ] as const;

  // `usePathname()` reports the INTERNAL route that actually rendered the
  // page (Next.js resolves it post-rewrite — see `proxy.ts`), which for the
  // home page is still the literal `/mineracao` file route even though `/`
  // is what shows in the address bar. Normalize that one case so "Home"
  // highlights correctly; every other mineração route is already both the
  // internal and the external path (no rewrite touches them).
  const pathname = rawPathname === "/mineracao" ? "/" : rawPathname;

  // As divisões compartilham o hub: nele nenhuma fica falsamente ativa.
  // Nas páginas de produto, destaca apenas a divisão correspondente.
  const isActive = (href: string) => {
    const digital = ["/solucoes/ia-corporativa", "/solucoes/agentes-autonomos", "/solucoes/servicos-ti"];
    if (href === "/solucoes#ia-ti") return digital.includes(pathname);
    return href === "/" ? pathname === href : pathname.startsWith(href);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled ? "bg-background/95 backdrop-blur-sm border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        {/* Logo */}
        <Link href={homeHref} className="shrink-0" aria-label={t("brandAria")}>
          <MiningBrand
            id="site-logo"
            surface={scrolled ? "theme" : "header"}
            priority
            sizes="160px"
            className={`transition-all duration-200 ${scrolled ? "w-[112px] sm:w-[136px]" : "w-[112px] sm:w-[156px]"}`}
          />
        </Link>

        {/* Desktop nav — centered */}
        <nav className="hidden xl:flex items-center gap-8">
          {navLinks.map(({ key, href }) => (
            <Link
              key={key}
              href={href}
              className={`inline-flex items-center gap-1.5 text-[13px] font-medium tracking-wide transition-colors ${
                isActive(href)
                  ? scrolled ? "text-foreground" : "text-[var(--header-fg)]"
                  : scrolled
                    ? "text-muted-foreground hover:text-foreground"
                    : "text-[var(--header-fg-muted)] hover:text-[var(--header-fg)]"
              }`}
            >
              {t(key)}
            </Link>
          ))}
        </nav>

        {/* Right side — idiomas (SITE-I18N) + theme toggle + Platform + Mobile menu */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Bandeiras de idioma SEMPRE visíveis no canto superior direito —
              inclusive no celular; a troca não fica escondida dentro do menu.
              Suspense: o componente lê useSearchParams (CSR bailout). */}
          <Suspense fallback={null}>
            <LocaleFlags />
          </Suspense>
          {/* No celular o tema vai para o menu (não cabe ao lado das bandeiras). */}
          <div className="hidden sm:block">
            <ThemeToggle labels={themeLabels} />
          </div>
          {/* Platform access — THE KEY BUTTON */}
          <a
            href="https://app.minefymining.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 bg-[#D4A847] text-[#0A0A0A] px-5 py-2 rounded-lg text-[13px] font-semibold hover:bg-[#C49B3F] transition-colors"
          >
            {t("platform")}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="xl:hidden" aria-label={t("menu")}>
              <Menu className={`h-6 w-6 ${scrolled ? "text-foreground" : "text-[var(--header-fg)]"}`} />
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-card border-l border-border flex flex-col">
              <SheetTitle className="sr-only">{t("menu")}</SheetTitle>
              <div className="pb-6 border-b border-border">
                <MiningBrand surface="theme" sizes="140px" className="w-[132px]" />
              </div>
              <nav className="mt-6 flex flex-col gap-1 flex-1">
                {navLinks.map(({ key, href }) => (
                  <Link
                    key={key}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-2 px-3 py-3 text-sm font-medium transition-colors rounded-lg ${
                      isActive(href)
                        ? "text-foreground bg-secondary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t(key)}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto pt-6 border-t border-border space-y-3">
                <div className="flex justify-center sm:hidden">
                  <ThemeToggle labels={themeLabels} />
                </div>
                <a
                  href="https://app.minefymining.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#D4A847] text-[#0A0A0A] px-5 py-2.5 rounded-lg text-sm font-semibold"
                >
                  {t("platform")}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <p className="text-xs text-muted-foreground text-center">{tFooter("email")}</p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
