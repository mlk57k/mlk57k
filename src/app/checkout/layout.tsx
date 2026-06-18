import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Débloque ta routine",
  description:
    "Accède à ta routine de soin personnalisée, ton historique de scans et le suivi d'évolution de ton score. 7 jours gratuits.",
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
