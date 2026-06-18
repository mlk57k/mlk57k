import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Stub protégé — historique + graphique d'évolution à l'étape 6.
// La protection est aussi assurée par le middleware ; double garde côté serveur.
export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth?next=/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-glowy flex flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-bold">Ton espace (étape 6)</h1>
      <p className="text-muted-foreground text-sm">
        Connecté en tant que {user.email}
      </p>
      <p className="text-muted-foreground text-sm max-w-xs">
        Historique des scans et graphique d&apos;évolution du score arrivent ici.
      </p>
      <Link href="/scan" className="text-coral-500 font-semibold underline">
        Nouveau scan
      </Link>
    </div>
  );
}
