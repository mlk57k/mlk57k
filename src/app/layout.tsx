import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://glowy.app";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Glowy — Découvre l'âge réel de ta peau",
    template: "%s · Glowy",
  },
  description:
    "Analyse ta peau par IA en 10 secondes. Score, âge estimé de ta peau, routine personnalisée. Gratuit et sans compte.",
  keywords: ["soin peau", "analyse peau", "routine beauté", "score peau", "skincare IA"],
  openGraph: {
    title: "Glowy — Découvre l'âge réel de ta peau",
    description: "Analyse ta peau par IA en 10 secondes. Score, âge estimé et routine personnalisée.",
    type: "website",
    locale: "fr_FR",
    siteName: "Glowy",
    url: appUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Glowy — Découvre l'âge réel de ta peau",
    description: "Analyse ta peau par IA en 10 secondes.",
    creator: "@glowy_app",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: appUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${dmSans.variable} ${playfair.variable} antialiased`}>{children}</body>
    </html>
  );
}
