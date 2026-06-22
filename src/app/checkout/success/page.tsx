"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

function SuccessContent() {
  useSearchParams(); // keeps Suspense boundary

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary/20 px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent/10">
        <CheckCircle className="h-10 w-10 text-accent" />
      </div>
      <h1 className="text-3xl font-bold mb-3">Bienvenue dans Libero ! 🎉</h1>
      <p className="text-muted-foreground mb-2 max-w-md">
        Ton abonnement est actif. Tu as accès à toutes les fonctionnalités.
      </p>
      <p className="text-sm text-muted-foreground mb-8">
        Ton coach IA est prêt à t&apos;accompagner dès maintenant.
      </p>
      <Link href="/dashboard">
        <Button size="lg" className="gap-2">
          Accéder à mon espace
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 flex h-16 items-center justify-center border-b border-border bg-white px-4">
        <Link href="/" className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="text-lg font-bold">Libero</span>
        </Link>
      </header>
      <Suspense fallback={null}>
        <SuccessContent />
      </Suspense>
    </>
  );
}
