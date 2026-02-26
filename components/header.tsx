"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Menu, Instagram, Linkedin } from "lucide-react";
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
    function handleScroll() {
      setScrolled(window.scrollY > 10);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background shadow-lg" : "bg-transparent"
      }`}
    >
      {/* Top bar — email, phone, social links */}
      <div
        className={`hidden md:block border-b border-border/30 transition-all duration-300 overflow-hidden ${
          scrolled ? "max-h-0 opacity-0" : "max-h-12 opacity-100"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-end gap-6 px-4 py-2 text-xs text-muted-foreground">
          <a
            href={`mailto:${tFooter("email")}`}
            className="hover:text-foreground transition-colors"
          >
            {tFooter("email")}
          </a>
          <a
            href={`tel:${tFooter("phone")}`}
            className="hover:text-foreground transition-colors"
          >
            {tFooter("phone")}
          </a>
          <div className="flex items-center gap-3">
            <a
              href={tFooter("social.instagram")}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              <Instagram className="h-3.5 w-3.5" />
            </a>
            <a
              href={tFooter("social.linkedin")}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              <Linkedin className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between px-4 transition-all duration-300 ${
          scrolled ? "py-2" : "py-0"
        }`}
      >
        {/* Logo — shrinks on scroll */}
        <Link href="/">
          <Image
            src="/images/logo-transparente.png"
            alt="Logo"
            width={709}
            height={570}
            priority
            className={`object-contain transition-all duration-300 ${
              scrolled ? "w-[75px]" : "w-[100px]"
            } h-auto`}
          />
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex gap-8 items-center">
          {navLinks.map(({ key, href }) => (
            <Link
              key={key}
              href={href}
              className={`text-sm font-medium transition-colors ${
                isActive(href)
                  ? "text-primary"
                  : "text-foreground/70 hover:text-foreground"
              }`}
            >
              {t(key)}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="md:hidden" aria-label="Open menu">
            <Menu className="h-6 w-6 text-foreground" />
          </SheetTrigger>
          <SheetContent side="right" className="bg-background">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <nav className="mt-12 flex flex-col gap-6 px-4">
              {navLinks.map(({ key, href }) => (
                <Link
                  key={key}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`text-lg font-medium transition-colors ${
                    isActive(href)
                      ? "text-primary"
                      : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {t(key)}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
