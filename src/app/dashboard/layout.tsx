import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mon espace",
  description: "Ton historique de scans, l'évolution de ton score de peau et ta routine personnalisée.",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
