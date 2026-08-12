import type { RoomAnalysis } from "@/lib/anthropic";

// Génère une image de carte-score (format story 9:16) prête à partager.
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number
): number {
  const words = text.split(/\s+/);
  let line = "";
  let lines = 0;
  for (let i = 0; i < words.length; i++) {
    const test = line ? `${line} ${words[i]}` : words[i];
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, y);
      line = words[i];
      y += lineHeight;
      lines++;
      if (lines >= maxLines - 1) {
        // dernière ligne : on tronque proprement le reste
        let rest = words.slice(i).join(" ");
        while (ctx.measureText(rest + "…").width > maxWidth && rest.length > 0) {
          rest = rest.slice(0, -1);
        }
        ctx.fillText(rest + "…", x, y);
        return y + lineHeight;
      }
    } else {
      line = test;
    }
  }
  if (line) {
    ctx.fillText(line, x, y);
    y += lineHeight;
  }
  return y;
}

function buildCoconImage(analysis: RoomAnalysis): Promise<Blob> {
  const W = 1080;
  const H = 1920;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // Fond crème
  ctx.fillStyle = "#FBF7EE";
  ctx.fillRect(0, 0, W, H);

  // Halo coral doux en haut
  const glow = ctx.createRadialGradient(W / 2, 120, 60, W / 2, 120, 700);
  glow.addColorStop(0, "rgba(196,82,58,0.14)");
  glow.addColorStop(1, "rgba(196,82,58,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, 900);

  ctx.textAlign = "center";

  // Wordmark
  ctx.fillStyle = "#C4523A";
  ctx.font = "600 66px Georgia, 'Times New Roman', serif";
  ctx.fillText("Ancrage", W / 2, 230);

  // Label
  ctx.fillStyle = "#9A8270";
  ctx.font = "600 30px Helvetica, Arial, sans-serif";
  ctx.fillText("T O N   C O C O N", W / 2, 300);

  // Anneau de score
  const cx = W / 2;
  const cy = 640;
  const r = 190;
  ctx.lineWidth = 34;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#EFE3DA";
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = "#C4523A";
  ctx.beginPath();
  ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + (analysis.score / 10) * Math.PI * 2);
  ctx.stroke();

  // Score au centre
  ctx.fillStyle = "#262019";
  ctx.font = "700 200px Georgia, serif";
  ctx.textBaseline = "middle";
  ctx.fillText(String(analysis.score), cx, cy - 6);
  ctx.font = "600 44px Helvetica, Arial, sans-serif";
  ctx.fillStyle = "#9A8270";
  ctx.fillText("/ 10", cx, cy + 128);
  ctx.textBaseline = "alphabetic";

  // Ambiance (italique)
  ctx.fillStyle = "#6B5545";
  ctx.font = "italic 46px Georgia, serif";
  wrapText(ctx, analysis.ambiance || "Un espace à transformer en cocon.", W / 2, 1010, 840, 66, 4);

  // Séparateur
  ctx.strokeStyle = "rgba(51,36,26,0.12)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 120, 1520);
  ctx.lineTo(W / 2 + 120, 1520);
  ctx.stroke();

  // Footer CTA
  ctx.fillStyle = "#33241A";
  ctx.font = "600 40px Helvetica, Arial, sans-serif";
  ctx.fillText("Et ta chambre à toi ?", W / 2, 1640);
  ctx.fillStyle = "#C4523A";
  ctx.font = "700 46px Helvetica, Arial, sans-serif";
  ctx.fillText("ancrage.xyz/cocon", W / 2, 1710);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("blob"))), "image/png", 0.95);
  });
}

// Partage l'image via le partage natif (stories) ; sinon, télécharge le PNG.
export async function shareCoconScore(analysis: RoomAnalysis): Promise<void> {
  const blob = await buildCoconImage(analysis);
  const file = new File([blob], "mon-cocon-ancrage.png", { type: "image/png" });

  const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
  if (nav.share && nav.canShare && nav.canShare({ files: [file] })) {
    try {
      await nav.share({
        files: [file],
        text: "Mon cocon selon Ancrage 🌙 Analyse ta chambre : ancrage.xyz/cocon",
      });
      return;
    } catch {
      // annulé ou non supporté → on retombe sur le téléchargement
    }
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  a.click();
  URL.revokeObjectURL(url);
}
