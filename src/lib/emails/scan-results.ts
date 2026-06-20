/** Génère le HTML de l'email "Ton score Glowy est arrivé". */
export function scanResultsEmail({
  score,
  skinAge,
  issueCount,
  appUrl,
}: {
  score: number;
  skinAge: number;
  issueCount: number;
  appUrl: string;
}) {
  const scoreColor =
    score >= 70 ? "#10b981" : score >= 45 ? "#f59e0b" : "#FF6B52";

  return {
    subject: "Ton score Glowy est arrivé ✨",
    html: `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Ton score Glowy</title>
</head>
<body style="margin:0;padding:0;background:#FDFAF7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FDFAF7;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:480px;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #e8e0d4;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#FF6B52,#ff9a87);padding:32px 32px 24px;text-align:center;">
            <span style="font-size:36px;font-weight:800;color:#ffffff;letter-spacing:-1px;">Glowy</span>
            <p style="color:rgba(255,255,255,0.9);margin:8px 0 0;font-size:15px;">Ton analyse de peau est prête ✨</p>
          </td>
        </tr>

        <!-- Score -->
        <tr>
          <td style="padding:32px 32px 0;text-align:center;">
            <div style="display:inline-block;width:96px;height:96px;border-radius:24px;background:#fff5f3;border:3px solid ${scoreColor};line-height:90px;">
              <span style="font-size:36px;font-weight:800;color:${scoreColor};">${score}</span>
            </div>
            <p style="margin:12px 0 4px;font-size:18px;font-weight:700;color:#1a1a1a;">Score peau : ${score} / 100</p>
            <p style="margin:0;font-size:14px;color:#6b7280;">Âge estimé de ta peau : <strong>${skinAge} ans</strong></p>
          </td>
        </tr>

        <!-- Issues teaser -->
        <tr>
          <td style="padding:24px 32px 0;">
            <div style="background:#fdf8f6;border-radius:12px;padding:16px 20px;border:1px solid #f0e8e4;">
              <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#FF6B52;text-transform:uppercase;letter-spacing:0.5px;">
                ${issueCount} point${issueCount > 1 ? "s" : ""} détecté${issueCount > 1 ? "s"  : ""}
              </p>
              <p style="margin:0;font-size:14px;color:#6b7280;line-height:1.5;">
                Ta routine personnalisée est disponible. Débloque-la pour voir les conseils produits adaptés à ta peau.
              </p>
            </div>
          </td>
        </tr>

        <!-- CTA -->
        <tr>
          <td style="padding:28px 32px 32px;text-align:center;">
            <a href="${appUrl}/checkout"
               style="display:inline-block;background:#FF6B52;color:#ffffff;font-size:16px;font-weight:700;text-decoration:none;padding:14px 36px;border-radius:999px;">
              Débloquer ma routine →
            </a>
            <p style="margin:16px 0 0;font-size:12px;color:#9ca3af;">
              Paiement sécurisé · Résilie à tout moment
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:16px 32px 24px;border-top:1px solid #f0e8e4;text-align:center;">
            <p style="margin:0;font-size:12px;color:#9ca3af;">
              Ceci est un aperçu cosmétique informatif, pas un avis médical.<br/>
              © ${new Date().getFullYear()} Glowy
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
  };
}
