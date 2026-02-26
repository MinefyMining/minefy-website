# Auctify Website Replica — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replicate the Auctify WordPress site (auctify.com.br) as a Next.js 16 application with i18n, shadcn/ui, and all images stored locally.

**Architecture:** Next.js 16 App Router with `[locale]` dynamic segment for i18n via next-intl. All text in `messages/pt-BR.json`. shadcn/ui for UI primitives. Dark theme via Tailwind CSS 4 variables. Resend for contact form email delivery.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, shadcn/ui, next-intl, zod, Resend, Embla Carousel, pnpm

**Package manager:** pnpm only (never npm or yarn)

**Design doc:** `docs/plans/2026-02-26-auctify-replica-design.md`

---

## Task 1: Install dependencies and configure shadcn/ui

**Files:**
- Modify: `package.json`
- Create: `components.json` (shadcn config)
- Modify: `app/globals.css`
- Modify: `tsconfig.json`

**Step 1: Install next-intl**

Run: `pnpm add next-intl`

**Step 2: Install Resend and zod**

Run: `pnpm add resend zod`

**Step 3: Initialize shadcn/ui**

Run: `pnpm dlx shadcn@latest init`

When prompted:
- Style: New York
- Base color: Neutral
- CSS variables: Yes

This creates `components.json` and updates `globals.css` with shadcn CSS variables.

**Step 4: Install shadcn components**

Run: `pnpm dlx shadcn@latest add button card sheet input textarea form carousel`

**Step 5: Verify build**

Run: `pnpm build`
Expected: Build succeeds with no errors

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: install dependencies (next-intl, shadcn/ui, resend, zod)"
```

---

## Task 2: Download all images from WordPress

**Files:**
- Create: `public/images/logo-transparente.png`
- Create: `public/images/hero/9864-1.jpg`
- Create: `public/images/hero/2151307800-1.jpg`
- Create: `public/images/solutions/78.jpg`
- Create: `public/images/solutions/2151307800-1.jpg`
- Create: `public/images/solutions/9864-1.jpg`
- Create: `public/images/solutions/2151307759.jpg`
- Create: `public/images/products/galileosky-01.webp`
- Create: `public/images/products/galileosky-02.webp`
- Create: `public/images/products/galileosky-03.webp`
- Create: `public/images/clients/aterpa.jpg`
- Create: `public/images/clients/coedra.jpg`
- Create: `public/images/clients/vale.jpg`
- Create: `public/images/clients/sgbras.jpg`
- Create: `public/images/clients/scl.jpg`
- Create: `public/images/backgrounds/12879512-1.jpg`
- Create: `public/images/backgrounds/7946.jpg`
- Create: `public/images/backgrounds/883-1.jpg`
- Create: `public/images/projects/2151307796.jpg`
- Create: `public/images/projects/2151582401.jpg`

**Step 1: Create image directories**

```bash
mkdir -p public/images/{hero,solutions,products,clients,backgrounds,projects}
```

**Step 2: Download all images**

```bash
# Logo
curl -L -o public/images/logo-transparente.png "https://www.auctify.com.br/wp-content/uploads/2024/07/logo-transparente.png"

# Hero images
curl -L -o public/images/hero/9864-1.jpg "https://www.auctify.com.br/wp-content/uploads/2024/07/9864-1.jpg"
curl -L -o public/images/hero/2151307800-1.jpg "https://www.auctify.com.br/wp-content/uploads/2024/07/2151307800-1.jpg"

# Solution images
curl -L -o public/images/solutions/78.jpg "https://www.auctify.com.br/wp-content/uploads/2024/07/78.jpg"
curl -L -o public/images/solutions/2151307800-1.jpg "https://www.auctify.com.br/wp-content/uploads/2024/07/2151307800-1.jpg"
curl -L -o public/images/solutions/9864-1.jpg "https://www.auctify.com.br/wp-content/uploads/2024/07/9864-1.jpg"
curl -L -o public/images/solutions/2151307759.jpg "https://www.auctify.com.br/wp-content/uploads/2024/07/2151307759.jpg"

# Product images (Galileosky)
curl -L -o public/images/products/galileosky-01.webp "https://www.auctify.com.br/wp-content/uploads/2024/07/10-galileosky-10-hub-en-01-sl.png.webp"
curl -L -o public/images/products/galileosky-02.webp "https://www.auctify.com.br/wp-content/uploads/2024/07/10-galileosky-10-hub-en-02.png.webp"
curl -L -o public/images/products/galileosky-03.webp "https://www.auctify.com.br/wp-content/uploads/2024/07/10-galileosky-10-hub-en-03.png.webp"

