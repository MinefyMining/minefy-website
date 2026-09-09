/**
 * robots.txt — MIKE-REVISAO-FINAL F3: /api/og/ LIBERADO (crawler social
 * busca og:image respeitando robots.txt) e /api/ segue bloqueado, nos
 * DOIS mundos; Allow vem antes do Disallow (precedência por
 * especificidade) e o Sitemap aponta o host certo.
 */
import { describe, expect, it } from "vitest";
import { GET } from "@/app/robots.txt/route";

async function robotsFor(host: string): Promise<string> {
  const res = GET(new Request(`http://localhost/robots.txt`, { headers: { host } }));
  return await res.text();
}

describe.each([
  { host: "www.minefymining.com", sitemap: "https://www.minefymining.com/sitemap.xml" },
  { host: "www.agrofymining.com", sitemap: "https://www.agrofymining.com/sitemap.xml" },
])("robots.txt em $host", ({ host, sitemap }) => {
  it("libera /api/og/ (Allow antes do Disallow) e mantém /api/ bloqueado", async () => {
    const body = await robotsFor(host);
    const lines = body.split("\n");
    const allowIdx = lines.indexOf("Allow: /api/og/");
    const disallowIdx = lines.indexOf("Disallow: /api/");
    expect(allowIdx).toBeGreaterThan(-1);
    expect(disallowIdx).toBeGreaterThan(-1);
    expect(allowIdx).toBeLessThan(disallowIdx);
    expect(body).toContain(`Sitemap: ${sitemap}`);
  });
});
