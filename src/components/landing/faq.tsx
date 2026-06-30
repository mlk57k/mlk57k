"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "C'est quoi exactement Ancrage ?",
    a: "Ancrage est un carnet de journal numérique couplé à une IA bienveillante. Tu écris ou tu parles quelques minutes le soir ; l'IA te renvoie un reflet et une question pour t'aider à « fermer » ta journée. Ce n'est pas un suivi thérapeutique.",
  },
  {
    q: "Mes écrits sont-ils privés ?",
    a: "Oui. Tes entrées sont chiffrées en transit et au repos. Elles ne sont jamais utilisées pour entraîner un modèle d'IA. Tu peux les exporter ou les effacer à tout moment depuis Mes données.",
  },
  {
    q: "Comment fonctionne l'essai gratuit ?",
    a: "Tu as accès à 3 entrées par semaine en version gratuite, sans carte bancaire. Si tu veux passer à illimité, un essai de 7 jours est inclus à l'abonnement payant. Tu peux annuler en un clic, à tout moment.",
  },
  {
    q: "Puis-je utiliser la voix à la place du texte ?",
    a: "Oui. Un bouton micro est disponible dans l'interface. Ta note vocale est transcrite automatiquement (via Whisper d'OpenAI), puis le fichier audio est supprimé — seul le texte est conservé.",
  },
  {
    q: "L'IA peut-elle remplacer un thérapeute ?",
    a: "Non. Ancrage est un compagnon de réflexion, pas un soutien clinique. En cas de détresse ou d'urgence, contacte le 3114 (numéro national de prévention du suicide), le 15 (SAMU) ou le 112.",
  },
  {
    q: "Comment résilier mon abonnement ?",
    a: "En un clic depuis Paramètres → Mon abonnement → Annuler. Tu gardes l'accès jusqu'à la fin de la période déjà payée, sans prélèvement supplémentaire. Un e-mail de confirmation t'est envoyé immédiatement.",
  },
];

function Item({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-cream-200 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left flex items-center justify-between gap-4 py-4"
      >
        <span className="font-medium text-stone-900 text-sm">{q}</span>
        <ChevronDown className={cn("h-4 w-4 text-stone-400 flex-none transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <p className="text-stone-600 text-sm leading-relaxed pb-4">{a}</p>
      )}
    </div>
  );
}

export function FAQ() {
  return (
    <section id="faq" className="bg-cream-50 py-20 sm:py-28">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-coral-500 mb-4">FAQ</p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-stone-900">Questions fréquentes</h2>
        </div>
        <div className="bg-white border border-cream-200 rounded-2xl px-6">
          {FAQS.map((f) => <Item key={f.q} {...f} />)}
        </div>
      </div>
    </section>
  );
}
