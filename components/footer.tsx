"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Phone, Mail, MessageCircle } from "lucide-react";

const navLinks = [
  { key: "home", href: "/" },
  { key: "about", href: "/quem-somos" },
  { key: "solutions", href: "/solucoes" },
  { key: "projects", href: "/projetos" },
  { key: "contact", href: "/contato" },
] as const;

export function Footer() {
  const tFooter = useTranslations("footer");
  const tNav = useTranslations("nav");

  return (
    <footer className="bg-background border-t border-border py-12 px-4 md:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {/* Column 1 - Logo + Copyright */}
        <div className="flex flex-col gap-4">
          <Image
            src="/images/logo-transparente.png"
            alt="Minefy Logo"
            width={100}
            height={33}
          />
          <p className="text-sm text-muted-foreground">
            {tFooter("copyright")}
          </p>
        </div>

        {/* Column 2 - Navigation */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
            Menu
          </h3>
          <nav className="flex flex-col gap-2">
            {navLinks.map(({ key, href }) => (
              <Link
                key={key}
                href={href}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                {tNav(key)}
              </Link>
            ))}
          </nav>
        </div>

        {/* Column 3 - Contact Info */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
            Contato
          </h3>
          <div className="flex flex-col gap-3">
            <a
              href={`tel:${tFooter("phone").replace(/\s/g, "")}`}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              <Phone className="h-4 w-4 shrink-0" />
              {tFooter("phone")}
            </a>
            <a
              href={`mailto:${tFooter("email")}`}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              <Mail className="h-4 w-4 shrink-0" />
              {tFooter("email")}
            </a>
          </div>
        </div>

        {/* Column 4 - Social Media */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
            Social
          </h3>
          <div className="flex flex-col gap-3">
            <a
              href={tFooter("social.instagram")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5Zm4.25 3.25a5.25 5.25 0 1 1 0 10.5 5.25 5.25 0 0 1 0-10.5Zm0 1.5a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5Zm5.5-1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z"/></svg>
              Instagram
            </a>
            <a
              href={tFooter("social.linkedin")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125ZM6.84 20.452H3.834V9H6.84v11.452Z"/></svg>
              LinkedIn
            </a>
            <a
              href={tFooter("social.whatsapp")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              <MessageCircle className="h-4 w-4 shrink-0" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="text-center text-sm text-muted-foreground mt-8 pt-8 border-t border-border max-w-7xl mx-auto">
        {tFooter("copyright")}
      </div>
    </footer>
  );
}
