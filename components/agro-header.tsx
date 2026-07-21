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
 * Header for the AGROFY ecosystem only (green branding, own logo). Rendered
 * by `app/[locale]/(agrofy)/layout.tsx`. Every link here stays inside the
 * Agrofy sector — no mineração nav item, no link back to `/mineracao`,
 * `/solucoes`, `/projetos` or `/quem-somos`, and no link to `/` (the
 * sector-chooser splash). See `mining-header.tsx` for the mineração
 * counterpart; the two never share nav items.
 */
export function AgroHeader() {
  const t = useTranslations("agroNav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { key: "home", href: "/agrofy" },
    { key: "solutions", href: "/agrofy#ofertas" },
    { key: "howItWorks", href: "/agrofy#como-funciona" },
    { key: "contact", href: "/agrofy/contato" },
  ] as const;

  const isActive = (href: string) => pathname === href.split("#")[0];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled ? "bg-background/95 backdrop-blur-sm border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo — Agrofy */}
        <Link href="/agrofy" className="flex shrink-0 items-center gap-2">
          <Image
            id="site-logo"
            src="/images/agro/agrofy-logo.png"
            alt="Agrofy — divisão de agronegócio da Minefy"
            width={200}
            height={200}
            priority
            className={`object-contain h-auto transition-all duration-200 ${scrolled ? "w-[38px]" : "w-[46px]"}`}
          />
        </Link>

        {/* Desktop nav — centered */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map(({ key, href }) => (
            <Link
              key={key}
              href={href}
              className={`text-[13px] font-medium tracking-wide transition-colors ${
                isActive(href)
                  ? scrolled ? "text-[#16A34A]" : "text-[#4ADE80]"
                  : scrolled
                    ? "text-muted-foreground hover:text-[#16A34A]"
                    : "text-white/70 hover:text-[#4ADE80]"
              }`}
            >
              {t(key)}
            </Link>
          ))}
        </nav>

        {/* Right side — theme toggle + Platform button + Mobile menu */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {/* Platform access — same neutral SaaS login for both sectors */}
          <a
            href="https://app.minefymining.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 bg-[#16A34A] text-white px-5 py-2 rounded-lg text-[13px] font-semibold hover:bg-[#15803D] transition-colors"
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
                <Image src="/images/agro/agrofy-logo.png" alt="Agrofy" width={200} height={200} className="w-[42px] h-auto" />
              </div>
              <nav className="mt-6 flex flex-col gap-1 flex-1">
                {navLinks.map(({ key, href }) => (
                  <Link
                    key={key}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-2 px-3 py-3 text-sm font-medium transition-colors rounded-lg ${
                      isActive(href)
                        ? "text-[#16A34A] bg-[#16A34A]/10"
                        : "text-muted-foreground hover:text-[#16A34A]"
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
                  className="flex items-center justify-center gap-2 bg-[#16A34A] text-white px-5 py-2.5 rounded-lg text-sm font-semibold"
                >
                  {t("platform")}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
