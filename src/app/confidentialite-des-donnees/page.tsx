"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, FileText, Trash2, Check, X, ShieldCheck, BookOpen } from "lucide-react";
import { AppLogo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { SettingsSection } from "@/components/settings-section";

const KEPT = [
  "Le texte de tes entrées de journal et tes échanges avec le coach.",
  "Tes scores d'humeur et tes bilans hebdomadaires.",
  "Ton adresse e-mail et les informations de ton abonnement.",
];

const NEVER = [
  "Tes notes vocales brutes — supprimées dès qu'elles sont transcrites.",
  "Aucune donnée n'est jamais utilisée pour entraîner un modèle d'IA.",
  "Rien n'est vendu ni partagé avec des annonceurs.",
];

export default function DataPrivacyPage() {
  const router = useRouter();
  const [openId, setOpenId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [entryCount, setEntryCount] = useState<number | null>(null);

  function toggleSection(id: string) {
    setOpenId((cur) => (cur === id ? null : id));
  }

  useEffect(() => {
    (async () => {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/auth?next=/confidentialite-des-donnees");
        return;
      }
      const { count } = await supabase
        .from("journal_entries")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id);
      setEntryCount(count ?? 0);
    })();
  }, [router]);

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch("/api/account/delete", { method: "POST" });
      if (!res.ok) throw new Error();
      const { createClient } = await import("@/lib/supabase/client");
      await createClient().auth.signOut();
      window.location.assign("/");
    } catch {
      setError("La suppression a échoué. Réessaie ou contacte-nous à contact@ancrage.xyz.");
      setDeleting(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <header className="sticky top-0 z-40 border-b border-cream-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/"><AppLogo size="md" /></Link>
          <Link href="/parametres" className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-900 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            Paramètres
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-12 space-y-3">
        <div className="mb-2">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 mb-2">Mes données &amp; export</h1>
          <p className="text-sm text-stone-500">
            Tape sur un bloc pour l&apos;ouvrir et voir le détail.
          </p>
        </div>

        {/* Ce que nous conservons */}
        <SettingsSection id="conservation" title="Ce que nous conservons" icon={<ShieldCheck className="h-4 w-4" />} openId={openId} onToggle={toggleSection}>
          <div className="space-y-6 pt-4">
            <p className="text-sm text-stone-500">Tout ce qu&apos;Ancrage sait sur toi — et ce que nous ne faisons jamais.</p>
            <ul className="space-y-3">
              {KEPT.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-stone-600">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <ul className="space-y-3">
              {NEVER.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-stone-600">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cream-200 text-stone-400">
                    <X className="h-3.5 w-3.5" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </SettingsSection>

        {/* Exporter mon journal */}
        <SettingsSection id="export" title="Exporter mon journal" icon={<Download className="h-4 w-4" />} openId={openId} onToggle={toggleSection}>
          <div className="space-y-4 pt-4">
            <p className="text-sm text-stone-500">
              Toutes tes entrées, à toi, dans le format que tu préfères. Disponible à tout moment.
            </p>
            <div className="flex items-center gap-3 rounded-2xl bg-cream-100 border border-cream-200 p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-coral-400">
                <BookOpen className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-stone-800">
                  {entryCount === null
                    ? "Chargement…"
                    : entryCount === 0
                      ? "Aucune entrée pour l'instant"
                      : `${entryCount} ${entryCount > 1 ? "entrées enregistrées" : "entrée enregistrée"}`}
                </p>
                <p className="text-xs text-stone-500">Prêtes à être téléchargées quand tu veux.</p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Button asChild variant="secondary" className="w-full justify-start h-auto py-3 whitespace-normal">
                <a href="/api/export?format=pdf" download>
                  <FileText className="h-5 w-5 shrink-0" />
                  <span className="flex min-w-0 flex-1 flex-col items-start leading-tight">
                    <span className="font-semibold">Télécharger en PDF</span>
                    <span className="text-xs font-normal text-stone-500 break-words">Mise en page soignée, à relire ou imprimer.</span>
                  </span>
                </a>
              </Button>
              <Button asChild variant="secondary" className="w-full justify-start h-auto py-3 whitespace-normal">
                <a href="/api/export?format=txt" download>
                  <Download className="h-5 w-5 shrink-0" />
                  <span className="flex min-w-0 flex-1 flex-col items-start leading-tight">
                    <span className="font-semibold">Télécharger en .txt</span>
                    <span className="text-xs font-normal text-stone-500 break-words">Texte brut, pour l&apos;archiver ou le réutiliser.</span>
                  </span>
                </a>
              </Button>
            </div>
          </div>
        </SettingsSection>

        {/* Supprimer mon compte */}
        <SettingsSection id="suppression" title="Supprimer mon compte" icon={<Trash2 className="h-4 w-4" />} openId={openId} onToggle={toggleSection}>
          <div className="space-y-4 pt-4">
            <p className="text-sm text-stone-500">
              Action définitive et immédiate : ton compte, tes entrées et tes bilans sont
              effacés sans délai. Pense à exporter ton journal avant si tu veux le garder.
            </p>
            {error && <p className="text-sm text-coral-500">{error}</p>}
            {!confirmDelete ? (
              <Button
                variant="outline"
                className="flex w-full h-auto min-h-11 py-3 whitespace-normal break-words leading-snug text-center border-coral-300 text-coral-400 hover:bg-coral-500/10"
                onClick={() => setConfirmDelete(true)}
              >
                <Trash2 className="h-4 w-4 shrink-0" />
                Supprimer définitivement mon compte
              </Button>
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-sm font-medium text-stone-700">Tu es sûr·e ? C&apos;est irréversible.</p>
                <Button variant="default" disabled={deleting} onClick={handleDelete}>
                  {deleting ? "Suppression…" : "Oui, supprimer"}
                </Button>
                <Button variant="ghost" disabled={deleting} onClick={() => setConfirmDelete(false)}>
                  Annuler
                </Button>
              </div>
            )}
          </div>
        </SettingsSection>

        <p className="text-center text-xs text-stone-400 pt-4">
          Une question sur tes données ? Écris-nous à{" "}
          <a href="mailto:contact@ancrage.xyz" className="underline hover:text-stone-600">contact@ancrage.xyz</a>.
        </p>
      </main>
    </div>
  );
}
