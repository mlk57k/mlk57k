"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AppLogo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface Profile {
  email: string;
  plan_status: string;
  plan_interval: "week" | "month" | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  objectifs: string | null;
  reminder_enabled: boolean;
  reminder_hour: number;
}

const PLAN_LABELS: Record<string, string> = {
  free: "Formule gratuite (3 entrées / semaine)",
  trialing: "Essai gratuit en cours",
  active: "Abonnement actif",
  past_due: "Paiement en retard",
  canceled: "Abonnement annulé",
};

export default function ParametresPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [objectifs, setObjectifs] = useState("");
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderHour, setReminderHour] = useState(20);
  const [saving, setSaving] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/auth?next=/parametres");
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("email, plan_status, plan_interval, current_period_end, cancel_at_period_end, objectifs, reminder_enabled, reminder_hour")
        .eq("id", user.id)
        .single();
      if (data) {
        setProfile(data);
        setObjectifs(data.objectifs ?? "");
        setReminderEnabled(data.reminder_enabled);
        setReminderHour(data.reminder_hour);
      }
    })();
  }, [router]);

  async function handleSavePreferences() {
    setSaving(true);
    setMessage(null);
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase
      .from("profiles")
      .update({ objectifs, reminder_enabled: reminderEnabled, reminder_hour: reminderHour })
      .eq("id", user.id);
    setSaving(false);
    setMessage("Préférences enregistrées.");
  }

  async function handleCancelSubscription() {
    setCanceling(true);
    setMessage(null);
    try {
      const res = await fetch("/api/account/cancel-subscription", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur inconnue.");
      setProfile((p) => (p ? { ...p, cancel_at_period_end: true } : p));
      setMessage("Ton abonnement ne sera plus renouvelé. Un e-mail de confirmation t'a été envoyé.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "L'annulation a échoué.");
    } finally {
      setCanceling(false);
      setConfirmCancel(false);
    }
  }

  if (!profile) {
    return <div className="min-h-screen bg-cream-50" />;
  }

  const hasSubscription = profile.plan_status === "active" || profile.plan_status === "trialing";

  return (
    <div className="min-h-screen bg-cream-50">
      <header className="sticky top-0 z-40 border-b border-cream-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/journal"><AppLogo size="md" /></Link>
          <Link href="/journal" className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-900 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            Mon journal
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-12 space-y-6">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 mb-2">Paramètres</h1>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Mon abonnement</CardTitle>
            <CardDescription>{profile.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-stone-600">{PLAN_LABELS[profile.plan_status] ?? profile.plan_status}</p>
            {profile.current_period_end && (
              <p className="text-sm text-stone-500">
                {profile.cancel_at_period_end ? "Accès jusqu'au " : "Prochain renouvellement le "}
                {new Date(profile.current_period_end).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}.
              </p>
            )}

            {!hasSubscription && (
              <Button asChild>
                <Link href="/abonnement">Passer à l&apos;illimité</Link>
              </Button>
            )}

            {hasSubscription && !profile.cancel_at_period_end && !confirmCancel && (
              <Button variant="outline" onClick={() => setConfirmCancel(true)}>
                Annuler mon abonnement
              </Button>
            )}

            {hasSubscription && confirmCancel && (
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-sm font-medium text-stone-700">
                  Confirmer ? Tu gardes l&apos;accès jusqu&apos;à la fin de la période payée, sans
                  prélèvement supplémentaire.
                </p>
                <Button disabled={canceling} onClick={handleCancelSubscription}>
                  {canceling ? "Annulation…" : "Oui, annuler"}
                </Button>
                <Button variant="ghost" disabled={canceling} onClick={() => setConfirmCancel(false)}>
                  Retour
                </Button>
              </div>
            )}

            {hasSubscription && profile.cancel_at_period_end && (
              <p className="text-sm text-coral-500">
                Ton abonnement ne sera pas renouvelé. Tu peux te réabonner à tout moment.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Mes objectifs</CardTitle>
            <CardDescription>Ce que tu cherches à travailler — le coach en tient compte dans ses réponses.</CardDescription>
          </CardHeader>
          <CardContent>
            <textarea
              value={objectifs}
              onChange={(e) => setObjectifs(e.target.value)}
              rows={4}
              placeholder="Ex. : mieux gérer mon stress au travail, être plus indulgent·e avec moi-même…"
              className="w-full rounded-xl border border-cream-200 bg-white p-3 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-coral-400/40"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Rappel quotidien</CardTitle>
            <CardDescription>Un e-mail doux pour te rappeler d&apos;écrire, seulement si tu n&apos;as pas encore journalisé ce jour-là.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <Checkbox checked={reminderEnabled} onCheckedChange={(v) => setReminderEnabled(v === true)} id="reminder" />
            <label htmlFor="reminder" className="text-sm text-stone-600">Recevoir un rappel</label>
            {reminderEnabled && (
              <select
                value={reminderHour}
                onChange={(e) => setReminderHour(Number(e.target.value))}
                className="ml-auto rounded-lg border border-cream-200 bg-white px-3 py-1.5 text-sm text-stone-700"
              >
                {Array.from({ length: 24 }, (_, h) => (
                  <option key={h} value={h}>{h}h00</option>
                ))}
              </select>
            )}
          </CardContent>
        </Card>

        {message && <p className="text-sm text-stone-600">{message}</p>}

        <div className="flex items-center justify-between">
          <Button disabled={saving} onClick={handleSavePreferences}>
            {saving ? "Enregistrement…" : "Enregistrer"}
          </Button>
          <Link href="/confidentialite-des-donnees" className="text-sm text-stone-500 hover:text-stone-900 underline">
            Mes données &amp; export
          </Link>
        </div>
      </main>
    </div>
  );
}
