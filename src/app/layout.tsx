import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://glowy.beauty";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Ancrage — Le journal du soir",
    template: "%s · Ancrage",
  },
  description:
    "Trois minutes pour déposer ta journée — par écrit ou à voix haute. Ancrage t'écoute et te renvoie une pensée douce pour fermer la journée l'esprit plus léger.",
  keywords: ["journal intime", "journaling", "bien-être", "coach IA", "écriture thérapeutique"],
  openGraph: {
    title: "Ancrage — Le journal du soir",
    description: "Écris ou parle. Ancrage t'écoute et te renvoie un reflet bienveillant, jamais un diagnostic.",
    type: "website",
    locale: "fr_FR",
    siteName: "Ancrage",
    url: appUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Ancrage — Le journal du soir",
    description: "Trois minutes pour déposer ta journée et fermer l'esprit plus léger.",
    creator: "@ancrage_app",
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
      <body className={`${inter.variable} ${fraunces.variable} antialiased`}>{children}</body>
    </html>
  );
}
