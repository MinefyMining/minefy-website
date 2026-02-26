"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Menu } from "lucide-react";
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background shadow-lg" : "bg-transparent"
        }`}
    >
      {/* Main nav */}
      <div
        className={`relative mx-auto flex max-w-7xl items-center justify-between px-4 transition-all duration-300 ${scrolled ? "py-1" : "py-2"
          }`}
      >
        {/* Top bar — email, phone, social links (absolute, no layout shift) */}
        <div
          className={`absolute top-0 left-0 right-0 hidden md:flex items-center justify-end gap-6 px-4 py-1 text-xs text-muted-foreground transition-all duration-300 ${scrolled ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
        >
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
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5Zm4.25 3.25a5.25 5.25 0 1 1 0 10.5 5.25 5.25 0 0 1 0-10.5Zm0 1.5a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5Zm5.5-1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z" /></svg>
            </a>
            <a
              href={tFooter("social.linkedin")}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125ZM6.84 20.452H3.834V9H6.84v11.452Z" /></svg>
            </a>
          </div>
        </div>
        {/* Logo — shrinks on scroll */}
        <Link href="/" className={`transition-all duration-300 ${scrolled ? "" : "-mt-5"}`}>
          <Image
            src="/images/logo-transparente.png"
            alt="Logo"
            width={800}
            height={570}
            priority
            className={`object-contain transition-all duration-300 ${scrolled ? "w-[90px]" : "w-[150px]"
              } h-auto`}
          />
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex gap-8 items-center">
          {navLinks.map(({ key, href }) => (
            <Link
              key={key}
              href={href}
              className={`text-[1.2rem] font-medium transition-colors ${isActive(href)
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
                  className={`text-lg font-medium transition-colors ${isActive(href)
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