# Client logos
curl -L -o public/images/clients/aterpa.jpg "https://www.auctify.com.br/wp-content/uploads/2024/07/aterpa.jpg"
curl -L -o public/images/clients/coedra.jpg "https://www.auctify.com.br/wp-content/uploads/2024/07/coedra2.jpg"
curl -L -o public/images/clients/vale.jpg "https://www.auctify.com.br/wp-content/uploads/2024/07/vale.jpg"
curl -L -o public/images/clients/sgbras.jpg "https://www.auctify.com.br/wp-content/uploads/2024/07/sgbras.jpg"
curl -L -o public/images/clients/scl.jpg "https://www.auctify.com.br/wp-content/uploads/2024/07/scl.jpg"

# Background images
curl -L -o public/images/backgrounds/12879512-1.jpg "https://www.auctify.com.br/wp-content/uploads/2024/07/12879512-1.jpg"
curl -L -o public/images/backgrounds/7946.jpg "https://www.auctify.com.br/wp-content/uploads/2024/07/7946.jpg"
curl -L -o public/images/backgrounds/883-1.jpg "https://www.auctify.com.br/wp-content/uploads/2024/06/883-1.jpg"

# Project images
curl -L -o public/images/projects/2151307796.jpg "https://www.auctify.com.br/wp-content/uploads/2024/07/2151307796.jpg"
curl -L -o public/images/projects/2151582401.jpg "https://www.auctify.com.br/wp-content/uploads/2024/07/2151582401.jpg"
```

**Step 3: Verify all images downloaded**

```bash
find public/images -type f | sort
```

Expected: 20 image files across 6 directories

**Step 4: Commit**

```bash
git add public/images/
git commit -m "assets: download all images from WordPress media library"
```

---

## Task 3: Configure i18n with next-intl

**Files:**
- Create: `i18n/config.ts`
- Create: `i18n/request.ts`
- Modify: `next.config.ts`
- Create: `middleware.ts`
- Create: `messages/pt-BR.json`

**Step 1: Create i18n config**

Create `i18n/config.ts`:

```typescript
export const locales = ["pt-BR"] as const;
export const defaultLocale = "pt-BR" as const;

export type Locale = (typeof locales)[number];
```

**Step 2: Create i18n request config**

Create `i18n/request.ts`:

```typescript
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as typeof routing.locales[number])) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

**Step 3: Create routing config**

Create `i18n/routing.ts`:

```typescript
import { defineRouting } from "next-intl/routing";
import { locales, defaultLocale } from "./config";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
});
```

**Step 4: Create navigation helpers**

Create `i18n/navigation.ts`:

```typescript
import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
```

**Step 5: Create middleware**

Create `middleware.ts` at project root:

```typescript
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
```

**Step 6: Update next.config.ts**

Replace `next.config.ts` contents:

```typescript
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {};

export default withNextIntl(nextConfig);
```

**Step 7: Create messages file**

Create `messages/pt-BR.json` with ALL site content (this is the big one — all text from the WordPress site):

