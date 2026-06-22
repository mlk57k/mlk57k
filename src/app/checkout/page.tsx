"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, ShieldCheck, Sparkles, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "monthly" }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error ?? "Une erreur est survenue.");
        setLoading(false);
      }
    } catch {
      setError("Impossible de créer la session de paiement.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-secondary/20">
      <header className="flex h-16 items-center justify-center border-b border-border bg-white px-4">
        <Link href="/" className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="text-lg font-bold">Libero</span>
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Commencer ton parcours</h1>
            <p className="mt-2 text-muted-foreground text-sm">
              7 jours gratuits, puis 9,99€/mois. Annule quand tu veux.
            </p>
          </div>

          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="font-semibold">Libero — Abonnement mensuel</div>
                <div className="text-sm text-muted-foreground">Accès complet à toutes les fonctionnalités</div>
              </div>
              <div className="text-right">
                <div className="font-bold">9,99€</div>
                <div className="text-xs text-muted-foreground">/mois</div>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              {[
                "7 jours d'essai gratuit",
                "Coach IA illimité",
                "Suivi streak & journal",
                "Plan personnalisé 4 semaines",
                "Annulation en 1 clic",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-accent shrink-0" />
                  {item}
                </div>
              ))}
            </div>

            {error && (
              <p className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </p>
            )}

            <Button
              size="lg"
              className="w-full gap-2"
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Commencer l&apos;essai gratuit
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5" />
              Paiement sécurisé par Stripe
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
