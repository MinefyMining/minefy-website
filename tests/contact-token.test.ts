import { afterEach, describe, expect, it } from "vitest";
import { issueContactToken, verifyContactToken } from "@/lib/contact-token";

const KEY = "segredo-de-teste-nunca-real";

afterEach(() => {
  delete process.env.CONTACT_TOKEN_SECRET;
});

describe("nonce HMAC stateless (MIKE-ARQUITETURA 5.3)", () => {
  it("sem CONTACT_TOKEN_SECRET: emissão devolve null e verificação é 'unconfigured' (fail-open)", () => {
    expect(issueContactToken()).toBeNull();
    expect(verifyContactToken("qualquer.coisa")).toBe("unconfigured");
  });

  it("token emitido é válido dentro da janela 3s..30min", () => {
    process.env.CONTACT_TOKEN_SECRET = KEY;
    const issued = Date.now() - 10_000;
    const token = issueContactToken(issued)!;
    expect(verifyContactToken(token, issued + 10_000)).toBe("valid");
  });

  it("rejeita token novo demais (<3s) e velho demais (>30min)", () => {
    process.env.CONTACT_TOKEN_SECRET = KEY;
    const now = Date.now();
    const token = issueContactToken(now)!;
    expect(verifyContactToken(token, now + 1_000)).toBe("invalid");
    expect(verifyContactToken(token, now + 31 * 60_000)).toBe("invalid");
  });

  it("rejeita assinatura adulterada e formato quebrado", () => {
    process.env.CONTACT_TOKEN_SECRET = KEY;
    const now = Date.now() - 10_000;
    const token = issueContactToken(now)!;
    expect(verifyContactToken(token.slice(0, -2) + "zz", now + 10_000)).toBe("invalid");
    expect(verifyContactToken("sem-ponto", now)).toBe("invalid");
    expect(verifyContactToken(undefined, now)).toBe("invalid");
  });
});

describe("GET /api/contact-token (emissão client-side — página é ISR)", () => {
  it("sem secret → { token: null } e Cache-Control: no-store", async () => {
    delete process.env.CONTACT_TOKEN_SECRET;
    const { GET } = await import("@/app/api/contact-token/route");
    const res = await GET();
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect((await res.json()).token).toBeNull();
  });

  it("com secret → token emitido verifica como válido após a idade mínima", async () => {
    process.env.CONTACT_TOKEN_SECRET = "segredo-de-teste-nunca-real";
    const { GET } = await import("@/app/api/contact-token/route");
    const { verifyContactToken } = await import("@/lib/contact-token");
    const { token } = (await (await GET()).json()) as { token: string };
    expect(token).toBeTruthy();
    expect(verifyContactToken(token, Date.now() + 5_000)).toBe("valid");
    delete process.env.CONTACT_TOKEN_SECRET;
  });
});

describe("tokenIssuedAt (helper client-safe)", () => {
  it("lê o issuedAt do token e rejeita formato quebrado", async () => {
    process.env.CONTACT_TOKEN_SECRET = "segredo-de-teste-nunca-real";
    const { issueContactToken } = await import("@/lib/contact-token");
    const { tokenIssuedAt } = await import("@/lib/contact-token-client");
    const now = 1_757_000_000_000;
    const token = issueContactToken(now)!;
    expect(tokenIssuedAt(token)).toBe(now);
    expect(tokenIssuedAt("sem-ponto")).toBeNull();
    expect(tokenIssuedAt("bm90bnVt.abc")).toBeNull();
    delete process.env.CONTACT_TOKEN_SECRET;
  });
});
