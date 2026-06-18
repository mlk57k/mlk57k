import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scan de peau",
  description:
    "Prends un selfie et obtiens ton score de peau, ton âge cutané estimé et une routine personnalisée en 10 secondes.",
  openGraph: {
    title: "Analyse ta peau en 10 secondes · Glowy",
    description: "Selfie → score → routine personnalisée par IA. Gratuit, sans compte requis.",
  },
};

export default function ScanLayout({ children }: { children: React.ReactNode }) {
  return children;
}
