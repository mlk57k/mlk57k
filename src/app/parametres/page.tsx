"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, LogOut, BellRing, SunMoon, CreditCard, Target, Clock, ChevronDown, Lock } from "lucide-react";
import { pushSupported, subscribeToPush, unsubscribeFromPush, isPushSubscribed } from "@/lib/push-client";
import { ThemeToggle } from "@/components/theme-toggle";
import { AppLogo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  free: "Formule gratuite (10 confidences offertes)",
  trialing: "Essai gratuit en cours",
  active: "Abonnement actif",
  past_due: "Paiement en retard",
  canceled: "Abonnement annulé",
};

/* Bloc de paramètre repliable : on ne voit que le titre, on tape pour déplier
   tout le détail. Un seul bloc peut rester ouvert à la fois (accordéon). */
function SettingsSection({
  id,
  title,
  icon,
  openId,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  icon: React.ReactNode;
  openId: string | null;
  onToggle: (id: string) => void;
  children: React.ReactNode;
}) {
  const open = openId === id;
  return (
    <Card className="overflow-hidden">
      <button
        type="button"
        onClick={() => onToggle(id)}
        aria-expanded={open}
        className="w-full flex items-center gap-3 px-5 sm:px-6 py-5 text-left transition-colors hover:bg-cream-100/70"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cream-100 text-coral-400">
          {icon}
        </span>
        <span className="font-display text-lg font-bold text-stone-900 flex-1">{title}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-stone-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-cream-200">{children}</div>
        </div>
      </div>
    </Card>
  );
}

