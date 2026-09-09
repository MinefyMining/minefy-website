/**
 * Pure domain→route mapping shared by `proxy.ts` (the middleware) and the
 * route-preservation tests. Extracted so the dual-world contract — mineração
 * at top-level paths, Agrofy prefixed internally, cross-world isolation —
 * can be asserted without spinning the middleware runtime.
 */

/** Which brand "world" a request belongs to — see `proxy.ts` for how the
 * production domain split resolves this. */
export type Site = "mineracao" | "agro";

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
