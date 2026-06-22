import Link from "next/link";
import { CheckCircle, Sparkles, ArrowRight } from "lucide-react";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const features = [
  "Coach IA illimité (TCC + entretien motivationnel)",
  "Suivi streak & gestion bienveillante des rechutes",
  "Journal des déclencheurs + analyse patterns IA",
  "Plan de sevrage personnalisé sur 4 semaines",
  "Accès 24h/24, 7j/7, depuis n'importe quel appareil",
  "Techniques cliniquement validées",
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />

      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          Simple & transparent
        </div>
        <h1 className="mb-4 text-4xl font-bold">Un seul plan. Tout inclus.</h1>
        <p className="mb-16 text-muted-foreground">
          Pas de niveaux, pas de frais cachés. Tout ce dont tu as besoin pour te libérer.
        </p>

        <Card className="mx-auto max-w-md p-8 shadow-lg">
          <div className="mb-2 text-sm font-medium text-primary uppercase tracking-wide">
            Abonnement mensuel
          </div>
          <div className="mb-1 flex items-end justify-center gap-1">
            <span className="text-5xl font-bold">9,99€</span>
            <span className="mb-2 text-muted-foreground">/mois</span>
          </div>
          <p className="mb-8 text-sm text-muted-foreground">
            7 jours d&apos;essai gratuit · Annule quand tu veux
          </p>

          <ul className="mb-8 space-y-3 text-left">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm">
                <CheckCircle className="h-4 w-4 shrink-0 text-accent" />
                {f}
              </li>
            ))}
          </ul>

          <Link href="/checkout">
            <Button size="lg" className="w-full gap-2">
              Commencer l&apos;essai gratuit
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <p className="mt-3 text-xs text-muted-foreground">
            Sans carte bancaire requise · Résiliation en 1 clic
          </p>
        </Card>

        {/* FAQ */}
        <div className="mt-16 text-left max-w-lg mx-auto space-y-4">
          <h2 className="text-xl font-bold text-center mb-6">Questions fréquentes</h2>
          {[
            {
              q: "Comment fonctionne l'essai gratuit ?",
              a: "Tu as 7 jours pour essayer toutes les fonctionnalités de Libero. Aucune carte bancaire n'est requise pendant cette période.",
            },
            {
              q: "Puis-je annuler n'importe quand ?",
              a: "Oui, tu peux annuler ton abonnement à tout moment depuis la page Paramètres. Tu gardes l'accès jusqu'à la fin de la période payée.",
            },
            {
              q: "Libero remplace-t-il un professionnel de santé ?",
              a: "Non. Libero est un outil de soutien complémentaire. Si tu souffres d'une addiction sévère, consulte un médecin ou un addictologue.",
            },
            {
              q: "Mes données sont-elles confidentielles ?",
              a: "Oui, absolument. Tes conversations et données personnelles sont chiffrées et ne sont jamais partagées avec des tiers.",
            },
          ].map(({ q, a }) => (
            <div key={q} className="border-b border-border pb-4">
              <p className="font-semibold text-sm mb-1">{q}</p>
              <p className="text-sm text-muted-foreground">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
