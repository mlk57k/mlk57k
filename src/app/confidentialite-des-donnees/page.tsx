"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, FileText, Trash2 } from "lucide-react";
import { AppLogo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function DataPrivacyPage() {
  const router = useRouter();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { createClient } = await import("@/lib/supabase/client");
      const { data: { user } } = await createClient().auth.getUser();
      if (!user) router.replace("/auth?next=/confidentialite-des-donnees");
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
      setError("La suppression a échoué. Réessaie ou contacte-nous à hello@ancrage.app.");
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

      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 mb-2">Mes données</h1>
        <p className="text-stone-500 mb-10">
          Tout ce qu&apos;Ancrage sait sur toi, et un contrôle total dessus — sans avoir à nous écrire.
        </p>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Ce que nous conservons</CardTitle>
            <CardDescription>Et ce que nous ne conservons jamais.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-stone-600">
            <p>✓ Le texte de tes entrées de journal et tes échanges avec le coach.</p>
            <p>✓ Tes scores d&apos;humeur et tes bilans hebdomadaires.</p>
            <p>✓ Ton adresse e-mail et les informations de ton abonnement.</p>
            <p>✗ Tes notes vocales brutes — supprimées dès qu&apos;elles sont transcrites en texte.</p>
            <p>✗ Aucune donnée n&apos;est jamais utilisée pour entraîner un modèle d&apos;IA.</p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Exporter mon journal</CardTitle>
            <CardDescription>Toutes tes entrées, dans le format que tu préfères. Disponible à tout moment.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button asChild variant="secondary">
              <a href="/api/export?format=pdf" download>
                <FileText className="h-4 w-4" />
                Télécharger en PDF
              </a>
            </Button>
            <Button asChild variant="secondary">
              <a href="/api/export?format=txt" download>
                <Download className="h-4 w-4" />
                Télécharger en .txt
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-coral-200">
          <CardHeader>
            <CardTitle className="text-lg">Supprimer mon compte</CardTitle>
            <CardDescription>
              Action définitive et immédiate : ton compte, tes entrées et tes bilans sont
              effacés sans délai. Pense à exporter ton journal avant si tu veux le garder.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && <p className="text-sm text-coral-500 mb-3">{error}</p>}
            {!confirmDelete ? (
              <Button variant="outline" onClick={() => setConfirmDelete(true)}>
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
      </main>
    </div>
  );
}
