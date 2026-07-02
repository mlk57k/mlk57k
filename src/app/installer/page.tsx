"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Share, SquarePlus, Smartphone, CheckCircle2, BellRing } from "lucide-react";
import { AppLogo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as { standalone?: boolean }).standalone === true
  );
}

export default function InstallerPage() {
  const [platform, setPlatform] = useState<"ios" | "android" | "other">("other");
  const [installed, setInstalled] = useState(false);
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    setInstalled(isStandalone());
    const ua = navigator.userAgent;
    if (/iphone|ipad|ipod/i.test(ua)) setPlatform("ios");
    else if (/android/i.test(ua)) setPlatform("android");

    const handler = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setInstalled(true));
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function installAndroid() {
    if (!installEvent) return;
    await installEvent.prompt();
    const { outcome } = await installEvent.userChoice;
    if (outcome === "accepted") setInstalled(true);
  }

  function Step({ n, icon, children }: { n: number; icon: React.ReactNode; children: React.ReactNode }) {
    return (
      <div className="bg-white border border-cream-200 rounded-2xl px-5 py-4 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-coral-50 flex-none flex items-center justify-center font-display font-semibold text-coral-500">
          {n}
        </div>
        <div className="flex-1 text-sm text-stone-700 leading-relaxed">{children}</div>
        <div className="flex-none text-stone-400">{icon}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100">
      <header className="sticky top-0 z-40 border-b border-cream-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/journal"><AppLogo size="sm" /></Link>
          <Link href="/journal" className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-900 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            Mon journal
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-md px-4 sm:px-6 py-10">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-white border border-cream-200 shadow-soft flex items-center justify-center">
            <Smartphone className="h-7 w-7 text-coral-400" />
          </div>
          <h1 className="font-display text-3xl font-semibold text-stone-900 leading-tight mb-2">
            Installe Ancrage<br />sur ton téléphone
          </h1>
          <p className="text-stone-500 text-sm leading-relaxed">
            Une icône sur ton écran d&apos;accueil, l&apos;app en plein écran, et les rappels en
            notification — comme une vraie app, sans passer par un store.
          </p>
        </div>

        {installed && (
          <div className="bg-white border border-cream-200 rounded-2xl p-6 text-center">
            <CheckCircle2 className="h-8 w-8 text-sage mx-auto mb-3" />
            <p className="font-semibold text-stone-900 mb-1">C&apos;est déjà fait 🎉</p>
            <p className="text-sm text-stone-500 mb-4">
              Tu utilises Ancrage depuis ton écran d&apos;accueil. Pense à activer les notifications
              pour recevoir ton rappel du soir.
            </p>
            <Button asChild size="sm">
              <Link href="/parametres">
                <BellRing className="h-4 w-4 mr-2" />
                Activer les notifications
              </Link>
            </Button>
          </div>
        )}

        {!installed && (
          <>
            {/* Android : installation en un clic */}
            {installEvent && (
              <div className="mb-6">
                <Button size="lg" className="w-full" onClick={installAndroid}>
                  Installer Ancrage
                </Button>
                <p className="text-center text-xs text-stone-400 mt-2">
                  Un clic, et l&apos;icône apparaît sur ton écran d&apos;accueil.
                </p>
              </div>
            )}

            {/* iPhone */}
            {(platform === "ios" || platform === "other") && !installEvent && (
              <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-coral-500 mb-3">
                  Sur iPhone (Safari)
                </p>
                <div className="flex flex-col gap-3">
                  <Step n={1} icon={<Share className="h-5 w-5" />}>
                    Ouvre <strong>ancrage.xyz</strong> dans <strong>Safari</strong>, puis appuie
                    sur le bouton <strong>Partager</strong> (le carré avec la flèche, en bas).
                  </Step>
                  <Step n={2} icon={<SquarePlus className="h-5 w-5" />}>
                    Fais défiler la liste et appuie sur{" "}
                    <strong>&quot;Sur l&apos;écran d&apos;accueil&quot;</strong>.
                  </Step>
                  <Step n={3} icon={<CheckCircle2 className="h-5 w-5" />}>
                    Appuie sur <strong>Ajouter</strong> — l&apos;icône Ancrage ⚓ apparaît sur ton
                    écran d&apos;accueil.
                  </Step>
                </div>
                <p className="text-xs text-stone-400 mt-3 leading-relaxed">
                  Si tu ne vois pas l&apos;option : tu es sûrement dans le navigateur d&apos;une autre
                  app (Instagram, Snap…). Ouvre d&apos;abord la page dans Safari.
                </p>
              </div>
            )}

            {/* Android sans prompt natif */}
            {(platform === "android" || platform === "other") && !installEvent && (
              <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-coral-500 mb-3">
                  Sur Android (Chrome)
                </p>
                <div className="flex flex-col gap-3">
                  <Step n={1} icon={<Share className="h-5 w-5" />}>
                    Ouvre <strong>ancrage.xyz</strong> dans <strong>Chrome</strong>, puis appuie
                    sur le menu <strong>⋮</strong> en haut à droite.
                  </Step>
                  <Step n={2} icon={<SquarePlus className="h-5 w-5" />}>
                    Appuie sur <strong>&quot;Ajouter à l&apos;écran d&apos;accueil&quot;</strong> (ou
                    &quot;Installer l&apos;application&quot;).
                  </Step>
                  <Step n={3} icon={<CheckCircle2 className="h-5 w-5" />}>
                    Confirme — l&apos;icône Ancrage ⚓ apparaît sur ton écran d&apos;accueil.
                  </Step>
                </div>
              </div>
            )}

            <div className="bg-coral-50 border border-coral-100 rounded-2xl px-5 py-4 text-sm text-coral-700 leading-relaxed">
              <strong>Pourquoi l&apos;installer ?</strong> Ancrage s&apos;ouvre en plein écran, ton
              rappel du soir et ton bilan du dimanche arrivent en notification, et ton journal
              est à un tap de toi.
            </div>
          </>
        )}
      </main>
    </div>
  );
}
