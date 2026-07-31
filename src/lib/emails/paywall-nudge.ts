import { getResend } from "@/lib/resend";
import { emailShell } from "@/lib/emails/templates";

export async function sendPaywallNudgeEmail(to: string, appUrl: string) {
  const resend = getResend();
  if (!resend) return;

  const html = emailShell(`
    <p style="font-size:19px;font-weight:600;margin:0 0 16px;">Tu as trouvé ta place ici ✨</p>
    <p style="margin:0 0 16px;">
      Tu as utilisé tes 10 confidences offertes — ça veut dire que tu as pris le temps
      de déposer ce que tu avais sur le cœur, plusieurs soirs de suite. C'est déjà beaucoup.
    </p>
    <p style="margin:0 0 24px;">
      Pour continuer sans limite — confidences illimitées, mémoire de ton coach, bilans du
      dimanche — passe à l'illimité. Et tu as <strong>3 jours d'essai gratuit</strong> :
      tu ne paies rien si tu changes d'avis.
    </p>
    <a href="${appUrl}/paywall" style="display:inline-block;background:#C4523A;color:#FFFFFF;text-decoration:none;font-family:-apple-system,Helvetica,Arial,sans-serif;font-size:14px;font-weight:600;padding:12px 22px;border-radius:999px;">
      Continuer en illimité
    </a>
    <p style="margin:28px 0 0;font-size:13px;color:#8a8078;">
      Annulable en 1 clic, à tout moment. Tes entrées déjà écrites restent toujours à toi.
    </p>
  `);

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "Ancrage <noreply@glowy.beauty>",
    to,
    subject: "Continue d'écrire, sans limite 🌙",
    html,
  });
}
