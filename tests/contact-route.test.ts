/**
 * Testes da API /api/contact com transporte MOCKADO — nenhum e-mail real,
 * nenhuma leitura de .env (RESEND_API_KEY fica undefined por padrão e é
 * injetada como dummy nos casos que precisam). Nenhum valor de env é ecoado.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const sendMock = vi.fn();

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));

const valid = {
  name: "Maria Silva",
  phone: "+55 31 99999-0000",
  email: "maria@example.com",
  subject: "Projeto de IA",
  servico: "ia-corporativa",
  division: "mineracao",
};

function jsonRequest(body: unknown, host = "www.minefymining.com") {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", Host: host },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

async function loadRoute(withKey: boolean) {
  vi.resetModules();
  if (withKey) {
    process.env.RESEND_API_KEY = "test-key-mockada-nunca-real";
  } else {
    delete process.env.RESEND_API_KEY;
  }
  return await import("@/app/api/contact/route");
}

describe("POST /api/contact", () => {
  const originalKey = process.env.RESEND_API_KEY;

  beforeEach(() => {
    sendMock.mockReset();
    delete process.env.CONTACT_TOKEN_SECRET;
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    if (originalKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = originalKey;
    delete process.env.CONTACT_TOKEN_SECRET;
    vi.restoreAllMocks();
  });

  it("(a) payload inválido → 400 e send NÃO chamado", async () => {
    const { POST } = await loadRoute(true);
    const res = await POST(jsonRequest({ ...valid, email: "inválido" }));
    expect(res.status).toBe(400);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("(a2) servico ausente e chave desconhecida (.strict) → 400", async () => {
    const { POST } = await loadRoute(true);
    const semServico: Record<string, unknown> = { ...valid };
    delete semServico.servico;
    expect((await POST(jsonRequest(semServico))).status).toBe(400);
    expect((await POST(jsonRequest({ ...valid, extra: "x" }))).status).toBe(400);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("(b) payload válido → 200, send 1×, subject com serviço e divisão, replyTo/from/to corretos", async () => {
    sendMock.mockResolvedValue({ data: { id: "mock-id" }, error: null });
    const { POST } = await loadRoute(true);
    const res = await POST(jsonRequest({ ...valid, empresa: "Empresa Exemplo S.A." }));
    expect(res.status).toBe(200);
    expect(sendMock).toHaveBeenCalledTimes(1);
    const arg = sendMock.mock.calls[0][0];
    expect(arg.subject).toContain("Mineração");
    expect(arg.subject).toContain("IA corporativa");
    expect(arg.replyTo).toBe(valid.email);
    expect(arg.from).toContain("minefymining.com");
    expect(arg.to).toBeTruthy();
    expect(arg.html).toContain("Empresa Exemplo S.A.");
  });

  it("(c) provedor devolve error → 502", async () => {
    sendMock.mockResolvedValue({ data: null, error: { message: "rejected" } });
    const { POST } = await loadRoute(true);
    expect((await POST(jsonRequest(valid))).status).toBe(502);
  });

  it("(c2) provedor lança exceção → 500", async () => {
    sendMock.mockRejectedValue(new Error("network down"));
    const { POST } = await loadRoute(true);
    expect((await POST(jsonRequest(valid))).status).toBe(500);
  });

  it("(d) RESEND_API_KEY ausente → 503 e send não chamado", async () => {
    const { POST } = await loadRoute(false);
    expect((await POST(jsonRequest(valid))).status).toBe(503);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("(e) Host agrofymining vence division do corpo: e-mail rotulado Agrofy", async () => {
    sendMock.mockResolvedValue({ data: { id: "mock-id" }, error: null });
    const { POST } = await loadRoute(true);
    const res = await POST(
      jsonRequest({ ...valid, servico: "agro-telemetria", division: "mineracao" }, "www.agrofymining.com"),
    );
    expect(res.status).toBe(200);
    const arg = sendMock.mock.calls[0][0];
    expect(arg.subject).toContain("Agrofy");
    expect(arg.subject).not.toContain("Mineração");
  });

  it("(f) honeypot preenchido → 200 silencioso, NENHUM e-mail", async () => {
    const { POST } = await loadRoute(true);
    const res = await POST(jsonRequest({ ...valid, hp: "http://spam.example" }));
    expect(res.status).toBe(200);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("(g) corpo acima de 16KB → 413 antes do parse", async () => {
    const { POST } = await loadRoute(true);
    const big = JSON.stringify({ ...valid, message: "a".repeat(20_000) });
    expect((await POST(jsonRequest(big))).status).toBe(413);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("(h) token: inválido → 400 quando secret existe; ausente com secret → 400; fail-open sem secret", async () => {
    sendMock.mockResolvedValue({ data: { id: "mock-id" }, error: null });
    process.env.CONTACT_TOKEN_SECRET = "segredo-de-teste-nunca-real";
    const { POST } = await loadRoute(true);
    expect((await POST(jsonRequest({ ...valid, t: "forjado.assinatura" }))).status).toBe(400);
    expect((await POST(jsonRequest(valid))).status).toBe(400);
    expect(sendMock).not.toHaveBeenCalled();

    // com token legítimo dentro da janela → 200
    const { issueContactToken } = await import("@/lib/contact-token");
    const token = issueContactToken(Date.now() - 10_000)!;
    expect((await POST(jsonRequest({ ...valid, t: token }))).status).toBe(200);
  });

  it("(i) JSON malformado → 400", async () => {
    const { POST } = await loadRoute(true);
    expect((await POST(jsonRequest("{não é json"))).status).toBe(400);
  });
});
