/**
 * Pure domain→route mapping shared by `proxy.ts` (the middleware) and the
 * route-preservation tests. Extracted so the dual-world contract — mineração
 * at top-level paths, Agrofy prefixed internally, cross-world isolation —
 * can be asserted without spinning the middleware runtime.
 */

/** Which brand "world" a request belongs to — see `proxy.ts` for how the
 * production domain split resolves this. */
export type Site = "mineracao" | "agro";

/** Public origin of each world — used for canonical URLs, sitemap and
 * robots. One deployment serves both domains, so a global static
 * `metadataBase` would be wrong by construction (MIKE-ARQUITETURA 1.5). */
export const SITE_ORIGIN: Record<Site, string> = {
  mineracao: "https://www.minefymining.com",
  agro: "https://www.agrofymining.com",
};

/**
 * Single source of the host→world decision (rule R1). `agrofymining` hosts
 * are the Agrofy world; everything else — `minefymining`, previews,
 * localhost, missing header — falls back to mineração, the flagship brand.
 * Dev overrides (`?site=` / cookie) are layered on top by `proxy.ts` for
 * NON-branded hosts only; this function is the pure, testable core.
 */
export function resolveSiteFromHost(host: string | null): Site {
  if (host && host.includes("agrofymining")) return "agro";
  return "mineracao";
}

/** Whether the host carries brand information (production domains). When it
 * does, dev/preview overrides must NOT apply. */
export function isBrandedHost(host: string | null): boolean {
  return !!host && (host.includes("agrofymining") || host.includes("minefymining"));
}

/** Canonical URL for a page: PUBLIC origin + EXTERNAL path. Never feed an
 * internal (post-rewrite) pathname here — an Agrofy canonical must never
 * contain `/agrofy`. */
export function canonicalFor(site: Site, externalPath: string): string {
  return `${SITE_ORIGIN[site]}${externalPath === "/" ? "/" : externalPath}`;
}

/**
 * Maps the externally-visible pathname (what shows in the browser's address
 * bar, on either domain) onto the internal route that actually renders it.
 *
 * Mineração's sub-pages already live at bare top-level paths in the
 * `(mineracao)` route group (`/quem-somos`, `/solucoes`, `/projetos`,
 * `/contato`, `/experiencias`, `/solucoes/<serviço>`) — only its home needs
 * a rewrite, from `/` to `/mineracao` (the literal page file is
 * `(mineracao)/mineracao/page.tsx`).
 *
 * Agrofy's entire tree lives nested under `/agrofy` internally
 * (`(agrofy)/agrofy/page.tsx`, `.../agrofy/solucoes`, etc.), so on the Agrofy
 * domain every external path gets that prefix added transparently — this is
 * what lets `agrofymining.com/solucoes` render `(agrofy)/agrofy/solucoes`
 * without ever showing `/agrofy` in the address bar.
 */
export function mapPathnameForSite(site: Site, pathname: string): string {
  if (site === "mineracao") {
    if (pathname === "/") return "/mineracao";
    // Isolation guard: the Agrofy world lives under `/agrofy` internally and
    // must NOT be reachable on the mineração domain. Map any `/agrofy*`
    // request to a non-existent route so Next serves 404 — symmetric to how
    // the Agrofy branch 404s mineração-only paths by prefixing them under
    // `/agrofy` (e.g. `agrofymining.com/mineracao` → `/agrofy/mineracao` → 404).
    if (pathname === "/agrofy" || pathname.startsWith("/agrofy/")) {
      return "/mineracao-cross-world-blocked";
    }
    return pathname;
  }
  if (pathname === "/") return "/agrofy";
  if (pathname === "/agrofy" || pathname.startsWith("/agrofy/")) return pathname;
  return `/agrofy${pathname}`;
}
