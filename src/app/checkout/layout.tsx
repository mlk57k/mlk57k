import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Abonnement Libero",
  description: "Commence ton essai gratuit de 7 jours et accède à ton coach IA anti-addiction.",
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
