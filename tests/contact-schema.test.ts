import { describe, expect, it } from "vitest";
import { contactSchema, isServico, SERVICOS } from "@/lib/contact-schema";

const valid = {
  name: "Maria Silva",
  phone: "+55 31 99999-0000",
  email: "maria@example.com",
  subject: "Quero conversar sobre IA",
  servico: "ia-corporativa",
};

describe("contactSchema (contrato MIKE-ARQUITETURA 5.1)", () => {
  it("aceita o payload mínimo válido (empresa e mensagem opcionais)", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it("aceita payload completo com empresa, divisão, hp vazio e token", () => {
    const r = contactSchema.safeParse({
      ...valid,
      empresa: "Empresa Exemplo S.A.",
      message: "Contexto do projeto",
      division: "mineracao",
      hp: "",
      t: "abc.def",
    });
    expect(r.success).toBe(true);
  });

  it("servico é OBRIGATÓRIO", () => {
    const semServico: Record<string, unknown> = { ...valid };
    delete semServico.servico;
    expect(contactSchema.safeParse(semServico).success).toBe(false);
  });

  it("rejeita servico fora do enum (dimensão separada da divisão)", () => {
    expect(contactSchema.safeParse({ ...valid, servico: "blockchain" }).success).toBe(false);
  });

  it("rejeita e-mail inválido e telefone com caracteres proibidos", () => {
    expect(contactSchema.safeParse({ ...valid, email: "não-é-email" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, phone: "liga p/ mim <script>" }).success).toBe(false);
  });

  it("rejeita divisão fora do enum", () => {
    expect(contactSchema.safeParse({ ...valid, division: "espacial" }).success).toBe(false);
  });

  it(".strict(): chave desconhecida derruba o payload (anti-inflação)", () => {
    expect(contactSchema.safeParse({ ...valid, extra: "lixo" }).success).toBe(false);
  });

  it("aplica limites de tamanho", () => {
    expect(contactSchema.safeParse({ ...valid, name: "a".repeat(121) }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, subject: "a".repeat(161) }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, message: "a".repeat(4001) }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, empresa: "a".repeat(121) }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, email: "a".repeat(250) + "@x.co" }).success).toBe(false);
  });

  it("empresa ausente passa; mínimos de name/subject/phone valem", () => {
    expect(contactSchema.safeParse({ ...valid, name: "a" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, subject: "ab" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, phone: "1234567" }).success).toBe(false);
  });

  it("hp aceita apenas string vazia (honeypot)", () => {
    expect(contactSchema.safeParse({ ...valid, hp: "" }).success).toBe(true);
    expect(contactSchema.safeParse({ ...valid, hp: "http://spam" }).success).toBe(false);
  });
});

describe("isServico (pré-seleção via ?servico=)", () => {
  it("aceita todos os slugs do enum", () => {
    for (const s of SERVICOS) expect(isServico(s)).toBe(true);
  });
  it("rejeita valores desconhecidos, null e undefined", () => {
    expect(isServico("qualquer-coisa")).toBe(false);
    expect(isServico(null)).toBe(false);
    expect(isServico(undefined)).toBe(false);
  });
});
