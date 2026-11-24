import "server-only";
import nodemailer from "nodemailer";

type Attachment = { filename: string; content: Buffer; contentType: string };

export type MailMessage = {
  to: string;
  replyTo: { name: string; address: string };
  subject: string;
  html: string;
  text: string;
  attachments?: Attachment[];
};

/**
 * Sends through SMTP when SMTP_HOST is set. Otherwise the message is only written
 * to the server log, like Laravel's `MAIL_MAILER=log`.
 */
function transport() {
  if (!process.env.SMTP_HOST) return nodemailer.createTransport({ jsonTransport: true });
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
      : undefined,
  });
}

export async function sendMail(message: MailMessage) {
  const info = await transport().sendMail({
    // Sending "from" the visitor's own address fails SPF/DMARC, so the site's
    // address is the sender and the visitor goes in Reply-To.
    from: { name: process.env.MAIL_FROM_NAME ?? "Al Zahra HR website", address: process.env.MAIL_FROM_ADDRESS ?? "no-reply@localhost" },
    to: message.to,
    replyTo: message.replyTo,
    subject: message.subject,
    html: message.html,
    text: message.text,
    attachments: message.attachments,
  });
  if (!process.env.SMTP_HOST) {
    const files = message.attachments?.map((a) => `${a.filename} (${a.content.length} bytes)`) ?? [];
    console.info(`[mail:log] to=${message.to} subject="${message.subject}" attachments=[${files.join(", ")}]\n${message.text}`);
  }
  return info;
}

export function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}
