import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;
