import { chromium } from "playwright";

// Chemin du binaire Chromium. Surchargeable via CHROME_PATH ; sinon on laisse
// Playwright résoudre son propre Chromium (npx playwright install chromium).
const EXEC = process.env.CHROME_PATH || undefined;
const BASE = "http://localhost:3000";
const OUT = "/tmp/shots";

const mockScan = {
  skin_score: 82,
  skin_age: 24,
  issues: [
    { name: "Hydratation", severity: 28, description: "Ta peau est plutôt bien hydratée, continue comme ça ! Un coup de boost le matin et elle sera au top." },
    { name: "Éclat", severity: 18, description: "Joli teint lumineux, on voit que tu prends soin de toi." },
    { name: "Texture", severity: 52, description: "Quelques petites irrégularités sur la zone T, rien d'alarmant. Une exfoliation douce hebdo ferait des merveilles." },
    { name: "Zones de brillance", severity: 64, description: "Un peu de brillance sur le front et le nez en fin de journée. On peut équilibrer ça facilement." },
  ],
  routine: [
    { category: "Hydratation quotidienne", reason: "Pour maintenir ta peau souple et repulpée toute la journée." },
    { category: "Protection solaire SPF 50", reason: "Le geste anti-âge n°1 pour préserver ton éclat." },
    { category: "Exfoliation douce hebdomadaire", reason: "Pour lisser la texture et révéler une peau plus nette." },
  ],
  id: "demo1234",
  created_at: new Date().toISOString(),
  unlocked: false,
};

const browser = await chromium.launch(EXEC ? { executablePath: EXEC } : {});
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();

async function shot(name, waitMs = 800) {
  await page.waitForTimeout(waitMs);
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
  console.log("saved", name);
}

// 1. Landing
await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
await shot("01-landing");

// 2. Scan — étape consentement
await page.goto(`${BASE}/scan`, { waitUntil: "networkidle" });
await shot("02-scan-consent");

// 3. Résultats — on injecte un scan de démo en sessionStorage puis on navigue
await page.evaluate((scan) => {
  sessionStorage.setItem("glowy:scan:" + scan.id, JSON.stringify(scan));
}, mockScan);
await page.goto(`${BASE}/results/${mockScan.id}`, { waitUntil: "networkidle" });
await shot("03-results", 1500);

// 4. Résultats débloqués (routine visible)
await page.evaluate((scan) => {
  sessionStorage.setItem("glowy:scan:" + scan.id, JSON.stringify({ ...scan, unlocked: true }));
}, mockScan);
await page.reload({ waitUntil: "networkidle" });
await shot("04-results-unlocked", 1500);

await browser.close();
console.log("done");
