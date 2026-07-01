import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage, type RGB } from "pdf-lib";

export interface ExportEntry {
  createdAt: string;
  moodScore: number | null;
  messages: { role: "user" | "assistant"; content: string }[];
}

export function buildExportText(entries: ExportEntry[]): string {
  return entries
    .map((e) => {
      const date = new Date(e.createdAt).toLocaleString("fr-FR");
      const mood = e.moodScore ? ` — humeur ${e.moodScore}/10` : "";
      const thread = e.messages
        .map((m) => `${m.role === "user" ? "Toi" : "Coach"} : ${m.content}`)
        .join("\n");
      return `${date}${mood}\n${"-".repeat(40)}\n${thread}\n`;
    })
    .join("\n\n");
}

// ─── Palette Ancrage (tailwind.config.ts) ───────────────────────────────────
const CREAM_50 = rgb(0.984, 0.969, 0.933); // #FBF7EE — fond de page
const CREAM_200 = rgb(0.906, 0.867, 0.796); // #E7DDCB — bordures
const CREAM_500 = rgb(0.604, 0.541, 0.447); // #9A8A72 — texte discret
const CORAL_400 = rgb(0.741, 0.431, 0.298); // #BD6E4C — bulles utilisateur
const WHITE = rgb(1, 1, 1);
const STONE_700 = rgb(0.267, 0.251, 0.235); // #44403C — texte principal
const STONE_400 = rgb(0.659, 0.635, 0.62); // #A8A29E

const MOOD_STYLES: Record<number, { color: RGB; label: string }> = {
  5: { color: rgb(0.561, 0.627, 0.525), label: "Serein" },   // #8FA086
  4: { color: rgb(0.804, 0.643, 0.361), label: "Léger" },    // #CDA45C
  3: { color: rgb(0.741, 0.431, 0.298), label: "Mêlé" },     // #BD6E4C
  2: { color: rgb(0.827, 0.569, 0.486), label: "Sensible" }, // #D3917C
  1: { color: rgb(0.486, 0.541, 0.627), label: "Lourd" },    // #7C8AA0
};

const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;
const MARGIN = 48;
const LINE_HEIGHT = 14;
const TEXT_SIZE = 10;
const BUBBLE_PAD_X = 13;
const BUBBLE_PAD_Y = 10;
const BUBBLE_MAX_TEXT_WIDTH = 320;
const BUBBLE_RADIUS = 12;
const AVATAR_RADIUS = 9;
const AVATAR_GAP = 8;

// pdf-lib encode en WinAnsi : on retire tout caractère non supporté (emoji…)
function sanitize(text: string, font: PDFFont): string {
  let out = "";
  for (const ch of text.replace(/\r\n/g, "\n")) {
    if (ch === "\n") { out += ch; continue; }
    try {
      font.widthOfTextAtSize(ch, TEXT_SIZE);
      out += ch;
    } catch {
      // caractère non encodable — ignoré
    }
  }
  return out;
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const lines: string[] = [];
  for (const rawLine of text.split("\n")) {
    const words = rawLine.split(/\s+/).filter(Boolean);
    if (words.length === 0) { lines.push(""); continue; }
    let current = "";
    for (const word of words) {
      const test = current ? `${current} ${word}` : word;
      if (font.widthOfTextAtSize(test, size) > maxWidth && current) {
        lines.push(current);
        current = word;
      } else {
        current = test;
      }
    }
    lines.push(current);
  }
  return lines;
}

// Chemin SVG d'un rectangle arrondi (origine en haut à gauche, y vers le bas)
function roundedRectPath(w: number, h: number, r: number): string {
  const radius = Math.min(r, w / 2, h / 2);
  return [
    `M ${radius},0`,
    `L ${w - radius},0`,
    `Q ${w},0 ${w},${radius}`,
    `L ${w},${h - radius}`,
    `Q ${w},${h} ${w - radius},${h}`,
    `L ${radius},${h}`,
    `Q 0,${h} 0,${h - radius}`,
    `L 0,${radius}`,
    `Q 0,0 ${radius},0`,
    "Z",
  ].join(" ");
}

