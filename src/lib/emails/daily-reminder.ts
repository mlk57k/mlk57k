import { getResend } from "@/lib/resend";
import { emailShell } from "@/lib/emails/templates";

export async function sendDailyReminderEmail(to: string, appUrl: string) {
  const resend = getResend();
  if (!resend) return;

  const html = emailShell(`
    <p style="font-size:17px;font-weight:600;margin:0 0 16px;">Un instant pour toi ?</p>
    <p style="margin:0 0 24px;">
      Quelques lignes suffisent. Comment s'est passée ta journée ?
    </p>
    <a href="${appUrl}/journal" style="display:inline-block;background:#C4523A;color:#FFFFFF;text-decoration:none;font-family:-apple-system,Helvetica,Arial,sans-serif;font-size:14px;font-weight:600;padding:12px 22px;border-radius:999px;">
      Écrire mon entrée
    </a>
  `);

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "Ancrage <noreply@ancrage.app>",
    to,
    subject: "Un instant pour toi ?",
    html,
  });
}
