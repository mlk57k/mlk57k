"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, FileText, Trash2, Check, X, ShieldCheck, BookOpen } from "lucide-react";
import { AppLogo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

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
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [entryCount, setEntryCount] = useState<number | null>(null);

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

      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-12 space-y-6">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-cream-100 border border-cream-200 px-3 py-1 text-xs font-medium text-stone-500 mb-4">
            <ShieldCheck className="h-3.5 w-3.5 text-coral-400" />
            Tes données t&apos;appartiennent
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 mb-2">Mes données &amp; export</h1>
          <p className="text-stone-500">
            Tout ce qu&apos;Ancrage sait sur toi, et un contrôle total dessus — sans avoir à nous écrire.
          </p>
        </div>

        {/* Ce que nous conservons / ne conservons jamais */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ce que nous conservons</CardTitle>
            <CardDescription>Et ce que nous ne faisons jamais.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
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
          </CardContent>
        </Card>

        {/* Export */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Exporter mon journal</CardTitle>
            <CardDescription>
              Toutes tes entrées, à toi, dans le format que tu préfères. Disponible à tout moment.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 rounded-2xl bg-cream-100 border border-cream-200 p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-coral-400">
                <BookOpen className="h-5 w-5" />
              </span>
              <div>
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
              <Button asChild variant="secondary" className="w-full justify-start h-auto py-3">
                <a href="/api/export?format=pdf" download>
                  <FileText className="h-5 w-5" />
                  <span className="flex flex-col items-start leading-tight">
                    <span className="font-semibold">Télécharger en PDF</span>
                    <span className="text-xs font-normal text-stone-500">Mise en page soignée, à relire ou imprimer.</span>
                  </span>
                </a>
              </Button>
              <Button asChild variant="secondary" className="w-full justify-start h-auto py-3">
                <a href="/api/export?format=txt" download>
                  <Download className="h-5 w-5" />
                  <span className="flex flex-col items-start leading-tight">
                    <span className="font-semibold">Télécharger en .txt</span>
                    <span className="text-xs font-normal text-stone-500">Texte brut, pour l&apos;archiver ou le réutiliser.</span>
                  </span>
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Zone dangereuse */}
        <Card className="border-coral-200 bg-coral-50/40">
          <CardHeader>
            <CardTitle className="text-lg text-coral-600 flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Supprimer mon compte
            </CardTitle>
            <CardDescription>
              Action définitive et immédiate : ton compte, tes entrées et tes bilans sont
              effacés sans délai. Pense à exporter ton journal avant si tu veux le garder.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && <p className="text-sm text-coral-500 mb-3">{error}</p>}
            {!confirmDelete ? (
              <Button variant="outline" className="border-coral-300 text-coral-600 hover:bg-coral-100" onClick={() => setConfirmDelete(true)}>
                <Trash2 className="h-4 w-4" />
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
          </CardContent>
        </Card>

        <p className="text-center text-xs text-stone-400 pt-2">
          Une question sur tes données ? Écris-nous à{" "}
          <a href="mailto:contact@ancrage.xyz" className="underline hover:text-stone-600">contact@ancrage.xyz</a>.
        </p>
      </main>
    </div>
  );
}
