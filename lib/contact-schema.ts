import { z } from "zod";

/** Serviço/interesse do lead — dimensão própria, ORTOGONAL à divisão
 * (mineração × Agrofy): nunca derivar um do outro. Os CTAs das páginas de
 * serviço pré-selecionam via `?servico=<slug>`; sem valor na query o
 * default é o serviço-âncora do mundo que hospedou o formulário. */
export const SERVICOS = [
  "mineracao-telemetria",
  "ia-corporativa",
  "agentes-autonomos",
  "servicos-ti",
  "agro-telemetria",
  "outro",
] as const;

export type Servico = (typeof SERVICOS)[number];

export function isServico(value: string | null | undefined): value is Servico {
  return value != null && (SERVICOS as readonly string[]).includes(value);
}

export const contactSchema = z
  .object({
    name: z.string().trim().min(2, "Informe seu nome").max(120, "Máximo de 120 caracteres"),
    phone: z
      .string()
      .trim()
      .min(8, "Informe um telefone válido")
      .max(32, "Máximo de 32 caracteres")
      .regex(/^[\d\s()+.-]+$/, "Telefone só pode conter dígitos e ( ) + . -"),
    email: z
      .string()
      .trim()
      .max(254, "Máximo de 254 caracteres")
      .email("Digite um endereço de e-mail válido"),
    empresa: z.string().trim().max(120, "Máximo de 120 caracteres").optional(),
    subject: z.string().trim().min(3, "Informe o assunto").max(160, "Máximo de 160 caracteres"),
    message: z.string().trim().max(4000, "Máximo de 4000 caracteres").optional(),
    /** Obrigatório — todo lead chega classificado. */
    servico: z.enum(SERVICOS),
    /** Preservado por compatibilidade, mas a API DERIVA a divisão do header
     * Host e ignora este valor (um POST forjado não rotula lead no mundo
     * errado). */
    division: z.enum(["mineracao", "agrofy"]).optional(),
    /** Honeypot: campo invisível para humanos; qualquer conteúdo = bot.
     * A API o checa ANTES do parse (responde 200 sem enviar nada). */
    hp: z.string().max(0).optional(),
    /** Nonce HMAC stateless emitido pela página de contato (anti-abuso sem
     * estado em memória — proibido em serverless). Validado pela API quando
     * CONTACT_TOKEN_SECRET existir; fail-open com log enquanto não existir. */
    t: z.string().max(256).optional(),
  })
  .strict();

export type ContactFormData = z.infer<typeof contactSchema>;
