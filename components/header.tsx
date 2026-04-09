"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Menu, ExternalLink } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";

const navLinks = [
  { key: "home", href: "/" },
  { key: "about", href: "/quem-somos" },
  { key: "solutions", href: "/solucoes" },
  { key: "projects", href: "/projetos" },
  { key: "contact", href: "/contato" },
] as const;

export function Header() {
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

  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled ? "bg-[#0A0A0A]/95 backdrop-blur-sm border-b border-[#222]" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
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
              className={`text-[13px] font-medium tracking-wide transition-colors ${
                isActive(href) ? "text-white" : "text-[#888] hover:text-white"
              }`}
            >
              {t(key)}
            </Link>
          ))}
        </nav>

        {/* Right side — Platform button + Mobile menu */}
        <div className="flex items-center gap-3">
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
              <Menu className="h-6 w-6 text-white" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-[#111] border-l border-[#222] flex flex-col">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <div className="pb-6 border-b border-[#222]">
                <Image src="/images/logo-transparente.png" alt="Minefy" width={800} height={570} className="w-[70px] h-auto" />
              </div>
              <nav className="mt-6 flex flex-col gap-1 flex-1">
                {navLinks.map(({ key, href }) => (
                  <Link
                    key={key}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`px-3 py-3 text-sm font-medium transition-colors rounded-lg ${
                      isActive(href) ? "text-white bg-[#1A1A1A]" : "text-[#888] hover:text-white"
                    }`}
                  >
                    {t(key)}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto pt-6 border-t border-[#222] space-y-3">
                <a
                  href="https://app.minefymining.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#D4A847] text-[#0A0A0A] px-5 py-2.5 rounded-lg text-sm font-semibold"
                >
                  {t("platform")}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <p className="text-xs text-[#666] text-center">{tFooter("email")}</p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
