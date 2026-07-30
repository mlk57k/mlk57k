import { getResend } from "@/lib/resend";
import { emailShell } from "@/lib/emails/templates";

export async function sendWelcomeEmail(to: string, appUrl: string) {
  const resend = getResend();
  if (!resend) return;

  const html = emailShell(`
    <p style="font-size:19px;font-weight:600;margin:0 0 16px;">Bienvenue dans Ancrage 🌙</p>
    <p style="margin:0 0 16px;">
      Je suis content de te compter parmi nous. Ancrage, c'est ton espace du soir :
      quelques minutes pour déposer ta journée, à l'écrit ou à voix haute, et un
      compagnon qui t'écoute vraiment.
    </p>
    <p style="margin:0 0 24px;">
      Le meilleur moyen de commencer ? Une première entrée, ce soir. Même trois lignes.
    </p>
    <a href="${appUrl}/journal" style="display:inline-block;background:#C4523A;color:#FFFFFF;text-decoration:none;font-family:-apple-system,Helvetica,Arial,sans-serif;font-size:14px;font-weight:600;padding:12px 22px;border-radius:999px;">
      Écrire ma première entrée
    </a>
    <p style="margin:28px 0 0;font-size:13px;color:#8a8078;">
      Un conseil : installe Ancrage sur ton écran d'accueil pour l'avoir toujours
      à portée de main, et active le rappel du soir depuis tes paramètres.
    </p>
  `);

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "Ancrage <noreply@glowy.beauty>",
    to,
    subject: "Bienvenue dans Ancrage 🌙",
    html,
  });
}
