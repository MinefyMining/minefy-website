/**
 * Testes da API /api/contact com transporte MOCKADO — nenhum e-mail real.
 * O módulo da rota lê env no import, então cada cenário usa resetModules +
 * import dinâmico com o ambiente desejado.
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
  service: "ia-corporativa",
  division: "mineracao",
};

function jsonRequest(body: unknown) {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
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
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    if (originalKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = originalKey;
    vi.restoreAllMocks();
  });

  it("400 para payload inválido (sem enviar nada)", async () => {
    const { POST } = await loadRoute(true);
    const res = await POST(jsonRequest({ ...valid, email: "inválido" }));
    expect(res.status).toBe(400);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("400 para serviço fora do enum", async () => {
    const { POST } = await loadRoute(true);
    const res = await POST(jsonRequest({ ...valid, service: "hackear-tudo" }));
    expect(res.status).toBe(400);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("200 no sucesso mockado, com serviço e empresa no e-mail interno", async () => {
    sendMock.mockResolvedValue({ data: { id: "mock-id" }, error: null });
    const { POST } = await loadRoute(true);
    const res = await POST(
      jsonRequest({ ...valid, company: "Empresa Exemplo S.A." }),
    );
    expect(res.status).toBe(200);
    expect(sendMock).toHaveBeenCalledTimes(1);
    const arg = sendMock.mock.calls[0][0];
    expect(arg.subject).toContain("IA corporativa");
    expect(arg.html).toContain("Empresa Exemplo S.A.");
    expect(arg.html).toContain("IA corporativa");
    expect(arg.replyTo).toBe(valid.email);
  });

  it("502 quando o provedor recusa o envio", async () => {
    sendMock.mockResolvedValue({ data: null, error: { message: "rejected" } });
    const { POST } = await loadRoute(true);
    const res = await POST(jsonRequest(valid));
    expect(res.status).toBe(502);
  });

  it("500 quando o provedor lança exceção", async () => {
    sendMock.mockRejectedValue(new Error("network down"));
    const { POST } = await loadRoute(true);
    const res = await POST(jsonRequest(valid));
    expect(res.status).toBe(500);
  });

  it("503 sem RESEND_API_KEY configurada", async () => {
    const { POST } = await loadRoute(false);
    const res = await POST(jsonRequest(valid));
    expect(res.status).toBe(503);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("honeypot preenchido: 200 silencioso, NENHUM e-mail enviado", async () => {
    const { POST } = await loadRoute(true);
    const res = await POST(jsonRequest({ ...valid, website: "http://spam.example" }));
    expect(res.status).toBe(200);
    expect(sendMock).not.toHaveBeenCalled();
  });
});
