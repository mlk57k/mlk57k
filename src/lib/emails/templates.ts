export function emailShell(bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<body style="margin:0;padding:0;background:#FAF8F4;font-family:Georgia,'Times New Roman',serif;color:#262019;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border-radius:20px;padding:36px;border:1px solid #E9E0D2;">
          <tr>
            <td style="font-family:Georgia,serif;font-weight:600;font-size:20px;color:#262019;padding-bottom:24px;">
              Ancrage
            </td>
          </tr>
          <tr>
            <td style="font-family:-apple-system,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#3a322a;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding-top:32px;border-top:1px solid #E9E0D2;margin-top:24px;font-family:-apple-system,Helvetica,Arial,sans-serif;font-size:12px;color:#9C8870;">
              Ancrage — un compagnon de réflexion, pas un remplacement de suivi thérapeutique.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
