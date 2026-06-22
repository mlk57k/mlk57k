import Link from "next/link";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  MessageCircle,
  Flame,
  BookOpen,
  Map,
  Shield,
  Star,
  CheckCircle,
  ArrowRight,
  Brain,
  Heart,
  Target,
} from "lucide-react";

const features = [
  {
    icon: MessageCircle,
    title: "Coach IA conversationnel",
    description:
      "Discussions profondes basées sur la TCC et l'entretien motivationnel. Disponible 24h/24, bienveillant et non-jugeant.",
  },
  {
    icon: Flame,
    title: "Suivi streak & rechutes",
    description:
      "Visualise ta progression jour après jour. Si tu rechutes, ton coach est là pour t'aider à repartir sans culpabilité.",
  },
  {
    icon: BookOpen,
    title: "Journal des déclencheurs",
    description:
      "Identifie tes patterns de consommation. Après 5 entrées, l'IA analyse tes déclencheurs et propose des stratégies.",
  },
  {
    icon: Map,
    title: "Plan de sevrage personnalisé",
    description:
      "Roadmap sur 4 semaines générée par l'IA à partir de ton profil. Des micro-actions concrètes chaque semaine.",
  },
];

const steps = [
  {
    step: "01",
    title: "Diagnostic personnalisé",
    description:
      "Un questionnaire de 7 questions pour comprendre ta situation, tes déclencheurs et ta motivation à changer.",
  },
  {
    step: "02",
    title: "Ton plan sur mesure",
    description:
      "L'IA génère immédiatement un plan de sevrage sur 4 semaines adapté à ton profil et à la sévérité de ton addiction.",
  },
  {
    step: "03",
    title: "Coach à portée de main",
    description:
      "Chat avec ton coach chaque fois que tu ressens un craving, une envie de craquer, ou juste envie de parler.",
  },
];

const testimonials = [
  {
    name: "Thomas, 28 ans",
    duration: "3 mois sans cannabis",
    quote:
      "Le coach m'a aidé à identifier que je consommais systématiquement quand je stressais au travail. Maintenant je gère autrement.",
  },
  {
    name: "Antoine, 24 ans",
    duration: "6 semaines de streak",
    quote:
      "Après chaque rechute, le coach ne me jugeait pas. Il m'aidait juste à comprendre et repartir. C'est ça qui fait la différence.",
  },
  {
    name: "Maxime, 31 ans",
    duration: "2 mois clean",
    quote:
      "Le journal des déclencheurs a été révélateur. Je ne savais pas à quel point l'ennui était mon principal trigger.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden pb-24 pt-20">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Shield className="h-3.5 w-3.5" />
            Basé sur des techniques cliniques validées (TCC)
          </div>
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            Libère-toi de l&apos;addiction,{" "}
            <span className="text-gradient-indigo">un jour à la fois</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
            Ton coach IA personnel pour surmonter le cannabis et la pornographie. Techniques
            cliniquement validées, disponible 24h/24, sans jugement.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/auth?mode=signup">
              <Button size="lg" className="gap-2 px-8">
                Commencer gratuitement
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground">7 jours d&apos;essai gratuit · Sans CB requise</p>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-3xl px-4">
          <div className="grid grid-cols-3 gap-8 text-center">
            {[
              { value: "87%", label: "de réduction des cravings en 4 semaines" },
              { value: "24/7", label: "disponible, même à 3h du matin" },
              { value: "TCC", label: "techniques cliniquement validées" },
            ].map(({ value, label }) => (
              <div key={value}>
                <div className="text-3xl font-bold text-primary">{value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="fonctionnement" className="bg-secondary/30 py-24">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">Comment ça fonctionne ?</h2>
            <p className="mt-3 text-muted-foreground">Prêt à commencer en 5 minutes</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map(({ step, title, description }) => (
              <div key={step} className="relative text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                  {step}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">Tout ce dont tu as besoin</h2>
            <p className="mt-3 text-muted-foreground">Une approche complète pour un changement durable</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {features.map(({ icon: Icon, title, description }) => (
              <Card key={title} className="p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Clinical approach */}
      <section className="bg-primary/5 py-24">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-4 text-3xl font-bold">Une approche basée sur la science</h2>
              <p className="mb-6 text-muted-foreground">
                Libero n&apos;est pas une simple app de suivi. Notre coach IA intègre les techniques
                les plus efficaces reconnues par la recherche clinique.
              </p>
              <ul className="space-y-3">
                {[
                  { icon: Brain, text: "TCC : identifier et restructurer les pensées automatiques" },
                  { icon: Heart, text: "Entretien motivationnel : renforcer ta motivation intrinsèque" },
                  { icon: Target, text: "Gestion des cravings : surf de l'envie, délai de 15 minutes" },
                ].map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Icon className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-sm">{text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-border">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white shrink-0">L</div>
                  <div className="rounded-2xl rounded-bl-sm bg-secondary p-3 text-sm max-w-xs">
                    Je comprends que tu as envie de consommer en ce moment. C&apos;est un craving, et ça va passer. On peut essayer le surf de l&apos;envie ensemble ?
                  </div>
                </div>
                <div className="flex items-start gap-3 flex-row-reverse">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold shrink-0">Toi</div>
                  <div className="rounded-2xl rounded-br-sm bg-primary text-primary-foreground p-3 text-sm max-w-xs">
                    Oui, j&apos;essaie. C&apos;est quoi exactement ?
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white shrink-0">L</div>
                  <div className="rounded-2xl rounded-bl-sm bg-secondary p-3 text-sm max-w-xs">
                    Observe l&apos;envie comme une vague. Elle monte, atteint un pic, puis redescend — en 15-20 min. Tu n&apos;as pas à résister, juste à observer...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">Ce qu&apos;ils en disent</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map(({ name, duration, quote }) => (
              <Card key={name} className="p-6">
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="mb-4 text-sm text-muted-foreground">&ldquo;{quote}&rdquo;</p>
                <div>
                  <div className="font-semibold text-sm">{name}</div>
                  <div className="text-xs text-primary font-medium">{duration}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="bg-secondary/30 py-24">
        <div className="mx-auto max-w-lg px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">Commence ton parcours aujourd&apos;hui</h2>
          <p className="mb-8 text-muted-foreground">
            7 jours d&apos;essai gratuit, puis 9,99€/mois. Annule quand tu veux.
          </p>
          <Card className="p-8">
            <div className="mb-6">
              <div className="text-4xl font-bold">9,99€</div>
              <div className="text-muted-foreground">par mois · 7 jours gratuits</div>
            </div>
            <ul className="mb-8 space-y-3 text-left">
              {[
                "Coach IA illimité (TCC + entretien motivationnel)",
                "Suivi streak & gestion des rechutes",
                "Journal des déclencheurs + analyse IA",
                "Plan de sevrage personnalisé 4 semaines",
                "Accès 24h/24, 7j/7",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm">
                  <CheckCircle className="h-4 w-4 shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/auth?mode=signup">
              <Button size="lg" className="w-full gap-2">
                Commencer l&apos;essai gratuit
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <p className="mt-4 text-xs text-muted-foreground">
              Aucune carte bancaire requise pour l&apos;essai
            </p>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-5xl px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 Libero · Tous droits réservés</p>
          <p className="mt-2 text-xs">
            Libero est un outil de soutien et ne remplace pas un professionnel de santé.
            En cas de détresse, contactez le{" "}
            <a href="tel:3114" className="underline">3114</a>.
          </p>
        </div>
      </footer>
    </div>
  );
}
