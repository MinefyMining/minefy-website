import { resolveSiteFromHost, SITE_ORIGIN } from "@/lib/site";

/** robots.txt por domínio — aponta o sitemap do host correto e bloqueia
 * apenas a API. Route Handler dinâmico pelo mesmo motivo do sitemap. */
export function GET(request: Request) {
  const site = resolveSiteFromHost(request.headers.get("host"));
  const body = [
    "User-agent: *",
    "Disallow: /api/",
    "",
    `Sitemap: ${SITE_ORIGIN[site]}/sitemap.xml`,
    "",
  ].join("\n");
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
