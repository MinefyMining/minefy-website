"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-background" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:py-7">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/images/logo-transparente.png"
            alt="Logo"
            width={120}
            height={40}
            priority
          />
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex gap-8 items-center">
          {navLinks.map(({ key, href }) => (
            <Link
              key={key}
              href={href}
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
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
                  className="text-lg font-medium text-foreground/80 hover:text-foreground transition-colors"
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
