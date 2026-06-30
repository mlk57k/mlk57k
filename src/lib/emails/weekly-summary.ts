import { getResend } from "@/lib/resend";
import { emailShell } from "@/lib/emails/templates";

interface WeeklySummaryEmailParams {
  to: string;
  weekLabel: string;
  summary: string;
  appUrl: string;
}

export async function sendWeeklySummaryEmail({ to, weekLabel, summary, appUrl }: WeeklySummaryEmailParams) {
  const resend = getResend();
  if (!resend) return;

  const html = emailShell(`
    <p style="font-size:17px;font-weight:600;margin:0 0 4px;">Ton bilan de la semaine</p>
    <p style="margin:0 0 20px;color:#9C8870;font-size:13px;">${weekLabel}</p>
    <p style="margin:0 0 24px;white-space:pre-line;">${summary}</p>
    <a href="${appUrl}/bilan" style="display:inline-block;background:#C4523A;color:#FFFFFF;text-decoration:none;font-family:-apple-system,Helvetica,Arial,sans-serif;font-size:14px;font-weight:600;padding:12px 22px;border-radius:999px;">
      Voir le détail
    </a>
  `);

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "Ancrage <noreply@ancrage.app>",
    to,
    subject: `Ton bilan de la semaine — ${weekLabel}`,
    html,
  });
}
