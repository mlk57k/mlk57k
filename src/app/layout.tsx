import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://libero.app";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Libero — Coach IA pour se libérer des addictions",
    template: "%s · Libero",
  },
  description:
    "Coach IA cliniquement informé pour surmonter le cannabis et la pornographie. Techniques TCC, suivi de streak, journal des déclencheurs, plan personnalisé.",
  keywords: [
    "sevrage cannabis",
    "arrêter pornographie",
    "coach addiction IA",
    "TCC addiction",
    "streak sevrage",
  ],
  openGraph: {
    title: "Libero — Coach IA pour se libérer des addictions",
    description:
      "Coach IA basé sur des techniques cliniques validées pour surmonter le cannabis et la pornographie.",
    type: "website",
    locale: "fr_FR",
    siteName: "Libero",
    url: appUrl,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
