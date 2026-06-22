"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

function AuthForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const next = searchParams.get("next") ?? "/dashboard";
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "login";

  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const supabase = createClient();
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/auth/complete?next=" + encodeURIComponent(next));
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.session) {
          router.push("/auth/complete?next=" + encodeURIComponent(next));
        } else {
          setMessage("Vérifie tes emails pour confirmer ton compte, puis reviens te connecter.");
          setLoading(false);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? translateError(err.message) : "Une erreur est survenue.");
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) throw new Error("config");
      const supabase = createClient();
      const origin = window.location.origin;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (error) throw error;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (msg === "config" || msg.includes("URL")) {
        setError("L'authentification n'est pas encore configurée sur ce serveur.");
      } else if (msg.toLowerCase().includes("provider") || msg.toLowerCase().includes("google")) {
        setError("Google n'est pas activé — active-le dans ton dashboard Supabase.");
      } else {
        setError("Connexion Google impossible : " + (msg || "erreur inconnue"));
      }
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">
          {mode === "login" ? "Content de te revoir" : "Crée ton compte"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "login"
            ? "Connecte-toi pour reprendre ton parcours."
            : "Commence ton essai gratuit de 7 jours."}
        </p>
      </div>

      <Button
        variant="secondary"
        size="lg"
        className="w-full gap-3"
        onClick={handleGoogle}
        disabled={loading}
      >
        <GoogleIcon />
        Continuer avec Google
      </Button>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">ou</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleEmail} className="space-y-3">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="email"
            required
            placeholder="ton@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Mot de passe (6 caractères min.)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>
        )}
        {message && (
          <p className="rounded-lg bg-accent/10 p-3 text-sm text-accent">{message}</p>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : mode === "login" ? (
            "Se connecter"
          ) : (
            "Créer mon compte"
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        {mode === "login" ? "Pas encore de compte ?" : "Déjà un compte ?"}{" "}
        <button
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setError(null);
            setMessage(null);
          }}
          className="font-semibold text-primary hover:underline"
        >
          {mode === "login" ? "Inscris-toi" : "Connecte-toi"}
        </button>
      </p>
    </div>
  );
}

function translateError(msg: string): string {
  if (msg.includes("Invalid login credentials")) return "Email ou mot de passe incorrect.";
  if (msg.includes("already registered")) return "Un compte existe déjà avec cet email.";
  if (msg.includes("at least 6")) return "Le mot de passe doit faire au moins 6 caractères.";
  return "Une erreur est survenue. Réessaie.";
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  );
}

export default function AuthPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center justify-center border-b border-border px-4">
        <Link href="/" className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="text-lg font-bold">Libero</span>
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <Suspense fallback={null}>
          <AuthForm />
        </Suspense>
      </main>
    </div>
  );
}
