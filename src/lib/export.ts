import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";

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

const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;
const MARGIN = 50;
const MAX_WIDTH = PAGE_WIDTH - MARGIN * 2;
const LINE_HEIGHT = 14;

function wrapText(text: string, font: PDFFont, size: number): string[] {
  const lines: string[] = [];
  for (const rawLine of text.split("\n")) {
    const words = rawLine.split(/\s+/).filter(Boolean);
    let current = "";
    for (const word of words) {
      const test = current ? `${current} ${word}` : word;
      if (font.widthOfTextAtSize(test, size) > MAX_WIDTH && current) {
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

export async function buildExportPdf(entries: ExportEntry[]): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle("Mon journal — Ancrage");

  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  let page: PDFPage = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - MARGIN;

  function ensureSpace(linesNeeded: number) {
    if (y - linesNeeded * LINE_HEIGHT < MARGIN) {
      page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      y = PAGE_HEIGHT - MARGIN;
    }
  }

  function drawParagraph(text: string, useFont: PDFFont, size: number, color = rgb(0.15, 0.13, 0.1)) {
    const lines = wrapText(text, useFont, size);
    for (const line of lines) {
      ensureSpace(1);
      page.drawText(line, { x: MARGIN, y, size, font: useFont, color });
      y -= LINE_HEIGHT;
    }
  }

  for (const entry of entries) {
    ensureSpace(3);
    const date = new Date(entry.createdAt).toLocaleString("fr-FR");
    const mood = entry.moodScore ? `  —  humeur ${entry.moodScore}/10` : "";
    drawParagraph(`${date}${mood}`, fontBold, 12, rgb(0.77, 0.32, 0.23));
    y -= 4;

    for (const message of entry.messages) {
      const label = message.role === "user" ? "Toi" : "Coach";
      drawParagraph(`${label} : ${message.content}`, font, 10);
      y -= 6;
    }
    y -= 16;
  }

  return doc.save();
}
