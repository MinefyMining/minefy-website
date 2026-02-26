"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Phone, Mail, Instagram, Linkedin, MessageCircle } from "lucide-react";

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
            alt="Auctify Logo"
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
              <Instagram className="h-4 w-4 shrink-0" />
              Instagram
            </a>
            <a
              href={tFooter("social.linkedin")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              <Linkedin className="h-4 w-4 shrink-0" />
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
