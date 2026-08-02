import { getResend } from "@/lib/resend";
import { emailShell } from "@/lib/emails/templates";

// Relance de réengagement : envoyée aux personnes qui ne sont pas revenues
// depuis 24h. `idempotencyKey` évite un doublon le même jour.
export async function sendInactiveReminderEmail(to: string, appUrl: string, idempotencyKey?: string) {
  const resend = getResend();
  if (!resend) return;

  const html = emailShell(`
    <p style="font-family:Georgia,serif;font-size:22px;font-weight:600;color:#262019;margin:0 0 18px;line-height:1.3;">
      Ta page t'attend.
    </p>

    <p style="margin:0 0 16px;">
      Tu n'es pas passé hier — aucun souci. Ton espace est resté exactement comme tu l'as
      laissé : calme, à toi, sans jugement.
    </p>

    <p style="margin:0 0 22px;">
      Trois minutes ce soir pour déposer ce que tu as sur le cœur ? Ton coach t'écoute, et
      tu fermes la journée l'esprit un peu plus léger.
    </p>

    <!-- CTA -->
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 22px;">
      <tr>
        <td style="border-radius:999px;background:#C4523A;">
          <a href="${appUrl}/journal" style="display:inline-block;padding:14px 30px;font-family:-apple-system,Helvetica,Arial,sans-serif;font-size:15px;font-weight:700;color:#FFFFFF;text-decoration:none;border-radius:999px;">
            Reprendre mon journal
          </a>
        </td>
      </tr>
    </table>

    <p style="margin:0;font-size:13px;color:#8a8078;line-height:1.6;">
      On sera là quand tu voudras. À ce soir, peut-être. 🌙
    </p>
  `);

  await resend.emails.send(
    {
      from: process.env.RESEND_FROM_EMAIL ?? "Ancrage <bonjour@ancrage.xyz>",
      replyTo: "m.nabbachi@icloud.com",
      to,
      subject: "Ta page t'attend 🌙",
      html,
    },
    idempotencyKey ? { idempotencyKey } : undefined
  );
}