export default function ParametresPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderHour, setReminderHour] = useState(20);
  const [saving, setSaving] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);
  const [pushAvailable, setPushAvailable] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushBusy, setPushBusy] = useState(false);
  const [pushMessage, setPushMessage] = useState<string | null>(null);

  function toggleSection(id: string) {
    setOpenId((cur) => (cur === id ? null : id));
  }

  useEffect(() => {
    setPushAvailable(pushSupported());
    isPushSubscribed().then(setPushEnabled);
  }, []);

  async function handlePushToggle() {
    setPushBusy(true);
    setPushMessage(null);
    try {
      if (pushEnabled) {
        await unsubscribeFromPush();
        setPushEnabled(false);
        setPushMessage("Notifications désactivées sur cet appareil.");
      } else {
        const result = await subscribeToPush();
        if (result.ok) {
          setPushEnabled(true);
          setPushMessage("Notifications activées sur cet appareil 🎉");
        } else if (result.error === "denied") {
          setPushMessage("Tu as refusé les notifications. Autorise-les dans les réglages de ton navigateur.");
        } else if (result.error === "unsupported") {
          setPushMessage("Cet appareil ne supporte pas les notifications push.");
        } else {
          setPushMessage("Activation impossible. Réessaie dans un instant.");
        }
      }
    } finally {
      setPushBusy(false);
    }
  }

  async function handlePushTest() {
    setPushBusy(true);
    setPushMessage(null);
    try {
      const res = await fetch("/api/push/test", { method: "POST" });
      setPushMessage(res.ok ? "Notification envoyée — regarde ton écran !" : "Envoi impossible. Active d'abord les notifications.");
    } finally {
      setPushBusy(false);
    }
  }

  async function handleSignOut() {
    setSigningOut(true);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      await createClient().auth.signOut();
    } finally {
      router.replace("/auth");
    }
  }

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
        setReminderEnabled(data.reminder_enabled);
        setReminderHour(data.reminder_hour);
      }
    })();
  }, [router]);

  async function handleSaveReminder() {
    setSaving(true);
    setMessage(null);
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase
      .from("profiles")
      .update({ reminder_enabled: reminderEnabled, reminder_hour: reminderHour })
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
  const objectifs = (profile.objectifs ?? "").trim();

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

      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-12 space-y-3">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 mb-2">Paramètres</h1>
        <p className="text-sm text-stone-500 pb-3">Tape sur un bloc pour l&apos;ouvrir et voir le détail.</p>

        {/* Mon abonnement */}
        <SettingsSection id="abonnement" title="Mon abonnement" icon={<CreditCard className="h-4 w-4" />} openId={openId} onToggle={toggleSection}>
          <div className="space-y-4 pt-4">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wide text-stone-400">Compte</p>
              <p className="text-sm font-medium text-stone-800 break-all">{profile.email}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wide text-stone-400">Formule</p>
              <p className="text-sm font-medium text-stone-800">{PLAN_LABELS[profile.plan_status] ?? profile.plan_status}</p>
              {profile.current_period_end && (
                <p className="text-sm text-stone-500">
                  {profile.cancel_at_period_end ? "Accès jusqu'au " : "Prochain renouvellement le "}
                  {new Date(profile.current_period_end).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}.
                </p>
              )}
            </div>

            {!hasSubscription && (
              <div className="rounded-2xl bg-cream-100 border border-cream-200 p-4 space-y-3">
                <p className="text-sm text-stone-600">
                  Débloque les confidences illimitées, l&apos;historique complet et les analyses de ton coach.
                </p>
                <Button asChild className="w-full sm:w-auto">
                  <Link href="/paywall">Passer à l&apos;illimité</Link>
                </Button>
              </div>
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
          </div>
        </SettingsSection>

        {/* Mes objectifs — définis à la première configuration, non modifiables ensuite */}
        <SettingsSection id="objectifs" title="Mes objectifs" icon={<Target className="h-4 w-4" />} openId={openId} onToggle={toggleSection}>
          <div className="space-y-3 pt-4">
            <p className="text-sm text-stone-500">
              Ce que tu cherches à travailler — le coach en tient compte dans ses réponses.
            </p>
            {objectifs ? (
              <div className="rounded-2xl bg-cream-100 border border-cream-200 p-4">
                <p className="text-sm text-stone-700 whitespace-pre-wrap">{objectifs}</p>
              </div>
            ) : (
              <div className="rounded-2xl bg-cream-100 border border-cream-200 p-4">
                <p className="text-sm text-stone-500 italic">Aucun objectif défini lors de ta configuration.</p>
              </div>
            )}
            <p className="flex items-center gap-1.5 text-xs text-stone-400">
              <Lock className="h-3.5 w-3.5" />
              Défini à ta première configuration — non modifiable ensuite.
            </p>
          </div>
        </SettingsSection>

        {/* Rappel quotidien */}
        <SettingsSection id="rappel" title="Rappel quotidien" icon={<Clock className="h-4 w-4" />} openId={openId} onToggle={toggleSection}>
          <div className="space-y-4 pt-4">
            <p className="text-sm text-stone-500">
              Un e-mail doux pour te rappeler d&apos;écrire, seulement si tu n&apos;as pas encore journalisé ce jour-là.
            </p>
            <div className="flex items-center gap-4">
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
            </div>
            <Button disabled={saving} onClick={handleSaveReminder} size="sm">
              {saving ? "Enregistrement…" : "Enregistrer"}
            </Button>
            {message && <p className="text-sm text-stone-500">{message}</p>}
          </div>
        </SettingsSection>

        {/* Apparence */}
        <SettingsSection id="apparence" title="Apparence" icon={<SunMoon className="h-4 w-4" />} openId={openId} onToggle={toggleSection}>
          <div className="space-y-3 pt-4">
            <p className="text-sm text-stone-500">
              Choisis le thème de l&apos;app. « Auto » suit le réglage clair/sombre de ton téléphone.
            </p>
            <ThemeToggle />
          </div>
        </SettingsSection>

        {/* Notifications push */}
        <SettingsSection id="push" title="Notifications push" icon={<BellRing className="h-4 w-4" />} openId={openId} onToggle={toggleSection}>
          <div className="space-y-4 pt-4">
            <p className="text-sm text-stone-500">
              Reçois ton rappel du soir directement sur cet appareil.
              {!pushAvailable && " Sur iPhone : installe d'abord l'app sur ton écran d'accueil (Safari → Partager → Sur l'écran d'accueil) puis ouvre-la."}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button disabled={!pushAvailable || pushBusy} onClick={handlePushToggle} variant={pushEnabled ? "outline" : "default"}>
                {pushBusy ? "Un instant…" : pushEnabled ? "Désactiver sur cet appareil" : "Activer sur cet appareil"}
              </Button>
              {pushEnabled && (
                <Button variant="ghost" disabled={pushBusy} onClick={handlePushTest}>
                  Envoyer un test
                </Button>
              )}
              {pushMessage && <p className="text-sm text-stone-500 w-full">{pushMessage}</p>}
            </div>
          </div>
        </SettingsSection>

        <div className="flex items-center justify-end pt-2">
          <Link href="/confidentialite-des-donnees" className="text-sm text-stone-500 hover:text-stone-900 underline">
            Mes données &amp; export
          </Link>
        </div>

        <div className="pt-4 border-t border-cream-200">
          <Button variant="outline" disabled={signingOut} onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            {signingOut ? "Déconnexion…" : "Se déconnecter"}
          </Button>
        </div>
      </main>
    </div>
  );
}
