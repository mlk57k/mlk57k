import { getResend } from "@/lib/resend";
import { emailShell } from "@/lib/emails/templates";

interface RecapData {
  to: string;
  dateLabel: string;
  newSignups: number;
  newEntries: number;
  totalSignups: number;
  totalEntries: number;
  signupEmails: string[];
}

export async function sendDailyRecapEmail(data: RecapData) {
  const resend = getResend();
  if (!resend) return;

  const stat = (n: number, label: string) => `
    <td align="center" style="padding:14px 8px;background:#FBF7EE;border-radius:14px;">
      <div style="font-size:28px;font-weight:700;color:#C4523A;font-family:Georgia,serif;">${n}</div>
      <div style="font-size:12px;color:#8a8078;margin-top:2px;">${label}</div>
    </td>`;

  const list = data.signupEmails.length
    ? `<p style="margin:20px 0 6px;font-size:13px;font-weight:600;color:#3a2f28;">Nouveaux inscrits :</p>
       <p style="margin:0;font-size:13px;color:#6a6058;line-height:1.7;">${data.signupEmails.join("<br>")}</p>`
    : `<p style="margin:20px 0 0;font-size:13px;color:#8a8078;">Aucune nouvelle inscription aujourd'hui.</p>`;

  const html = emailShell(`
    <p style="font-size:18px;font-weight:600;margin:0 0 4px;">Ton récap Ancrage 🌙</p>
    <p style="margin:0 0 18px;font-size:13px;color:#8a8078;">${data.dateLabel}</p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="8" style="margin:0 0 4px;">
      <tr>
        ${stat(data.newSignups, "inscrits aujourd'hui")}
        ${stat(data.newEntries, "entrées écrites")}
      </tr>
      <tr>
        ${stat(data.totalSignups, "inscrits au total")}
        ${stat(data.totalEntries, "entrées au total")}
      </tr>
    </table>

    ${list}
  `);

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "Ancrage <bonjour@ancrage.xyz>",
    to: data.to,
    subject: `Récap Ancrage — ${data.newSignups} inscrit${data.newSignups > 1 ? "s" : ""}, ${data.newEntries} entrée${data.newEntries > 1 ? "s" : ""}`,
    html,
  });
}
