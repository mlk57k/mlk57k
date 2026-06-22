"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Loader2 } from "lucide-react";
import { GlowyLogo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

function AuthForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/scan";

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const completeUrl = `/auth/complete?next=${encodeURIComponent(next)}`;

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const supabase = createClient();
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        window.location.assign(completeUrl);
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        if (data.session) {
          window.location.assign(completeUrl);
        } else {
          setMessage(
            "Vérifie tes emails pour confirmer ton compte, puis reviens te connecter."
          );
          setLoading(false);
        }
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? traduireErreur(err.message)
          : "Une erreur est survenue. Réessaie."
      );
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        throw new Error("config");
      }
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
      if (msg === "config" || msg.includes("URL") || msg.includes("key")) {
        setError("L'authentification n'est pas encore configurée sur ce serveur.");
      } else if (msg.toLowerCase().includes("provider") || msg.toLowerCase().includes("google")) {
        setError("Google n'est pas activé — active-le dans ton dashboard Supabase (Auth → Providers).");
      } else {
        setError("Connexion Google impossible : " + (msg || "erreur inconnue"));
      }
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-up">
      <div className="text-center mb-8">
        <h1 className="font-display text-2xl font-bold mb-2">
          {mode === "login" ? "Content de te revoir" : "Crée ton compte"}
        </h1>
        <p className="text-stone-500 text-sm">
          {mode === "login"
            ? "Connecte-toi pour débloquer ta routine et suivre tes progrès."
            : "Quelques secondes et c'est parti pour ta routine perso."}
        </p>
      </div>

      {/* Google OAuth */}
      <Button
        variant="secondary"
        size="lg"
        className="w-full mb-4"
        onClick={handleGoogle}
        disabled={loading}
      >
        <GoogleIcon />
        Continuer avec Google
      </Button>

      <div className="flex items-center gap-3 my-6">
        <div className="h-px flex-1 bg-cream-200" />
        <span className="text-xs text-stone-400">ou</span>
        <div className="h-px flex-1 bg-cream-200" />
      </div>

      <form onSubmit={handleEmail} className="space-y-3">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="email"
            required
            placeholder="ton@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-12 pl-10 pr-4 rounded-xl border border-cream-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-coral-400"
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-12 pl-10 pr-4 rounded-xl border border-cream-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-coral-400"
          />
        </div>

        {error && (
          <p className="text-sm text-coral-600 bg-coral-50 rounded-xl p-3">
            {error}
          </p>
        )}
        {message && (
          <p className="text-sm text-green-700 bg-green-50 rounded-xl p-3">
            {message}
          </p>
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

      <p className="text-center text-sm text-stone-500 mt-6">
        {mode === "login" ? "Pas encore de compte ?" : "Déjà un compte ?"}{" "}
        <button
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setError(null);
            setMessage(null);
          }}
          className="text-coral-400 font-semibold hover:underline"
        >
          {mode === "login" ? "Inscris-toi" : "Connecte-toi"}
        </button>
      </p>
    </div>
  );
}

function traduireErreur(msg: string): string {
  if (msg.includes("Invalid login credentials"))
    return "Email ou mot de passe incorrect.";
  if (msg.includes("already registered"))
    return "Un compte existe déjà avec cet email.";
  if (msg.includes("at least 6"))
    return "Le mot de passe doit faire au moins 6 caractères.";
  return "Une erreur est survenue. Réessaie.";
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-cream-50">
      <header className="px-4 h-14 flex items-center justify-center border-b border-cream-200/60">
        <Link href="/">
          <GlowyLogo size="md" />
        </Link>
      </header>
      <main className="mx-auto max-w-md px-4 py-10">
        <Suspense fallback={null}>
          <AuthForm />
        </Suspense>
      </main>
    </div>
  );
}
