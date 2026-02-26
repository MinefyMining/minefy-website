import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1, "Preencha esse campo"),
  phone: z.string().min(1, "Preencha esse campo"),
  email: z.string().min(1, "Preencha esse campo").email("Digite um endereço de e-mail válido"),
  subject: z.string().min(1, "Preencha esse campo"),
  message: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;
