import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/lib/contact-schema";

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = contactSchema.parse(body);

    await resend.emails.send({
      from: "Auctify Website <onboarding@resend.dev>",
      to: "contact@auctify.com.br",
      subject: `[Website] ${escapeHtml(data.subject)}`,
      html: `
        <h2>Nova mensagem do site</h2>
        <p><strong>Nome:</strong> ${escapeHtml(data.name)}</p>
        <p><strong>Telefone:</strong> ${escapeHtml(data.phone)}</p>
        <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
        <p><strong>Assunto:</strong> ${escapeHtml(data.subject)}</p>
        <p><strong>Mensagem:</strong> ${escapeHtml(data.message || "N/A")}</p>
      `,
    });

    return NextResponse.json({ success: true, message: "Email sent" });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { success: false, message: "Validation error" },
        { status: 400 },
      );
    }
    console.error("Contact form error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send email" },
      { status: 500 },
    );
  }
}
