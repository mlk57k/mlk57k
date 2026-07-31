// Gabarit d'email commun à Ancrage — sobre, chaleureux, dans l'identité de la marque.
// Compatible clients mail (tables + styles inline). L'emblème est un ⚓ dans une
// pastille abricot ; le titre en serif rappelle la typographie du site.
export function emailShell(bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
</head>
<body style="margin:0;padding:0;background:#F3ECDD;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F3ECDD;padding:36px 16px;">
    <tr>
      <td align="center">

        <!-- En-tête : ancre (vrai logo) + nom -->
        <table role="presentation" width="500" cellpadding="0" cellspacing="0" style="max-width:500px;">
          <tr>
            <td align="center" style="padding-bottom:18px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align:middle;">
                    <img src="https://ancrage.xyz/icon" width="34" height="34" alt="" style="display:block;border-radius:9px;" />
                  </td>
                  <td style="padding-left:10px;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:600;color:#3a2f28;letter-spacing:.3px;">Ancrage</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Carte -->
        <table role="presentation" width="500" cellpadding="0" cellspacing="0" style="max-width:500px;background:#FFFFFF;border-radius:22px;border:1px solid #E7DDCB;box-shadow:0 6px 22px -12px rgba(120,90,60,.25);">
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,#BD6E4C,#CDA45C);border-radius:22px 22px 0 0;line-height:4px;font-size:0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:34px 36px 30px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:15px;line-height:1.65;color:#3a322a;">
              ${bodyHtml}
            </td>
          </tr>
        </table>

        <!-- Pied -->
        <table role="presentation" width="500" cellpadding="0" cellspacing="0" style="max-width:500px;">
          <tr>
            <td style="padding:20px 12px 0;font-family:-apple-system,Helvetica,Arial,sans-serif;font-size:12px;line-height:1.6;color:#9C8870;text-align:center;">
              Ancrage — ton journal du soir.<br />
              Un compagnon de réflexion, pas un remplacement d'un suivi thérapeutique.<br />
              <a href="mailto:contact@ancrage.xyz" style="color:#A55C3D;text-decoration:none;">contact@ancrage.xyz</a>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;
}
