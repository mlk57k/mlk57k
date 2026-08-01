import { getResend } from "@/lib/resend";
import { emailShell } from "@/lib/emails/templates";

// Relance « offre de lancement » : 1er mois à 1 € pour les comptes gratuits qui
// ont épuisé leurs 10 confidences. `idempotencyKey` évite tout doublon si la
// campagne est relancée par erreur (déduplication côté Resend).
export async function sendLaunchOfferEmail(to: string, appUrl: string, idempotencyKey?: string) {
  const resend = getResend();
  if (!resend) return;

  const html = emailShell(`
    <p style="font-family:Georgia,serif;font-size:22px;font-weight:600;color:#262019;margin:0 0 18px;line-height:1.3;">
      Tu as trouvé ta place ici.
    </p>

    <p style="margin:0 0 16px;">
      Tu as utilisé tes dix confidences offertes — autrement dit, tu es revenu plusieurs
      soirs déposer ce que tu avais sur le cœur. C'est déjà une belle habitude qui s'installe.
    </p>

    <p style="margin:0 0 22px;">
      Pour continuer sans t'arrêter, on t'offre quelque chose :
      <strong style="color:#262019;">ton premier mois pour 1&nbsp;€</strong>. Tu gardes ton
      coach, sa mémoire de vos échanges, tes bilans du dimanche, et tout ce que tu as déjà écrit.
    </p>

    <!-- Ce qui est inclus -->
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 26px;">
      <tr><td style="padding:4px 0;color:#3a322a;font-size:14.5px;">✦&nbsp;&nbsp;Confidences illimitées avec ton coach</td></tr>
      <tr><td style="padding:4px 0;color:#3a322a;font-size:14.5px;">✦&nbsp;&nbsp;Ta mémoire garde le fil de ton histoire</td></tr>
      <tr><td style="padding:4px 0;color:#3a322a;font-size:14.5px;">✦&nbsp;&nbsp;Le bilan de ta semaine, chaque dimanche</td></tr>
      <tr><td style="padding:4px 0;color:#3a322a;font-size:14.5px;">✦&nbsp;&nbsp;Tes données exportables, à tout moment</td></tr>
    </table>

    <!-- CTA -->
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">
      <tr>
        <td style="border-radius:999px;background:#C4523A;">
          <a href="${appUrl}/paywall" style="display:inline-block;padding:14px 30px;font-family:-apple-system,Helvetica,Arial,sans-serif;font-size:15px;font-weight:700;color:#FFFFFF;text-decoration:none;border-radius:999px;">
            Continuer pour 1&nbsp;€
          </a>
        </td>
      </tr>
    </table>

    <p style="margin:0;font-size:13px;color:#8a8078;line-height:1.6;">
      <strong style="color:#5c5048;">1&nbsp;€ le premier mois</strong>, puis 9,99&nbsp;€/mois.
      Annulable en un clic, quand tu veux.
    </p>
  `);

  await resend.emails.send(
    {
      from: process.env.RESEND_FROM_EMAIL ?? "Ancrage <noreply@glowy.beauty>",
      replyTo: "m.nabbachi@icloud.com",
      to,
      subject: "Ton premier mois à 1 € 🌙",
      html,
    },
    idempotencyKey ? { idempotencyKey } : undefined
  );
}
