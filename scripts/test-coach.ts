/**
 * Test manuel du format de réponse du coach.
 * Usage : ANTHROPIC_API_KEY=sk-ant-... npx tsx scripts/test-coach.ts
 */
import { generateCoachReply } from "../src/lib/anthropic";

const key = process.env.ANTHROPIC_API_KEY;
if (!key) {
  console.error("ANTHROPIC_API_KEY manquante.");
  process.exit(1);
}

const reply = await generateCoachReply(
  [],
  "Journée épuisante au taf, mon chef m'a encore mis la pression sur le projet et j'ai pas eu une minute pour souffler. J'ai l'impression de courir partout sans jamais rien finir.",
  {
    objectifs: "Prénom : Malik\nCe qui l'amène : gérer le stress et l'anxiété",
    memoryDigest: null,
    shortTerm: null,
    longTerm: null,
  },
  key
);

console.log("=== RÉPONSE DU COACH ===");
console.log(reply.message);
console.log("=== FIN ===");
const paragraphs = reply.message.split(/\n\s*\n/).filter((p) => p.trim());
console.log(`Nombre de paragraphes : ${paragraphs.length}`);
console.log(`Titre généré : ${reply.titre}`);
