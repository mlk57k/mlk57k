import { chromium } from 'playwright-core';
import { writeFileSync } from 'fs';

// Icône Ancrage : ancre corail sur fond crème, style de l'app
function iconHtml(size, padRatio) {
  const pad = Math.round(size * padRatio);
  const inner = size - pad * 2;
  return `<!DOCTYPE html><html><head><style>
    * { margin: 0; padding: 0; }
    body { width: ${size}px; height: ${size}px; background: linear-gradient(160deg, #FBF7EE 0%, #F6E8DF 100%); display: flex; align-items: center; justify-content: center; }
  </style></head><body>
    <svg width="${inner}" height="${inner}" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="4" r="2" stroke="#BD6E4C" stroke-width="1.4"/>
      <path d="M10 6V16M5 11C5 14 7.5 16 10 16C12.5 16 15 14 15 11" stroke="#BD6E4C" stroke-width="1.4" stroke-linecap="round"/>
      <path d="M6 9H14" stroke="#BD6E4C" stroke-width="1.4" stroke-linecap="round"/>
    </svg>
  </body></html>`;
}

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const targets = [
  { file: 'icon-192.png', size: 192, pad: 0.18 },
  { file: 'icon-512.png', size: 512, pad: 0.18 },
  { file: 'icon-512-maskable.png', size: 512, pad: 0.26 },
  { file: 'apple-touch-icon.png', size: 180, pad: 0.18 },
];
for (const t of targets) {
  const page = await browser.newPage({ viewport: { width: t.size, height: t.size } });
  await page.setContent(iconHtml(t.size, t.pad));
  const buf = await page.screenshot({ type: 'png' });
  writeFileSync(`/home/user/mlk57k/public/icons/${t.file}`, buf);
  console.log(t.file, buf.length, 'octets');
  await page.close();
}
await browser.close();
