# 🎬 Script vidéo — Glowy · Avatar IA · Avant/Après peau

**Durée cible :** 35 s · **Format :** 9:16 vertical · **Ton :** authentique, UGC
**Avatar :** femme 22-28 ans, peau normale/mixte, look naturel, lumière douce « selfie matin », fond chambre/salle de bain flou

## Approche : HYBRIDE
- Avatar IA (HeyGen) → témoignage (hook, problème/avant, routine/après)
- Scènes Remotion → passages « app » (scan + score, CTA)

| Segment | Durée | Source | Contenu |
|---|---|---|---|
| 0:00–0:12 | 12s | Avatar HeyGen | Hook + problème / AVANT |
| 0:12–0:20 | 8s  | Remotion `Demo` | Scan IA + Skin Score 67 |
| 0:20–0:28 | 8s  | Avatar HeyGen | Routine + APRÈS |
| 0:28–0:35 | 7s  | Remotion `CTA` | Logo + bouton CTA |

---

## SEGMENT 1 — Avatar (0:00–0:12)

**HOOK (0:00–0:04)**
> « J'ai testé mon visage avec une IA… et franchement le résultat m'a CASSÉE. »
- Texte écran : `J'ai scanné ma peau avec une IA 😳`
- Direction : sourcils levés, choquée, se touche la joue

**PROBLÈME / AVANT (0:04–0:12)**
> « Avant, j'avais les pores dilatés sur la zone T, des rougeurs, le teint terne… et zéro idée de quoi mettre. J'achetais au pif. »
- Texte écran : `AVANT : pores · rougeurs · teint terne`
- Direction : déçue, montre sa peau

## SEGMENT 2 — Remotion Demo (0:12–0:20)
> Voix off avatar : « Du coup j'ai pris une photo dans l'app Glowy. L'IA analyse ta peau en 30 secondes et te sort un Skin Score sur 100 — moi : 67. »
- Visuel : scène `Demo` (upload → scan → score 67)

## SEGMENT 3 — Avatar (0:20–0:28)
> « Elle m'a donné une routine perso : nettoyant doux, sérum niacinamide, SPF. 3 semaines plus tard… regarde. »
- Texte écran : `APRÈS : 3 semaines de routine ✨`
- Direction : sourire, transition avant→après sur le visage (peau plus nette)

## SEGMENT 4 — Remotion CTA (0:28–0:35)
> « L'analyse est gratuite, ça prend 30 secondes. Teste, tu vas halluciner. »
- Visuel : scène `CTA` (logo ✨ glowy + bouton « Analyser ma peau → »)

---

## 🎤 Texte avatar complet (copier-coller dans HeyGen, sans annotations)

> J'ai testé mon visage avec une IA, et franchement le résultat m'a cassée. Avant, j'avais les pores dilatés sur la zone T, des rougeurs, le teint terne, et zéro idée de quoi mettre — j'achetais au pif. Du coup j'ai pris une photo dans l'app Glowy. L'IA analyse ta peau en 30 secondes et te sort un Skin Score sur 100. Moi : 67. Elle m'a donné une routine perso — nettoyant doux, sérum niacinamide, SPF. Trois semaines plus tard, regarde. L'analyse est gratuite et ça prend 30 secondes. Teste, tu vas halluciner.

---

## 🛠️ Pas-à-pas HeyGen (avatar)
1. Compte sur https://www.heygen.com → « Create Video » → format **Portrait 9:16**.
2. Choisir un avatar féminin naturel (ex. catégorie « UGC » / « Selfie »).
3. Voix : française, féminine, ton « amical / énergique ».
4. Coller le **texte avatar complet** (ou le découper segment par segment).
5. Générer, puis télécharger les clips avatar.
6. Montage final (CapCut/Premiere) : alterner clips avatar + clips Remotion selon le tableau ci-dessus.
7. Ajouter sous-titres auto + une musique TikTok tendance discrète.

## 🎬 Rendu des clips Remotion
```bash
cd remotion
# Clip scan + score
npx remotion render Demo out/demo.mp4 --browser-executable=$CHROMIUM
# Clip CTA final
npx remotion render CTA out/cta.mp4 --browser-executable=$CHROMIUM
```