```json
{
  "metadata": {
    "title": "Auctify - Soluções Tecnológicas para a Indústria",
    "description": "Transforme sua operação com inovações robustas e eficientes. Tablets industriais, telemetria avançada, dashboards personalizados e gestão de frota."
  },
  "nav": {
    "home": "Home",
    "about": "Quem Somos",
    "solutions": "Soluções",
    "projects": "Projetos",
    "contact": "Fale Conosco"
  },
  "home": {
    "hero": {
      "title": "Soluções Tecnológicas para a Indústria",
      "subtitle": "Transforme sua operação com inovações robustas e eficientes",
      "cta": "Saiba Mais"
    },
    "solutions": {
      "title": "Nossas Soluções",
      "items": [
        {
          "title": "Tablets Industriais",
          "description": "Oferecemos tablets robustos e duráveis, especialmente projetados para atender as demandas rigorosas das aplicações industriais."
        },
        {
          "title": "Telemetria Avançada",
          "description": "Nosso serviço de telemetria é a espinha dorsal da gestão eficiente da sua frota."
        },
        {
          "title": "Dashboards Personalizados",
          "description": "Com nossos dashboards personalizados, você tem acesso a dados críticos e insights em tempo real."
        },
        {
          "title": "Gestão Detalhada da Frota",
          "description": "Transforme a maneira como você gerencia suas operações industriais."
        }
      ],
      "cta": "Saiba Mais"
    },
    "projects": {
      "title": "Projetos em Destaque"
    },
    "pillars": {
      "sectionTitle": "Sobre nós",
      "title": "Pilares da Auctify",
      "items": [
        {
          "title": "Inovação Tecnológica",
          "description": "Tablets avançados e sistemas de telemetria de última geração para operações industriais."
        },
        {
          "title": "Expertise em Mineração",
          "description": "Soluções especializadas desenvolvidas para as demandas exigentes das operações de mineração."
        },
        {
          "title": "Segurança Operacional",
          "description": "Monitoramento de superaquecimento de freios, detecção de deslocamento de caçamba alta, alertas de basculamento não autorizado."
        },
        {
          "title": "Sustentabilidade",
          "description": "Monitoramento de emissões de CO2, otimização de combustível, minimização de desperdício operacional."
        },
        {
          "title": "Personalização e Flexibilidade",
          "description": "Dashboards personalizados para métricas específicas da operação."
        },
        {
          "title": "Suporte e Parceria",
          "description": "Serviços contínuos de suporte e consultoria."
        }
      ]
    },
    "contact": {
      "title": "Entre em contato conosco"
    }
  },
  "about": {
    "hero": {
      "title": "A Auctify"
    },
    "description": {
      "title": "Quem Somos",
      "text": "A Auctify é uma empresa líder em soluções tecnológicas para a indústria, comprometida com a inovação, a eficiência e a sustentabilidade."
    },
    "mission": {
      "title": "Missão",
      "text": "Prover soluções tecnológicas que aumentem a eficiência e a sustentabilidade das operações industriais, promovendo um ambiente de trabalho seguro e produtivo."
    },
    "vision": {
      "title": "Visão",
      "text": "Ser reconhecida globalmente como a principal fornecedora de tecnologia industrial, liderando o mercado com inovação e excelência."
    },
    "values": {
      "title": "Nossos Valores",
      "items": [
        {
          "title": "Inovação",
          "text": "Estar na vanguarda tecnológica, desenvolvendo soluções que transformam."
        },
        {
          "title": "Excelência",
          "text": "Compromisso com a qualidade e a melhoria contínua."
        },
        {
          "title": "Segurança",
          "text": "Garantir operações seguras para colaboradores e equipamentos."
        },
        {
          "title": "Sustentabilidade",
          "text": "Promover práticas que respeitem o meio ambiente e aumentem a eficiência."
        },
        {
          "title": "Parceria",
          "text": "Trabalhar junto aos nossos clientes para alcançar resultados extraordinários."
        }
      ]
    },
    "cta": {
      "learnMore": "Saiba Mais",
      "contactUs": "Fale Conosco"
    }
  },
  "solutions": {
    "hero": {
      "title": "Nossas Soluções"
    },
    "items": [
      {
        "title": "Tablets Industriais",
        "description": "A Auctify oferece tablets robustos e duráveis, especialmente projetados para atender as demandas rigorosas das aplicações industriais.",
        "features": [
          "Resistentes a choques, poeira e água",
          "Telas touchscreen de alta resolução",
          "Processadores de última geração",
          "Experiência de usuário fluida e eficiente",
          "Integração com sistemas de gestão e controle operacional"
        ],
        "image": "/images/solutions/78.jpg"
      },
      {
        "title": "Telemetria Avançada",
        "description": "Nosso serviço de telemetria é a espinha dorsal da gestão eficiente da sua frota, utilizando sensores avançados e comunicação em tempo real.",
        "safetyFeatures": [
          "Monitoramento do ponto de superaquecimento dos freios",
          "Identificação de gargalos (estreitamento de pista, acúmulo de borracha)",
          "Monitoramento de pressão de óleo",
          "Detecção de caçamba alta em deslocamento",
          "Detecção de elevação da caçamba em operação",
          "Alertas de basculamento em ponto de basculamento não autorizado"
        ],
        "operationalFeatures": [
          "Controle de ciclo de carregamento e basculamento",
          "Monitoramento de velocidade média",
          "Monitoramento de rotação do motor",
          "Consumo de diesel",
          "Horímetro digital",
          "Status e monitoramento do equipamento",
          "Rastreamento e localização do equipamento"
        ],
        "image": "/images/solutions/2151307800-1.jpg"
      },
      {
        "title": "Dashboards Personalizados",
        "description": "Com nossos dashboards personalizados, você tem acesso a dados críticos e insights em tempo real, apresentados de forma clara e intuitiva. Configure e visualize métricas específicas de acordo com as necessidades operacionais para uma tomada de decisão rápida e informada.",
        "image": "/images/solutions/9864-1.jpg"
      },
      {
        "title": "Gestão Detalhada da Frota",
        "description": "Solução completa que integra dados de telemetria e informações operacionais em uma única plataforma.",
        "benefits": [
          "Melhorar a eficiência operacional",
          "Reduzir o tempo de inatividade e custos de manutenção",
          "Aumentar a segurança dos operadores e equipamentos",
          "Promover práticas sustentáveis e reduzir a pegada de carbono"
        ],
        "image": "/images/solutions/2151307759.jpg"
      }
    ],
    "cta": {
      "text": "Transforme a maneira como você gerencia suas operações industriais com as soluções tecnológicas avançadas da Auctify. Entre em contato conosco para saber mais sobre como podemos ajudar a impulsionar a eficiência e a sustentabilidade do seu negócio.",
      "button": "Fale Conosco"
    }
  },
  "projects": {
    "hero": {
      "title": "Nossos Projetos"
    },
    "vargemGrande": {
      "title": "Projeto Vargem Grande: Revolucionando a Mineração com Tecnologia de Ponta",
      "context": {
        "title": "Contexto do Projeto",
        "text": "Iniciativa liderada pela Vale focada na descaracterização de barragens para aumentar a segurança e minimizar impactos ambientais. A Auctify fornece telemetria integrada conectada ao sistema de Gerenciamento de Recursos Móveis (GRM) da Vale."
      },
      "telemetry": {
        "title": "Telemetria Integrada ao GRM da Vale",
        "text": "Monitoramento contínuo em tempo real com melhorias de segurança (superaquecimento de freios, pressão de óleo, deslocamento de caçamba, rastreamento de elevação), eficiência operacional (controle de ciclo de carregamento, consumo de combustível) e sustentabilidade (rastreamento de emissões de CO2)."
      },
      "monitoring": {
        "title": "Monitoramento Contínuo e em Tempo Real",
        "text": "Transmissão de dados precisa e atualizada permitindo resposta rápida a anomalias."
      },
      "safety": {
        "title": "Segurança Aprimorada",
        "text": "Identifica perigos críticos incluindo superaquecimento de freios e pressões de equipamentos."
      },
      "efficiency": {
        "title": "Eficiência Operacional",
        "text": "Otimiza ciclos de carregamento/descarregamento, rotação do motor e consumo de diesel."
      },
      "sustainability": {
        "title": "Sustentabilidade",
        "text": "Monitora emissões e eficiência de combustível alinhados com objetivos ambientais."
      },
      "impact": {
        "title": "Impacto",
        "items": [
          "Maior controle e visibilidade operacional",
          "Tomada de decisão baseada em dados via dashboards personalizados",
          "Redução de riscos e segurança aprimorada dos trabalhadores"
        ]
      }
    },
    "cta": {
      "title": "Entre em contato conosco",
      "text": "Para saber mais sobre nossas soluções e como podemos ajudar sua empresa.",
      "button": "Fale Conosco"
    }
  },
  "contact": {
    "title": "Fale Conosco",
    "intro": "Estamos aqui para ajudar! Entre em contato com a Auctify e descubra como nossas soluções tecnológicas podem transformar suas operações industriais.",
    "form": {
      "name": "Nome",
      "phone": "Telefone/WhatsApp",
      "email": "E-mail",
      "subject": "Assunto",
      "message": "Mensagem",
      "submit": "Enviar",
      "sending": "Enviando...",
      "success": "Mensagem enviada com sucesso! Entraremos em contato em breve.",
      "error": "Erro ao enviar mensagem. Tente novamente."
    },
    "validation": {
      "nameRequired": "Preencha esse campo",
      "phoneRequired": "Preencha esse campo",
      "emailRequired": "Preencha esse campo",
      "emailInvalid": "Digite um endereço de e-mail válido",
      "subjectRequired": "Preencha esse campo"
    }
  },
  "footer": {
    "copyright": "Direitos reservados © Auctify 2024. Transformando operações industriais com tecnologia avançada.",
    "phone": "+55 31 99776-0165",
    "email": "contact@auctify.com.br",
    "social": {
      "instagram": "https://www.instagram.com/_auctify_",
      "linkedin": "https://www.linkedin.com/company/auctify/",
      "whatsapp": "https://api.whatsapp.com/send?phone=5531997760165"
    }
  }
}
```

