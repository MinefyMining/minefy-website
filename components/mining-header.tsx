"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Menu, ExternalLink } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";

/**
 * Header for the MINEFY MINING ecosystem only (gold branding). Rendered by
 * `app/[locale]/(mineracao)/layout.tsx`. Every link here stays inside the
 * mining sector — there is deliberately no "Agrofy" item and no link back to
 * `/` (the sector-chooser splash). See `agro-header.tsx` for the Agrofy
 * counterpart; the two never share nav items.
 */
export function MiningHeader() {
  const t = useTranslations("nav");
  const tFooter = useTranslations("footer");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const homeHref = "/mineracao";

  const navLinks = [
    { key: "home", href: homeHref },
    { key: "about", href: "/quem-somos" },
    { key: "solutions", href: "/solucoes" },
    { key: "projects", href: "/projetos" },
    { key: "contact", href: "/contato" },
  ] as const;

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled ? "bg-background/95 backdrop-blur-sm border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href={homeHref} className="shrink-0">
          <Image
            id="site-logo"
            src="/images/logo-transparente.png"
            alt="Minefy"
            width={800}
            height={570}
            priority
            className={`object-contain h-auto transition-all duration-200 ${scrolled ? "w-[60px]" : "w-[80px]"}`}
          />
        </Link>

        {/* Desktop nav — centered */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map(({ key, href }) => (
            <Link
              key={key}
              href={href}
              className={`inline-flex items-center gap-1.5 text-[13px] font-medium tracking-wide transition-colors ${
                isActive(href)
                  ? scrolled ? "text-foreground" : "text-white"
                  : scrolled
                    ? "text-muted-foreground hover:text-foreground"
                    : "text-white/70 hover:text-white"
              }`}
            >
              {t(key)}
            </Link>
          ))}
        </nav>

        {/* Right side — theme toggle + Platform button + Mobile menu */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
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
            <SheetTrigger className="lg:hidden" aria-label="Menu">
              <Menu className={`h-6 w-6 ${scrolled ? "text-foreground" : "text-white"}`} />
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-card border-l border-border flex flex-col">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <div className="pb-6 border-b border-border">
                <Image src="/images/logo-transparente.png" alt="Minefy" width={800} height={570} className="w-[70px] h-auto" />
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
