import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Glowy — Découvre l'âge réel de ta peau",
  description:
    "Analyse ta peau par IA en 10 secondes. Score, âge estimé de ta peau, routine personnalisée. Gratuit et sans compte.",
  keywords: ["soin peau", "analyse peau", "routine beauté", "score peau", "skincare IA"],
  openGraph: {
    title: "Glowy — Découvre l'âge réel de ta peau",
    description: "Analyse ta peau par IA en 10 secondes. Score, âge estimé et routine personnalisée.",
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Glowy — Découvre l'âge réel de ta peau",
    description: "Analyse ta peau par IA en 10 secondes.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} antialiased`}>{children}</body>
    </html>
  );
}
