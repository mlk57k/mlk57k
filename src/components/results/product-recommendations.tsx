"use client";

import { Droplets, Zap, Headphones } from "lucide-react";
import type { RoutineItem } from "@/lib/scan-schema";

// ─── Mappings catégorie → recommandation produit ────────────────────────────

interface Rec {
  label: string;
  desc: string;
}

const SOFT_MAP: Record<string, Rec> = {
  hydrat: { label: "Crème hydratante légère", desc: "Maintient l'hydratation toute la journée sans alourdir." },
  solaire: { label: "SPF 30 minéral", desc: "Protection douce, idéale pour les peaux sensibles." },
  nettoy: { label: "Gel nettoyant doux", desc: "Nettoie sans perturber le film hydrolipidique." },
  exfoli: { label: "Lotion exfoliante PHA", desc: "Renouvelle l'éclat sans agresser la peau." },
  éclat: { label: "Sérum vitamine C 5 %", desc: "Illumine progressivement pour un teint radieux." },
  nutri: { label: "Baume nourrissant sans parfum", desc: "Nourrit en profondeur sans obstruer les pores." },
  sébum: { label: "Soin matifiant doux", desc: "Régule les brillances sans dessécher la peau." },
  "": { label: "Soin quotidien doux", desc: "Formule légère sans irritants pour un usage au quotidien." },
};

const INTENSE_MAP: Record<string, Rec> = {
  hydrat: { label: "Sérum acide hyaluronique 2 %", desc: "Repulpe en profondeur et comble les rides fines." },
  solaire: { label: "SPF 50+ fluide invisible", desc: "Protection maximale, texture ultra-légère." },
  nettoy: { label: "Double nettoyage huile + mousse", desc: "Dissout maquillage et impuretés en profondeur." },
  exfoli: { label: "Peeling AHA/BHA 10 %", desc: "Lisse la texture et unifie le grain de peau." },
  éclat: { label: "Vitamine C 15 % stabilisée", desc: "Corrige les taches et booste l'éclat en profondeur." },
  nutri: { label: "Masque repulpant concentré", desc: "Traitement intensif pour une peau régénérée." },
  sébum: { label: "Sérum niacinamide 10 % + zinc", desc: "Régule le sébum et resserre les pores visiblement." },
  "": { label: "Traitement ciblé actif", desc: "Formule haute concentration pour des résultats rapides." },
};

function match(map: Record<string, Rec>, category: string): Rec {
  const lower = category.toLowerCase();
  const key = Object.keys(map).find((k) => k && lower.includes(k));
  return key !== undefined ? map[key] : map[""];
}

// ─── Composant ───────────────────────────────────────────────────────────────

export function ProductRecommendations({ routine }: { routine: RoutineItem[] }) {
  if (!routine.length) return null;

  const softRecs = routine.map((item) => ({
    category: item.category,
    ...match(SOFT_MAP, item.category),
  }));

  const intenseRecs = routine.map((item) => ({
    category: item.category,
    ...match(INTENSE_MAP, item.category),
  }));

  return (
    <div className="space-y-6">
      {/* SoftSkin */}
      <section className="rounded-3xl overflow-hidden border border-blue-100 bg-white shadow-soft">
        <div className="flex items-center gap-2 px-5 pt-5 pb-3">
          <Droplets className="h-4 w-4 text-blue-500" />
          <h2 className="font-display text-base font-bold text-stone-900">
            Recommandations{" "}
            <span className="text-blue-500">SoftSkin</span>
          </h2>
          <span className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-500 border border-blue-100">
            Doux · Quotidien
          </span>
        </div>
        <p className="text-xs text-stone-400 px-5 pb-3">
          Des soins doux adaptés à ta peau, à intégrer dès maintenant.
        </p>
        <div className="divide-y divide-cream-100">
          {softRecs.map((rec) => (
            <div key={rec.category} className="px-5 py-3.5 flex gap-3">
              <div className="h-8 w-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                <Droplets className="h-3.5 w-3.5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-blue-500 font-medium mb-0.5">{rec.category}</p>
                <p className="text-sm font-semibold text-stone-900">{rec.label}</p>
                <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">{rec.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* IntenseSkin */}
      <section className="rounded-3xl overflow-hidden border border-coral-100 bg-white shadow-soft">
        <div className="flex items-center gap-2 px-5 pt-5 pb-3">
          <Zap className="h-4 w-4 text-coral-400" />
          <h2 className="font-display text-base font-bold text-stone-900">
            Recommandations{" "}
            <span className="text-coral-400">IntenseSkin</span>
          </h2>
          <span className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full bg-coral-50 text-coral-400 border border-coral-100">
            Actif · Intensif
          </span>
        </div>
        <p className="text-xs text-stone-400 px-5 pb-3">
          Des actifs ciblés pour des résultats visibles plus rapidement.
        </p>
        <div className="divide-y divide-cream-100">
          {intenseRecs.map((rec) => (
            <div key={rec.category} className="px-5 py-3.5 flex gap-3">
              <div className="h-8 w-8 rounded-xl bg-coral-50 border border-coral-100 flex items-center justify-center shrink-0">
                <Zap className="h-3.5 w-3.5 text-coral-400" />
              </div>
              <div>
                <p className="text-xs text-coral-400 font-medium mb-0.5">{rec.category}</p>
                <p className="text-sm font-semibold text-stone-900">{rec.label}</p>
                <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">{rec.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Support prioritaire */}
      <section className="rounded-3xl border border-cream-200 bg-white px-5 py-4 flex items-start gap-3 shadow-soft">
        <div className="h-9 w-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
          <Headphones className="h-4 w-4 text-emerald-500" />
        </div>
        <div>
          <p className="font-semibold text-sm text-stone-900">Support prioritaire</p>
          <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
            Une question sur ta routine ? On te répond en priorité.{" "}
            <a
              href="mailto:support@glowy.app"
              className="text-coral-400 font-semibold hover:underline"
            >
              support@glowy.app
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
