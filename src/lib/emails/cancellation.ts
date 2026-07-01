import { getResend } from "@/lib/resend";
import { emailShell } from "@/lib/emails/templates";

export async function sendCancellationConfirmation(to: string, accessUntil: string) {
  const resend = getResend();
  if (!resend) return;

  const html = emailShell(`
    <p style="font-size:17px;font-weight:600;margin:0 0 16px;">Ton abonnement est annulé</p>
    <p style="margin:0 0 12px;">
      C'est confirmé : ton abonnement Ancrage ne sera plus renouvelé. Aucun prélèvement supplémentaire
      ne sera effectué.
    </p>
    <p style="margin:0 0 12px;">
      Tu gardes l'accès à toutes les fonctionnalités jusqu'au <strong>${accessUntil}</strong>, date de fin
      de ta période déjà payée. Passé cette date, ton compte repasse simplement en formule gratuite —
      tes entrées de journal restent intactes et accessibles.
    </p>
    <p style="margin:0;">
      Tu peux réactiver ton abonnement à tout moment depuis tes paramètres.
    </p>
  `);

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "Glowy <noreply@glowy.beauty>",
    to,
    subject: "Confirmation d'annulation — Ancrage",
    html,
  });
}