**Step 8: Verify build**

Run: `pnpm build`
Expected: Build succeeds (will have warnings about missing `[locale]` layout — that's fine for now)

**Step 9: Commit**

```bash
git add i18n/ middleware.ts messages/ next.config.ts
git commit -m "feat: configure next-intl i18n with pt-BR messages"
```

---

## Task 4: Set up theme and global styles

**Files:**
- Modify: `app/globals.css`

**Step 1: Update globals.css with Auctify dark theme**

Replace `app/globals.css` with the dark theme based on the original Auctify site. The shadcn/ui init may have already added some variables — merge them with the Auctify theme colors:

- `--background: #000000` (black)
- `--foreground: #ffffff` (white)
- `--muted: #111111` (dark sections)
- `--muted-foreground: #898989` (secondary text)
- `--primary: #ffffff` (white buttons on dark bg)
- `--primary-foreground: #000000`
- `--radius: 1.875rem` (30px border-radius matching original site)
- Remove the `prefers-color-scheme: dark` media query — site is always dark
- Set `html { scroll-behavior: smooth; }` for anchor links
- Set `body { font-family: var(--font-geist-sans), sans-serif; }`

**Step 2: Verify dev server renders dark background**

Run: `pnpm dev`
Open `http://localhost:3000` — should show black background

**Step 3: Commit**

```bash
git add app/globals.css
git commit -m "style: configure Auctify dark theme with CSS variables"
```

---

## Task 5: Create root layout and locale layout

**Files:**
- Modify: `app/layout.tsx` (root layout — fonts only, no i18n)
- Create: `app/[locale]/layout.tsx` (locale layout with next-intl provider)
- Delete: `app/page.tsx` (move to `app/[locale]/page.tsx`)

**Step 1: Update root layout**

Modify `app/layout.tsx` to be a minimal root layout that only sets fonts and imports globals.css. Remove metadata (will be in locale layout). Keep `<html>` and `<body>` tags with font CSS variables.

**Step 2: Create locale layout**

Create `app/[locale]/layout.tsx`:

```typescript
import { NextIntlClientProvider, useMessages } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as typeof routing.locales[number])) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = (await import(`@/messages/${locale}.json`)).default;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
```

**Step 3: Create placeholder home page**

Create `app/[locale]/page.tsx`:

```typescript
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <h1>Auctify</h1>
      <p>Site em construção</p>
    </main>
  );
}
```

**Step 4: Delete old page.tsx**

Delete `app/page.tsx` (content moved to `app/[locale]/page.tsx`)

**Step 5: Verify build and dev server**

Run: `pnpm build`
Expected: Build succeeds

Run: `pnpm dev` and open `http://localhost:3000`
Expected: Redirects to `/pt-BR` (or shows content if locale prefix is "as-needed"), shows "Auctify" heading with dark background

**Step 6: Commit**

```bash
git add app/
git commit -m "feat: set up root layout and locale layout with next-intl"
```

---

## Task 6: Build Header component

**Files:**
- Create: `components/header.tsx`
- Modify: `app/[locale]/layout.tsx` (add Header)

**Step 1: Create Header component**

Create `components/header.tsx`:

- Fixed/sticky header with transparent background that becomes solid black on scroll
- Logo on the left (Next.js `<Image>` with `/images/logo-transparente.png`)
- Desktop nav: 5 links (Home, Quem Somos, Soluções, Projetos, Fale Conosco) — use `useTranslations("nav")`
- Mobile nav: Hamburger icon that opens shadcn `Sheet` from the right
- Use `Link` from `@/i18n/navigation` for all links
- Heights: 100px desktop, 80px sticky, 70px mobile (matching original)

**Step 2: Add Header to locale layout**

Import Header in `app/[locale]/layout.tsx` and render above `{children}`.

**Step 3: Verify in browser**

Run: `pnpm dev`
Expected: Header visible on all pages with logo + nav links. Mobile menu opens Sheet.

**Step 4: Commit**

```bash
git add components/header.tsx app/[locale]/layout.tsx
git commit -m "feat: add responsive Header with sticky nav and mobile Sheet menu"
```

---

## Task 7: Build Footer component

**Files:**
- Create: `components/footer.tsx`
- Modify: `app/[locale]/layout.tsx` (add Footer)

**Step 1: Create Footer component**

Create `components/footer.tsx`:

- Black background (#000)
- Logo
- Nav links (same 5 as header) from `useTranslations("nav")`
- Contact info: phone, email from `useTranslations("footer")`
- Social icons: Instagram, LinkedIn, WhatsApp (use inline SVG or lucide-react icons)
- Copyright text from `useTranslations("footer")`
- Responsive: stack on mobile, multi-column on desktop

**Step 2: Add Footer to locale layout**

Render Footer below `{children}` in `app/[locale]/layout.tsx`.

**Step 3: Verify in browser**

Expected: Footer with logo, links, contact, social, copyright visible on all pages.

**Step 4: Commit**

```bash
git add components/footer.tsx app/[locale]/layout.tsx
git commit -m "feat: add Footer with nav links, contact info, and social icons"
```

---

## Task 8: Build shared section components

**Files:**
- Create: `components/hero-section.tsx`
- Create: `components/section-heading.tsx`
- Create: `components/pillar-card.tsx`
- Create: `components/solution-card.tsx`

**Step 1: Create HeroSection component**

Create `components/hero-section.tsx`:

- Full-width section with background image (Next.js `<Image>` with `fill` + `object-cover`)
- Dark overlay (bg-black/60)
- Centered content: H1 title, optional subtitle, optional CTA button
- Props: `imageSrc: string`, `title: string`, `subtitle?: string`, `ctaText?: string`, `ctaHref?: string`
- Min height: 80vh on desktop, 60vh on mobile

**Step 2: Create SectionHeading component**

Create `components/section-heading.tsx`:

- Reusable H2 heading for section titles
- Props: `title: string`, `subtitle?: string`
- Centered text, white color, appropriate font sizes

**Step 3: Create PillarCard component**

Create `components/pillar-card.tsx`:

- Card with icon area + title (H4) + description
- Dark card style with subtle border or background (#111)
- Rounded corners (30px matching theme)
- Props: `title: string`, `description: string`

**Step 4: Create SolutionCard component**

Create `components/solution-card.tsx`:

- Card with title (H3) + description + "Saiba Mais" link
- Similar dark styling to PillarCard
- Props: `title: string`, `description: string`, `href?: string`, `ctaText?: string`

**Step 5: Commit**

```bash
git add components/hero-section.tsx components/section-heading.tsx components/pillar-card.tsx components/solution-card.tsx
git commit -m "feat: add shared components (HeroSection, SectionHeading, PillarCard, SolutionCard)"
```

---

## Task 9: Build ClientCarousel component

**Files:**
- Create: `components/client-carousel.tsx`

**Step 1: Create ClientCarousel component**

Create `components/client-carousel.tsx`:

- Uses shadcn Carousel (built on Embla)
- Displays 5 client logos in a horizontal carousel
- Auto-play with loop
- Shows multiple logos at once (3-4 on desktop, 2 on tablet, 1 on mobile)
- Client data: array of `{ name: string, logo: string }` — Aterpa, Coedra, Vale, SG Bras, SCL
- Each logo rendered with Next.js `<Image>`

**Step 2: Commit**

```bash
git add components/client-carousel.tsx
git commit -m "feat: add ClientCarousel with Embla autoplay for client logos"
```

---

## Task 10: Build ContactForm component

**Files:**
- Create: `components/contact-form.tsx`
- Create: `lib/contact-schema.ts`

**Step 1: Create zod validation schema**

Create `lib/contact-schema.ts`:

```typescript
import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;
```

**Step 2: Create ContactForm component**

Create `components/contact-form.tsx`:

- Client component (`"use client"`)
- Uses shadcn Form (react-hook-form + zod resolver)
- 5 fields: Nome, Telefone/WhatsApp, E-mail, Assunto, Mensagem
- All labels and validation messages from `useTranslations("contact")`
- Submit button with loading state
- POST to `/api/contact` on submit
- Success/error feedback displayed below form
- Props: `variant?: "compact" | "full"` — compact for homepage (no intro text), full for contact page

**Step 3: Commit**

```bash
git add lib/contact-schema.ts components/contact-form.tsx
git commit -m "feat: add ContactForm with zod validation and i18n labels"
```

---

## Task 11: Build Home page

**Files:**
- Modify: `app/[locale]/page.tsx`

**Step 1: Build complete Home page**

Replace the placeholder `app/[locale]/page.tsx` with the full home page using all components:

1. **HeroSection** — background: `/images/hero/9864-1.jpg`, title/subtitle/CTA from `home.hero`
2. **Solutions section** — `id="solucoes"`, SectionHeading with `home.solutions.title`, 2x2 grid of SolutionCard from `home.solutions.items`
3. **Product images** — 3 Galileosky device images in a row or carousel
4. **ClientCarousel** — SectionHeading with `home.projects.title`, carousel with 5 logos
5. **Pillars section** — Background image `/images/backgrounds/12879512-1.jpg`, SectionHeading with `home.pillars.title`, 3x2 grid of PillarCard from `home.pillars.items`
6. **Contact section** — SectionHeading with `home.contact.title`, ContactForm variant="compact"

Use `useTranslations("home")` for all text.

**Step 2: Verify in browser**

Run: `pnpm dev` and check `http://localhost:3000`
Expected: Full home page with all 6 sections, responsive layout, dark theme

**Step 3: Commit**

```bash
git add app/[locale]/page.tsx
git commit -m "feat: build complete Home page with all sections"
```

---

## Task 12: Build Quem Somos page

**Files:**
- Create: `app/[locale]/quem-somos/page.tsx`

**Step 1: Build About page**

Create `app/[locale]/quem-somos/page.tsx`:

1. **HeroSection** — background: `/images/backgrounds/7946.jpg`, title from `about.hero.title`, parallax effect (CSS `background-attachment: fixed`)
2. **Description** — H2 `about.description.title` + paragraph `about.description.text`
3. **Mission** — H3 `about.mission.title` + text
4. **Vision** — H3 `about.vision.title` + text
5. **Values** — H3 `about.values.title` + list of 5 values from `about.values.items`
6. **Pillars** — Reuse same pillar grid from home (same data from `home.pillars`)
7. **CTA** — Two buttons: "Saiba Mais" + "Fale Conosco"

Use `useTranslations("about")` and `useTranslations("home")` (for shared pillars).

**Step 2: Verify in browser**

Navigate to `/quem-somos`
Expected: Full about page with all sections

**Step 3: Commit**

```bash
git add app/[locale]/quem-somos/
git commit -m "feat: build Quem Somos (About) page"
```

---

## Task 13: Build Solucoes page

**Files:**
- Create: `app/[locale]/solucoes/page.tsx`

**Step 1: Build Solutions page**

Create `app/[locale]/solucoes/page.tsx`:

1. **Heading** — H1 from `solutions.hero.title`
2. **4 alternating sections** — For each solution in `solutions.items`:
   - Image on left (even index) or right (odd index) — Next.js `<Image>` with the solution's `image` path
   - H3 title + description paragraph
   - Feature list (ul/li) if solution has `features`, `safetyFeatures`, `operationalFeatures`, or `benefits`
   - Full width on mobile, side-by-side on desktop
3. **CTA section** — Text from `solutions.cta.text` + button `solutions.cta.button` linking to `/contato`

Use `useTranslations("solutions")`.

**Step 2: Verify in browser**

Navigate to `/solucoes`
Expected: 4 solution sections with alternating image layout

**Step 3: Commit**

```bash
git add app/[locale]/solucoes/
git commit -m "feat: build Soluções (Solutions) page with alternating layout"
```

---

## Task 14: Build Projetos page

**Files:**
- Create: `app/[locale]/projetos/page.tsx`

**Step 1: Build Projects page**

Create `app/[locale]/projetos/page.tsx`:

1. **HeroSection** — background: `/images/backgrounds/883-1.jpg`, title from `projects.hero.title`
2. **Case Study title** — H2 from `projects.vargemGrande.title`
3. **Sections** — Each subsection of the Vargem Grande case study:
   - Context (`projects.vargemGrande.context`)
   - Telemetry (`projects.vargemGrande.telemetry`)
   - Monitoring (`projects.vargemGrande.monitoring`)
   - Safety (`projects.vargemGrande.safety`)
   - Efficiency (`projects.vargemGrande.efficiency`)
   - Sustainability (`projects.vargemGrande.sustainability`)
   - Impact (`projects.vargemGrande.impact`) — with bullet list
   - Intersperse with project images from `/images/projects/`
4. **CTA** — Title + text + "Fale Conosco" button from `projects.cta`

Use `useTranslations("projects")`.

**Step 2: Verify in browser**

Navigate to `/projetos`
Expected: Full case study page with interspersed images

**Step 3: Commit**

```bash
git add app/[locale]/projetos/
git commit -m "feat: build Projetos (Projects) page with Vargem Grande case study"
```

---

## Task 15: Build Contato page

**Files:**
- Create: `app/[locale]/contato/page.tsx`

**Step 1: Build Contact page**

Create `app/[locale]/contato/page.tsx`:

1. **Heading** — H2 from `contact.title`
2. **Intro text** — Paragraph from `contact.intro`
3. **ContactForm** — `variant="full"` (same component used on home, but full variant)

Use `useTranslations("contact")`.

**Step 2: Verify in browser**

Navigate to `/contato`
Expected: Contact page with heading, intro text, and full form

**Step 3: Commit**

```bash
git add app/[locale]/contato/
git commit -m "feat: build Contato (Contact) page"
```

---

## Task 16: Build Contact API Route

**Files:**
- Create: `app/api/contact/route.ts`

**Step 1: Create API Route**

Create `app/api/contact/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/lib/contact-schema";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = contactSchema.parse(body);

    await resend.emails.send({
      from: "Auctify Website <onboarding@resend.dev>",
      to: "contact@auctify.com.br",
      subject: `[Website] ${data.subject}`,
      html: `
        <h2>Nova mensagem do site</h2>
        <p><strong>Nome:</strong> ${data.name}</p>
        <p><strong>Telefone:</strong> ${data.phone}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Assunto:</strong> ${data.subject}</p>
        <p><strong>Mensagem:</strong> ${data.message || "N/A"}</p>
      `,
    });

    return NextResponse.json({ success: true, message: "Email sent" });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { success: false, message: "Validation error" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Failed to send email" },
      { status: 500 }
    );
  }
}
```

**Step 2: Create .env.local template**

Create `.env.local` (add to .gitignore if not already):

```
RESEND_API_KEY=re_your_api_key_here
```

**Step 3: Verify build**

Run: `pnpm build`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add app/api/contact/route.ts
git commit -m "feat: add contact form API route with Resend email integration"
```

---

## Task 17: Add SEO metadata to all pages

**Files:**
- Modify: `app/[locale]/page.tsx`
- Modify: `app/[locale]/quem-somos/page.tsx`
- Modify: `app/[locale]/solucoes/page.tsx`
- Modify: `app/[locale]/projetos/page.tsx`
- Modify: `app/[locale]/contato/page.tsx`

**Step 1: Add generateMetadata to each page**

Each page file should export a `generateMetadata` function that uses `getTranslations` to set page-specific title and description.

Update `messages/pt-BR.json` to add page-specific metadata under each section if not already present:

```json
{
  "about": {
    "metadata": { "title": "Quem Somos - Auctify", "description": "Conheça a Auctify..." },
    ...
  },
  "solutions": {
    "metadata": { "title": "Soluções - Auctify", "description": "Nossas soluções tecnológicas..." },
    ...
  },
  "projects": {
    "metadata": { "title": "Projetos - Auctify", "description": "Conheça nossos projetos..." },
    ...
  },
  "contact": {
    "metadata": { "title": "Contato - Auctify", "description": "Entre em contato..." },
    ...
  }
}
```

**Step 2: Verify metadata**

Run: `pnpm dev`, inspect page `<title>` tags with browser dev tools for each route.

**Step 3: Commit**

```bash
git add app/ messages/
git commit -m "feat: add SEO metadata to all pages via next-intl"
```

---

## Task 18: Final build verification and cleanup

**Files:**
- Possibly modify various files for build fixes

**Step 1: Run full build**

Run: `pnpm build`
Expected: Build succeeds with no errors

**Step 2: Run linter**

Run: `pnpm lint`
Fix any linting errors found.

**Step 3: Test all routes in dev mode**

Run: `pnpm dev` and verify each page:
- `/` — Home with all 6 sections
- `/quem-somos` — About with hero, mission/vision/values, pillars
- `/solucoes` — Solutions with 4 alternating sections
- `/projetos` — Projects with Vargem Grande case study
- `/contato` — Contact with form

Verify:
- Header visible and responsive on all pages
- Footer visible on all pages
- Mobile menu works (Sheet opens/closes)
- Client carousel auto-plays
- Contact form validates and shows feedback
- All images load correctly
- Dark theme consistent across all pages
- Smooth scroll works on home page CTA

**Step 4: Remove default Next.js assets**

Delete unused files from public/:
- `public/next.svg`
- `public/vercel.svg`
- `public/file.svg`
- `public/globe.svg`
- `public/window.svg`

**Step 5: Final commit**

```bash
git add -A
git commit -m "chore: final cleanup and build verification"
```

---

## Summary

| Task | Description | Key files |
|------|-------------|-----------|
| 1 | Install deps + shadcn/ui | package.json, components.json |
| 2 | Download images | public/images/ |
| 3 | Configure i18n | i18n/, middleware.ts, messages/pt-BR.json |
| 4 | Theme + global styles | app/globals.css |
| 5 | Root + locale layouts | app/layout.tsx, app/[locale]/layout.tsx |
| 6 | Header component | components/header.tsx |
| 7 | Footer component | components/footer.tsx |
| 8 | Shared section components | components/hero-section.tsx, etc. |
| 9 | Client carousel | components/client-carousel.tsx |
| 10 | Contact form + schema | components/contact-form.tsx, lib/contact-schema.ts |
| 11 | Home page | app/[locale]/page.tsx |
| 12 | Quem Somos page | app/[locale]/quem-somos/page.tsx |
| 13 | Soluções page | app/[locale]/solucoes/page.tsx |
| 14 | Projetos page | app/[locale]/projetos/page.tsx |
| 15 | Contato page | app/[locale]/contato/page.tsx |
| 16 | Contact API route | app/api/contact/route.ts |
| 17 | SEO metadata | all page files + messages |
| 18 | Build verification + cleanup | various |

**Dependencies:** Tasks 1-5 must run sequentially. Tasks 6-10 can run in parallel after Task 5. Tasks 11-16 depend on Tasks 6-10. Task 17 depends on Tasks 11-15. Task 18 is last.
