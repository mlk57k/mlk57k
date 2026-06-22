"use client";

import { useEffect, useState } from "react";
import { Loader2, User, CreditCard, Shield, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Profile {
  email: string;
  full_name: string;
  addiction_type: string;
  severity: string;
  subscription_status: string;
  trial_ends_at: string;
  created_at: string;
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => setProfile(data.profile))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const openPortal = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/account/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setPortalLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const addictionLabel =
    profile?.addiction_type === "cannabis"
      ? "Cannabis"
      : profile?.addiction_type === "porn"
      ? "Pornographie"
      : profile?.addiction_type === "both"
      ? "Cannabis & Pornographie"
      : "Non défini";

  const severityLabel =
    profile?.severity === "light"
      ? "Légère"
      : profile?.severity === "moderate"
      ? "Modérée"
      : profile?.severity === "severe"
      ? "Sévère"
      : "Non défini";

  const statusConfig = {
    trial: { label: "Essai gratuit", variant: "secondary" as const },
    active: { label: "Actif", variant: "default" as const },
    cancelled: { label: "Annulé", variant: "destructive" as const },
    past_due: { label: "Paiement en retard", variant: "destructive" as const },
  };

  const status = statusConfig[profile?.subscription_status as keyof typeof statusConfig] ?? {
    label: profile?.subscription_status ?? "Inconnu",
    variant: "secondary" as const,
  };

  const trialEnds = profile?.trial_ends_at
    ? new Date(profile.trial_ends_at).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen bg-secondary/20 p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Paramètres</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gérez votre compte et votre abonnement
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Profile */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <User className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-semibold">Profil</h2>
          </div>
          <dl className="space-y-3">
            <div className="flex justify-between text-sm">
              <dt className="text-muted-foreground">Email</dt>
              <dd className="font-medium">{profile?.email}</dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-muted-foreground">Membre depuis</dt>
              <dd className="font-medium">
                {profile?.created_at
                  ? new Date(profile.created_at).toLocaleDateString("fr-FR", {
                      month: "long",
                      year: "numeric",
                    })
                  : "—"}
              </dd>
            </div>
          </dl>
        </Card>

        {/* Addiction profile */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-semibold">Profil d&apos;addiction</h2>
          </div>
          <dl className="space-y-3">
            <div className="flex justify-between text-sm">
              <dt className="text-muted-foreground">Type d&apos;addiction</dt>
              <dd className="font-medium">{addictionLabel}</dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-muted-foreground">Niveau de sévérité</dt>
              <dd>
                <Badge
                  variant={
                    profile?.severity === "severe"
                      ? "destructive"
                      : profile?.severity === "moderate"
                      ? "secondary"
                      : "default"
                  }
                >
                  {severityLabel}
                </Badge>
              </dd>
            </div>
          </dl>
        </Card>

        {/* Subscription */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-semibold">Abonnement</h2>
          </div>
          <dl className="space-y-3 mb-6">
            <div className="flex justify-between text-sm items-center">
              <dt className="text-muted-foreground">Statut</dt>
              <dd>
                <Badge variant={status.variant}>{status.label}</Badge>
              </dd>
            </div>
            {profile?.subscription_status === "trial" && trialEnds && (
              <div className="flex justify-between text-sm">
                <dt className="text-muted-foreground">Fin d&apos;essai</dt>
                <dd className="font-medium">{trialEnds}</dd>
              </div>
            )}
            {profile?.subscription_status === "active" && (
              <div className="flex justify-between text-sm">
                <dt className="text-muted-foreground">Plan</dt>
                <dd className="font-medium">9,99€ / mois</dd>
              </div>
            )}
          </dl>

          {profile?.subscription_status === "trial" && (
            <Button asChild className="w-full gap-2">
              <a href="/pricing">
                <CreditCard className="h-4 w-4" />
                S&apos;abonner — 9,99€/mois
              </a>
            </Button>
          )}

          {profile?.subscription_status === "active" && (
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={openPortal}
              disabled={portalLoading}
            >
              {portalLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ExternalLink className="h-4 w-4" />
              )}
              Gérer mon abonnement
            </Button>
          )}

          {profile?.subscription_status === "cancelled" && (
            <Button asChild className="w-full gap-2">
              <a href="/pricing">
                Réactiver mon abonnement
              </a>
            </Button>
          )}
        </Card>

        {/* Disclaimer */}
        <div className="rounded-xl bg-secondary p-4 text-sm text-muted-foreground">
          <p>
            <strong>Avertissement :</strong> Libero est un outil de soutien et ne remplace pas
            un accompagnement médical ou psychologique professionnel. En cas de difficulté
            importante, consultez un professionnel de santé.
          </p>
          <p className="mt-2">
            En cas de détresse psychologique, appelez le{" "}
            <a href="tel:3114" className="underline font-medium">3114</a>{" "}
            (disponible 24h/24).
          </p>
        </div>
      </div>
    </div>
  );
}
