import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import {
  isBrandedHost,
  mapPathnameForSite,
  resolveSiteFromHost,
  staticHomeFor,
  type Site,
} from "./lib/site";

const handleI18nRouting = createMiddleware(routing);

/**
 * Which brand "world" a request belongs to. Production traffic is split by
 * DOMAIN — no more in-app sector-chooser splash (removed 2026-07-23):
 *   - `agrofymining.com` → the Agrofy (agronegócio) world, green identity
 *   - `minefymining.com` (or anything unrecognized) → the Minefy (mineração)
 *     world, gold identity — mineração is the default/flagship brand
 */
/** Dev/preview cookie name — lets a non-branded host (localhost, a Vercel
 *  preview URL, etc.) "pin" which world to render across a session. */
const SITE_COOKIE = "mf-site";

function resolveSite(request: NextRequest): Site {
  // `request.headers.get("host")` (the literal incoming `Host` header, or
  // `x-forwarded-host` behind a proxy) is used instead of
  // `request.nextUrl.hostname` — the latter reflects the URL Next itself
  // resolved the request against, which in some deployments (self-hosted
  // behind a reverse proxy, or `next start` bound to a fixed local address)
  // does NOT pick up the actual requested domain, silently defaulting every
  // host to the fallback branch below. The raw header is what's actually
  // sent by the browser/CDN for the domain being visited.
  const host = request.headers.get("host") ?? request.nextUrl.hostname;
  if (isBrandedHost(host)) return resolveSiteFromHost(host);

  // Local/dev/preview hosts don't carry brand information in the hostname —
  // allow previewing either world via `?site=agro` / `?site=mineracao`. See
  // the query-override handling below for how this gets persisted.
  const queryOverride = request.nextUrl.searchParams.get("site");
  if (queryOverride === "agro" || queryOverride === "mineracao") return queryOverride;

  const cookieOverride = request.cookies.get(SITE_COOKIE)?.value;
  if (cookieOverride === "agro" || cookieOverride === "mineracao") return cookieOverride;

  return "mineracao";
}

export default async function proxy(request: NextRequest) {
  const site = resolveSite(request);
  const externalPathname = request.nextUrl.pathname;

  // Static home (CEO 2026-10-09): on the mineração world `/` serves the
  // self-contained cinematic experience from `public/home.html`. Rewrite
  // (never redirect) so the address bar stays `/`; next-intl is skipped —
  // the static page carries its own `lang`, metadata and canonical.
  // Agrofy (`staticHomeFor` → null) keeps its Next.js home untouched.
  const staticHome = staticHomeFor(site, externalPathname);
  if (staticHome) {
    return NextResponse.rewrite(new URL(staticHome, request.url));
  }

  const internalPathname = mapPathnameForSite(site, externalPathname);

  // Rewrite the request's own pathname BEFORE handing off to next-intl's
  // middleware, so its locale-prefixing logic operates on the already-mapped
  // internal route. This is next-intl's documented pattern for composing
  // custom rewrites ahead of `handleI18nRouting` (mutate `request.nextUrl`
  // in place, then call it) — see https://next-intl.dev/docs/routing/middleware.
  if (internalPathname !== externalPathname) {
    request.nextUrl.pathname = internalPathname;
  }

  const response = handleI18nRouting(request);

  // SEO: paths internos não devem competir com os públicos (`/agrofy/*` ≡
  // `/*` no agro). `/mineracao` segue noindex: desde 2026-10-10 ele serve a
  // home corporativa ANTERIOR (link "Website institucional" da nova home
  // estática) — conteúdo legado, alcançável mas não indexável.
  // Decisão de arquitetura: noindex declarativo, NUNCA redirect aqui.
  if (
    (site === "mineracao" && externalPathname === "/mineracao") ||
    (site === "agro" &&
      (externalPathname === "/agrofy" || externalPathname.startsWith("/agrofy/")))
  ) {
    response.headers.set("X-Robots-Tag", "noindex, follow");
  }

  // Persist a `?site=` dev/preview override in a cookie: client-side
  // navigations after the first load don't repeat the query string, so
  // without this the second click would silently fall back to mineração.
  const queryOverride = request.nextUrl.searchParams.get("site");
  const host = request.headers.get("host") ?? request.nextUrl.hostname;
  if (
    (queryOverride === "agro" || queryOverride === "mineracao") &&
    !host.includes("agrofymining") &&
    !host.includes("minefymining")
  ) {
    response.cookies.set(SITE_COOKIE, queryOverride, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
