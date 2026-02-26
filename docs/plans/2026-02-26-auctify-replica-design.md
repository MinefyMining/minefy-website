# Auctify Website Replica — Design Document

**Date:** 2026-02-26
**Status:** Approved
**Source:** https://www.auctify.com.br/

## Overview

Replicate the Auctify WordPress site into a Next.js 16 application with i18n support. Branding stays as Auctify initially, with a later migration to Minefy planned.

## Tech Stack

- **Framework:** Next.js 16 (App Router) + TypeScript (strict)
- **Styling:** Tailwind CSS 4 + CSS variables (dark theme)
- **UI Components:** shadcn/ui (Sheet, Button, Card, Form, Input, Textarea, Carousel)
- **i18n:** next-intl — pt-BR default (no URL prefix), other locales with prefix
- **Email:** Resend via API Routes
- **Validation:** zod (server-side form validation)
- **Images:** Next.js `<Image>` with local files in `public/images/`
- **Fonts:** Geist + Geist Mono (already configured)
- **Package manager:** pnpm only

## i18n Strategy

- All text content centralized in `messages/pt-BR.json`
- Zero hardcoded text in components
- Structure: `messages/{locale}.json` with nested keys per page
- pt-BR is default locale — no URL prefix
- Future locales get URL prefix (e.g., `/en/about-us`)

## Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Hero, solutions, product slider, client carousel, pillars, contact form |
| `/quem-somos` | About | Hero, description, mission/vision/values, pillars, CTA |
| `/solucoes` | Solutions | 4 detailed solution sections with images and feature lists |
| `/projetos` | Projects | Vargem Grande case study |
| `/contato` | Contact | Contact form (5 fields) |
| `/api/contact` | API Route | Form processing + email via Resend |

## Directory Structure

```
app/
├── [locale]/
│   ├── layout.tsx           # Layout with i18n provider
│   ├── page.tsx             # Home
│   ├── quem-somos/page.tsx
│   ├── solucoes/page.tsx
│   ├── projetos/page.tsx
│   └── contato/page.tsx
├── api/contact/route.ts
└── layout.tsx               # Root layout
components/
├── header.tsx
├── footer.tsx
├── hero-section.tsx
├── solution-card.tsx
├── pillar-card.tsx
├── client-carousel.tsx
├── contact-form.tsx
└── section-heading.tsx
messages/
├── pt-BR.json
└── en.json                  # (future)
i18n/
├── config.ts
└── request.ts
public/
└── images/
    ├── logo-transparente.png
    ├── hero/
    ├── solutions/
    ├── projects/
    ├── clients/
    └── backgrounds/
```

## Theme (CSS Variables)

```css
--background: #000000;       /* Black */
--foreground: #ffffff;        /* White */
--muted: #111111;            /* Dark sections */
--muted-foreground: #898989; /* Secondary text */
--radius: 1.875rem;          /* 30px border-radius */
--button-radius: 1.25rem;    /* 20px button radius */
```

## Page Details

### Home (`/`)

1. **Hero Section** — Full-width background image, centered H1 title, subtitle, "Saiba Mais" CTA with smooth scroll to `#solucoes`
2. **Solutions** (`#solucoes`) — 2x2 grid (desktop) / 1-col (mobile), 4 cards: icon + title + description + "Saiba Mais" link
3. **Product Slider** — Embla carousel with 3 Galileosky device images
4. **Featured Projects** — Client logo carousel (Aterpa, Coedra, Vale, SG Bras, SCL)
5. **Auctify Pillars** — 3x2 grid (desktop) / 2x3 (tablet) / 1-col (mobile), 6 pillar cards with background image
6. **Contact Form** — 5 fields (Name, Phone, Email, Subject, Message) + "Enviar" button

### Quem Somos (`/quem-somos`)

1. **Hero** — Parallax background image + H1 "A Auctify"
2. **Description** — Company overview text
3. **Mission / Vision / Values** — 3 blocks with title + text. Values as 5-item list
4. **Pillars** — Same 6 pillars (reused component)
5. **CTA** — "Saiba Mais" + "Fale Conosco" buttons

### Solucoes (`/solucoes`)

1. **Heading** — H1 "Nossas Solucoes"
2. **4 alternating sections** (image left/right) — Each: image, H3 title, description, feature list (when applicable)
3. **Final CTA** — Text + "Fale Conosco" button

### Projetos (`/projetos`)

1. **Hero** — H1 "Nossos Projetos" with background image
2. **Case Study: Vargem Grande** — Sections: Context, Telemetry, Monitoring, Safety, Efficiency, Sustainability, Impact. Interspersed images
3. **CTA** — "Fale Conosco" button

### Contato (`/contato`)

1. **Heading** — H2 "Fale Conosco" + intro text
2. **Form** — 5 fields with client-side validation + submission via API Route
3. **Feedback** — Success/error toast after submission

## Shared Components

| Component | Pages | Key Props |
|-----------|-------|-----------|
| `Header` | All | Logo, nav items (from i18n) |
| `Footer` | All | Links, contact, social (from i18n) |
| `HeroSection` | Home, About, Projects | `image`, `title`, `subtitle?`, `cta?` |
| `SolutionCard` | Home | `icon`, `title`, `description` |
| `PillarCard` | Home, About | `icon`, `title`, `description` |
| `ClientCarousel` | Home | `clients[]` (name + logo) |
| `ContactForm` | Home, Contact | `variant` (compact/full) |
| `SectionHeading` | Multiple | `title`, `subtitle?` |

## Images

All 30 images from WordPress media library downloaded to `public/images/` organized by category:
- `hero/` — Hero background images
- `solutions/` — Solution section images
- `projects/` — Project case study images
- `clients/` — Client logos (Aterpa, Coedra, Vale, SG Bras, SCL)
- `backgrounds/` — Section background images
- `products/` — Galileosky device images
- `logo-transparente.png` — Site logo

## Email (API Route)

- **Endpoint:** POST `/api/contact`
- **Validation:** zod schema for all fields
- **Service:** Resend
- **Recipient:** contact@auctify.com.br
- **Response:** JSON `{ success: boolean, message: string }`

## Contact Information

- Phone: +55 31 99776-0165
- Email: contact@auctify.com.br
- Instagram: @_auctify_
- LinkedIn: company/auctify/
- WhatsApp: +55 31 99776-0165

## Content Source

All text content extracted from WordPress site and documented in `messages/pt-BR.json`. Key sections:
- `nav` — Navigation labels
- `home` — Homepage content (hero, solutions, projects, pillars, contact)
- `about` — About page (description, mission, vision, values, pillars)
- `solutions` — Solutions page (4 solutions with feature lists)
- `projects` — Projects page (Vargem Grande case study)
- `contact` — Contact page (form labels, validation messages)
- `footer` — Footer content
- `metadata` — SEO metadata per page

## Responsive Breakpoints

Following the original site:
- Desktop: >= 1280px
- Laptop: >= 1024px
- Tablet: >= 768px
- Mobile: < 768px

## Future Work

- Rebrand from Auctify to Minefy (logo, name, colors, content)
- Add English locale (`messages/en.json`)
- Trabalhe Conosco page (careers with CV upload)
