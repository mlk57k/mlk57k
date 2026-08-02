import { getResend } from "@/lib/resend";
import { emailShell } from "@/lib/emails/templates";

// 2e relance (~3 jours après la 1re) pour les comptes bloqués qui n'ont pas
// encore pris l'offre. Ton doux, sans pression. Lien traçable /r/relance2.
export async function sendPaywallNudge2Email(to: string, appUrl: string, userId?: string, idempotencyKey?: string) {
  const resend = getResend();
  if (!resend) return;

  const ctaHref = userId ? `${appUrl}/r/relance2?u=${userId}` : `${appUrl}/paywall`;

  const html = emailShell(`
    <p style="font-family:Georgia,serif;font-size:22px;font-weight:600;color:#262019;margin:0 0 18px;line-height:1.3;">
      Tu hésites encore ? C'est normal.
    </p>

    <p style="margin:0 0 16px;">
      Prendre un abonnement, même petit, ça se réfléchit. Alors on te laisse le temps —
      mais on voulait juste te rappeler que <strong style="color:#262019;">ton premier mois
      reste à 1&nbsp;€</strong>.
    </p>

    <p style="margin:0 0 22px;">
      De quoi tester l'illimité tranquillement, sans risque. Si ça ne te parle pas, tu
      annules en un clic — tu ne perds rien, tu gardes tout ce que tu as déjà écrit.
    </p>

    <!-- CTA -->
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">
      <tr>
        <td style="border-radius:999px;background:#C4523A;">
          <a href="${ctaHref}" style="display:inline-block;padding:14px 30px;font-family:-apple-system,Helvetica,Arial,sans-serif;font-size:15px;font-weight:700;color:#FFFFFF;text-decoration:none;border-radius:999px;">
            Profiter du 1er mois à 1&nbsp;€
          </a>
        </td>
      </tr>
    </table>

    <p style="margin:0;font-size:13px;color:#8a8078;line-height:1.6;">
      1&nbsp;€ le premier mois, puis 9,99&nbsp;€/mois. Annulable quand tu veux. À ce soir,
      peut-être. 🌙
    </p>
  `);

  const result = await resend.emails.send(
    {
      from: process.env.RESEND_FROM_EMAIL ?? "Ancrage <bonjour@ancrage.xyz>",
      replyTo: "m.nabbachi@icloud.com",
      to,
      subject: "Ton 1er mois à 1 € t'attend toujours 🌙",
      html,
    },
    idempotencyKey ? { idempotencyKey } : undefined
  );
  if (result.error) {
    throw new Error(`Resend: ${result.error.message ?? JSON.stringify(result.error)}`);
  }
  return result.data?.id;
}
