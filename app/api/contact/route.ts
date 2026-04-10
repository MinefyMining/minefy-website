import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/lib/contact-schema";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "Minefy Website <noreply@minefymining.com>";
const TO_EMAIL = process.env.CONTACT_TO_EMAIL || "contact@minefymining.com";

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

    if (!resend) {
      console.error(
        "Contact form: RESEND_API_KEY is not configured. Email not sent.",
      );
      return NextResponse.json(
        { success: false, message: "Email service not configured" },
        { status: 503 },
      );
    }

    const { data: sendResult, error: sendError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: data.email,
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

    if (sendError) {
      console.error("Contact form: Resend rejected send:", sendError);
      return NextResponse.json(
        { success: false, message: "Failed to send email" },
        { status: 502 },
      );
    }

    console.log(
      `Contact form: message sent to ${TO_EMAIL} (resend_id=${sendResult?.id ?? "unknown"})`,
    );
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
