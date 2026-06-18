import Link from "next/link";

// Stub — Stripe Checkout branché à l'étape 5.
export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gradient-glowy flex flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-bold">Paiement (étape 5)</h1>
      <p className="text-muted-foreground text-sm max-w-xs">
        Stripe Checkout arrive ici : essai gratuit 7 jours, plans mensuel et annuel.
      </p>
      <Link href="/dashboard" className="text-coral-500 font-semibold underline">
        Aller au dashboard
      </Link>
    </div>
  );
}
