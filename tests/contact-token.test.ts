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

  it("token emitido é válido dentro da janela 1s..30min", () => {
    process.env.CONTACT_TOKEN_SECRET = KEY;
    const issued = Date.now() - 10_000;
    const token = issueContactToken(issued)!;
    expect(verifyContactToken(token, issued + 10_000)).toBe("valid");
  });

  it("rejeita token novo demais (<1s) e velho demais (>30min)", () => {
    process.env.CONTACT_TOKEN_SECRET = KEY;
    const now = Date.now();
    const token = issueContactToken(now)!;
    expect(verifyContactToken(token, now + 400)).toBe("invalid");
    expect(verifyContactToken(token, now + 1_500)).toBe("valid");
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

describe("minAgeWaitMs — espera do cliente imune a clock skew", () => {
  it("depende SÓ do tempo monotônico local: relógio do cliente atrasado 1h não muda nada", async () => {
    const { minAgeWaitMs, CONTACT_TOKEN_MIN_AGE_MS, CONTACT_TOKEN_WAIT_MARGIN_MS } =
      await import("@/lib/contact-token-client");
    const cap = CONTACT_TOKEN_MIN_AGE_MS + CONTACT_TOKEN_WAIT_MARGIN_MS;
    const { vi } = await import("vitest");
    // relógio de parede ATRASADO 1h — não pode entrar na conta
    const spy = vi.spyOn(Date, "now").mockReturnValue(Date.now() - 3_600_000);
    try {
      expect(minAgeWaitMs(0)).toBe(cap);
      expect(minAgeWaitMs(cap)).toBe(0);
      expect(minAgeWaitMs(10 * 60_000)).toBe(0);
    } finally {
      spy.mockRestore();
    }
  });

  it("relógio do cliente ADIANTADO 1h também não muda nada", async () => {
    const { minAgeWaitMs, CONTACT_TOKEN_MIN_AGE_MS, CONTACT_TOKEN_WAIT_MARGIN_MS } =
      await import("@/lib/contact-token-client");
    const cap = CONTACT_TOKEN_MIN_AGE_MS + CONTACT_TOKEN_WAIT_MARGIN_MS;
    const { vi } = await import("vitest");
    const spy = vi.spyOn(Date, "now").mockReturnValue(Date.now() + 3_600_000);
    try {
      expect(minAgeWaitMs(500)).toBe(cap - 500);
    } finally {
      spy.mockRestore();
    }
  });

  it("teto rígido: nenhum input produz espera acima de MIN_AGE + margem (nem espera negativa)", async () => {
    const { minAgeWaitMs, CONTACT_TOKEN_MIN_AGE_MS, CONTACT_TOKEN_WAIT_MARGIN_MS } =
      await import("@/lib/contact-token-client");
    const cap = CONTACT_TOKEN_MIN_AGE_MS + CONTACT_TOKEN_WAIT_MARGIN_MS;
    expect(minAgeWaitMs(-3_600_000)).toBe(cap); // monotônico "negativo" impossível → cap
    expect(minAgeWaitMs(Number.NaN)).toBe(cap);
    // input não-finito → espera o TETO (limitado), nunca ilimitado
    expect(minAgeWaitMs(Number.POSITIVE_INFINITY)).toBe(cap);
    expect(minAgeWaitMs(999_999_999)).toBe(0);
  });
});
