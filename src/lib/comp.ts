// Comptes bénéficiant d'un accès complet offert (invités, testeurs, VIP).
// Dès qu'un de ces emails se connecte, son plan passe automatiquement en
// "active" — sans paiement, sans abonnement Stripe.

const COMPED_EMAILS = new Set(
  [
    "glowy57360@gmail.com",
    "bekstep.up@gmail.com",
  ].map((e) => e.toLowerCase())
);

export function isComped(email: string | null | undefined): boolean {
  if (!email) return false;
  return COMPED_EMAILS.has(email.toLowerCase());
}