export async function buildExportPdf(entries: ExportEntry[]): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle("Mon journal — Ancrage");

  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontDisplay = await doc.embedFont(StandardFonts.TimesRomanBold);

  let page: PDFPage;
  let y = 0;

  function newPage() {
    page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    page.drawRectangle({ x: 0, y: 0, width: PAGE_WIDTH, height: PAGE_HEIGHT, color: CREAM_50 });
    y = PAGE_HEIGHT - MARGIN;
  }

  function ensureSpace(needed: number) {
    if (y - needed < MARGIN + 24) newPage();
  }

  newPage();

  // ─── En-tête ──────────────────────────────────────────────────────────────
  page!.drawText("Ancrage", { x: MARGIN, y: y - 22, size: 26, font: fontDisplay, color: CORAL_400 });
  const exportDate = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  page!.drawText("Mon journal", { x: MARGIN, y: y - 40, size: 11, font, color: STONE_700 });
  const exportLabel = `Exporté le ${exportDate}`;
  page!.drawText(exportLabel, {
    x: PAGE_WIDTH - MARGIN - font.widthOfTextAtSize(exportLabel, 9),
    y: y - 40, size: 9, font, color: CREAM_500,
  });
  y -= 58;
  page!.drawLine({
    start: { x: MARGIN, y }, end: { x: PAGE_WIDTH - MARGIN, y },
    thickness: 0.8, color: CREAM_200,
  });
  y -= 26;

  // ─── Bulles de chat ───────────────────────────────────────────────────────
  function drawBubbleChunk(lines: string[], isUser: boolean, showAvatar: boolean) {
    const textWidth = Math.max(...lines.map((l) => font.widthOfTextAtSize(l, TEXT_SIZE)), 10);
    const bubbleW = textWidth + BUBBLE_PAD_X * 2;
    const bubbleH = lines.length * LINE_HEIGHT + BUBBLE_PAD_Y * 2 - (LINE_HEIGHT - TEXT_SIZE);

    const avatarSpace = isUser ? 0 : AVATAR_RADIUS * 2 + AVATAR_GAP;
    const bx = isUser ? PAGE_WIDTH - MARGIN - bubbleW : MARGIN + avatarSpace;

    if (!isUser && showAvatar) {
      page!.drawCircle({
        x: MARGIN + AVATAR_RADIUS, y: y - AVATAR_RADIUS,
        size: AVATAR_RADIUS, color: CORAL_400,
      });
      page!.drawText("A", {
        x: MARGIN + AVATAR_RADIUS - fontDisplay.widthOfTextAtSize("A", 10) / 2,
        y: y - AVATAR_RADIUS - 3.5,
        size: 10, font: fontDisplay, color: WHITE,
      });
    }

    page!.drawSvgPath(roundedRectPath(bubbleW, bubbleH, BUBBLE_RADIUS), {
      x: bx, y,
      color: isUser ? CORAL_400 : WHITE,
      borderColor: isUser ? undefined : CREAM_200,
      borderWidth: isUser ? 0 : 0.8,
    });

    lines.forEach((line, i) => {
      page!.drawText(line, {
        x: bx + BUBBLE_PAD_X,
        y: y - BUBBLE_PAD_Y - TEXT_SIZE + 2 - i * LINE_HEIGHT,
        size: TEXT_SIZE, font,
        color: isUser ? WHITE : STONE_700,
      });
    });

    y -= bubbleH + 10;
  }

  function drawMessage(content: string, isUser: boolean) {
    const clean = sanitize(content, font).trim();
    if (!clean) return;
    const lines = wrapText(clean, font, TEXT_SIZE, BUBBLE_MAX_TEXT_WIDTH);

    // Découpe en morceaux si la bulle dépasse la page
    const usable = PAGE_HEIGHT - MARGIN * 2 - 24;
    const maxLinesPerChunk = Math.max(1, Math.floor((usable - BUBBLE_PAD_Y * 2) / LINE_HEIGHT));
    let first = true;
    for (let i = 0; i < lines.length; i += maxLinesPerChunk) {
      const chunk = lines.slice(i, i + maxLinesPerChunk);
      const chunkH = chunk.length * LINE_HEIGHT + BUBBLE_PAD_Y * 2;
      ensureSpace(chunkH);
      drawBubbleChunk(chunk, isUser, first);
      first = false;
    }
  }

  // ─── Entrées ──────────────────────────────────────────────────────────────
  for (const entry of entries) {
    ensureSpace(64);

    const date = new Date(entry.createdAt).toLocaleDateString("fr-FR", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    });
    page!.drawText(date.toUpperCase(), { x: MARGIN, y, size: 8.5, font: fontBold, color: STONE_400 });

    const mood = entry.moodScore ? MOOD_STYLES[entry.moodScore] : null;
    if (mood) {
      const moodX = PAGE_WIDTH - MARGIN - font.widthOfTextAtSize(mood.label, 9);
      page!.drawCircle({ x: moodX - 9, y: y + 3, size: 3.2, color: mood.color });
      page!.drawText(mood.label, { x: moodX, y, size: 9, font, color: STONE_700 });
    }
    y -= 20;

    for (const message of entry.messages) {
      drawMessage(message.content, message.role === "user");
    }
    y -= 18;
  }

  if (entries.length === 0) {
    page!.drawText("Aucune entrée pour le moment.", { x: MARGIN, y, size: 11, font, color: CREAM_500 });
  }

  // ─── Pieds de page ────────────────────────────────────────────────────────
  const pages = doc.getPages();
  pages.forEach((p, i) => {
    const label = `${i + 1} / ${pages.length}`;
    p.drawText(label, {
      x: PAGE_WIDTH / 2 - font.widthOfTextAtSize(label, 8) / 2,
      y: 26, size: 8, font, color: CREAM_500,
    });
  });

  return doc.save();
}
