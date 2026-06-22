import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Flame,
  MessageCircle,
  BookOpen,
  Map,
  AlertTriangle,
  TrendingUp,
  CheckCircle,
  Plus,
} from "lucide-react";

function computeStreakDays(startDate: string): number {
  const start = new Date(startDate);
  const now = new Date();
  const diff = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
  });
}

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth?next=/dashboard");

  const [
    { data: profile },
    { data: streaks },
    { data: recentEntries },
    { data: plan },
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("streaks").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
    supabase.from("journal_entries").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(3),
    supabase.from("plans").select("*").eq("user_id", user.id).eq("active", true).order("created_at", { ascending: false }).limit(1).single(),
  ]);

  const activeStreak = streaks?.find((s) => s.active);
  const currentDays = activeStreak ? computeStreakDays(activeStreak.start_date) : 0;
  const bestStreak = streaks ? Math.max(...streaks.map((s) => s.days || 0), currentDays) : currentDays;

  const firstName = profile?.full_name?.split(" ")[0] || user.email?.split("@")[0] || "toi";

  const planContent = plan?.content as {
    weeks?: Array<{ week: number; theme: string; objective: string; actions: Array<{ title: string; completed: boolean }> }>
  } | null;

  const currentWeek = planContent?.weeks?.[0];
  const completedActions = currentWeek?.actions?.filter((a) => a.completed).length ?? 0;
  const totalActions = currentWeek?.actions?.length ?? 0;

  const isTrialEnded =
    profile?.subscription_status === "trial" &&
    profile?.trial_ends_at &&
    new Date(profile.trial_ends_at) < new Date();

  return (
    <div className="min-h-screen bg-secondary/20 p-8">
      {/* Trial banner */}
      {isTrialEnded && (
        <div className="mb-6 rounded-xl bg-destructive/10 border border-destructive/20 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
            <p className="text-sm font-medium">
              Ton essai gratuit est terminé. Souscris pour continuer à accéder à Libero.
            </p>
          </div>
          <Link href="/pricing">
            <Button size="sm" variant="destructive">
              S&apos;abonner
            </Button>
          </Link>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Bonjour, {firstName} 👋</h1>
        <p className="mt-1 text-muted-foreground text-sm">
          {currentDays > 0
            ? `Tu es en streak depuis ${currentDays} jour${currentDays > 1 ? "s" : ""}. Continue comme ça !`
            : "Lance ton premier jour de streak aujourd'hui."}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Streak card */}
        <Card className="p-6 col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Streak actuel
            </h2>
            <Flame className="h-5 w-5 text-orange-500" />
          </div>
          <div className="text-center py-4">
            <div className="text-6xl mb-2">
              {currentDays > 0 ? "🔥" : "💪"}
            </div>
            <div className="text-5xl font-bold text-foreground">{currentDays}</div>
            <div className="text-muted-foreground text-sm mt-1">
              jour{currentDays !== 1 ? "s" : ""} consécutif{currentDays !== 1 ? "s" : ""}
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              Meilleur streak : <span className="font-semibold text-foreground">{bestStreak} j</span>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {!activeStreak ? (
              <form action="/api/streak" method="POST">
                <Button className="w-full gap-2" type="submit">
                  <Plus className="h-4 w-4" />
                  Démarrer mon streak
                </Button>
              </form>
            ) : (
              <Link href="/coach?context=relapse">
                <Button variant="outline" size="sm" className="w-full text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive">
                  <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
                  J&apos;ai rechuté
                </Button>
              </Link>
            )}
          </div>
        </Card>

        {/* Quick actions */}
        <Card className="p-6 col-span-1 lg:col-span-2">
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4">
            Actions rapides
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/coach">
              <div className="flex items-center gap-4 rounded-xl border border-border bg-primary/5 p-4 hover:bg-primary/10 transition-colors cursor-pointer">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <MessageCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-sm">Parler à mon coach</div>
                  <div className="text-xs text-muted-foreground">Craving, rechute, questions...</div>
                </div>
              </div>
            </Link>

            <Link href="/journal?new=1">
              <div className="flex items-center gap-4 rounded-xl border border-border bg-secondary p-4 hover:bg-secondary/80 transition-colors cursor-pointer">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                  <BookOpen className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <div className="font-semibold text-sm">Journal du jour</div>
                  <div className="text-xs text-muted-foreground">Notez une situation ou craving</div>
                </div>
              </div>
            </Link>

            <Link href="/plan">
              <div className="flex items-center gap-4 rounded-xl border border-border bg-accent/5 p-4 hover:bg-accent/10 transition-colors cursor-pointer">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                  <Map className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <div className="font-semibold text-sm">Mon plan</div>
                  <div className="text-xs text-muted-foreground">
                    {totalActions > 0
                      ? `${completedActions}/${totalActions} actions S1`
                      : "Voir mon plan 4 semaines"}
                  </div>
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-4 rounded-xl border border-border bg-secondary p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                <TrendingUp className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <div className="font-semibold text-sm">Progression</div>
                <div className="text-xs text-muted-foreground">
                  {bestStreak > 0 ? `${bestStreak} jours au meilleur` : "Commencer aujourd'hui"}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Weekly plan preview */}
        {currentWeek && (
          <Card className="p-6 col-span-1 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Semaine 1 — {currentWeek.theme}
              </h2>
              <Badge variant="secondary">{completedActions}/{totalActions}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{currentWeek.objective}</p>
            <div className="space-y-2">
              {currentWeek.actions.slice(0, 3).map((action, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <CheckCircle className={`h-4 w-4 mt-0.5 shrink-0 ${action.completed ? "text-accent" : "text-muted-foreground"}`} />
                  <span className={action.completed ? "line-through text-muted-foreground" : ""}>{action.title}</span>
                </div>
              ))}
            </div>
            <Link href="/plan" className="mt-4 block">
              <Button variant="outline" size="sm" className="w-full">
                Voir tout le plan
              </Button>
            </Link>
          </Card>
        )}

        {/* Recent journal */}
        <Card className="p-6 col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Journal récent
            </h2>
            <Link href="/journal" className="text-xs text-primary hover:underline">
              Tout voir
            </Link>
          </div>
          {recentEntries && recentEntries.length > 0 ? (
            <div className="space-y-3">
              {recentEntries.map((entry) => (
                <div key={entry.id} className="rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>{formatDate(entry.created_at)}</span>
                    <Badge variant={entry.resisted ? "default" : "destructive"} className="text-xs py-0">
                      {entry.resisted ? "Résisté ✓" : "Rechute"}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium truncate">{entry.emotion}</p>
                  <p className="text-xs text-muted-foreground truncate">{entry.situation}</p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <div className="h-1.5 flex-1 rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-orange-400"
                        style={{ width: `${(entry.craving_level / 10) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{entry.craving_level}/10</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Aucune entrée pour l&apos;instant</p>
              <Link href="/journal?new=1">
                <Button variant="outline" size="sm" className="mt-3">
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Ajouter
                </Button>
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
