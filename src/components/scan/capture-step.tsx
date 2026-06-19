"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, ImageIcon, RefreshCw, X } from "lucide-react";

type Mode = "choice" | "camera";

const MAX_DIMENSION = 1024; // on redimensionne avant l'upload pour rester léger

/**
 * Redimensionne + ré-encode une image en JPEG base64 (data URL).
 * Garde le ratio, plafonne la plus grande dimension à MAX_DIMENSION.
 */
async function fileToResizedDataUrl(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  return drawToDataUrl(bitmap, bitmap.width, bitmap.height);
}

function drawToDataUrl(
  source: CanvasImageSource,
  srcW: number,
  srcH: number
): string {
  const scale = Math.min(1, MAX_DIMENSION / Math.max(srcW, srcH));
  const w = Math.round(srcW * scale);
  const h = Math.round(srcH * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas non disponible");
  ctx.drawImage(source, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", 0.9);
}

export function CaptureStep({
  onCapture,
}: {
  onCapture: (dataUrl: string) => void;
}) {
  const [mode, setMode] = useState<Mode>("choice");
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const startCamera = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 1280 } },
        audio: false,
      });
      streamRef.current = stream;
      setMode("camera");
      // Le <video> est monté après le setMode ; on attend le prochain tick.
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      });
    } catch {
      setError(
        "Impossible d'accéder à la caméra. Autorise l'accès ou choisis une photo depuis ta galerie."
      );
      setMode("choice");
    }
  }, []);

  useEffect(() => stopCamera, [stopCamera]);

  const takePhoto = () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      const dataUrl = drawToDataUrl(video, video.videoWidth, video.videoHeight);
      stopCamera();
      onCapture(dataUrl);
    } catch {
      setError("La capture a échoué. Réessaie.");
    }
  };

  const onFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    try {
      const dataUrl = await fileToResizedDataUrl(file);
      onCapture(dataUrl);
    } catch {
      setError("Impossible de lire cette image. Essaie une autre photo.");
    } finally {
      e.target.value = "";
    }
  };

  if (mode === "camera") {
    return (
      <div className="animate-fade-up">
        <div className="relative rounded-3xl overflow-hidden bg-black aspect-[3/4] mb-6">
          <video
            ref={videoRef}
            playsInline
            muted
            className="h-full w-full object-cover -scale-x-100"
          />
          {/* Cadre de guidage */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-3/4 aspect-[3/4] rounded-[40%] border-2 border-white/60" />
          </div>
          <button
            onClick={() => {
              stopCamera();
              setMode("choice");
            }}
            className="absolute top-3 right-3 h-9 w-9 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-sm"
            aria-label="Fermer la caméra"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-center text-sm text-muted-foreground mb-4">
          Centre ton visage dans le cadre, lumière naturelle de préférence ☀️
        </p>

        <Button size="lg" className="w-full" onClick={takePhoto}>
          <Camera className="h-5 w-5" />
          Prendre la photo
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Prends ta selfie</h1>
        <p className="text-muted-foreground text-sm">
          Caméra ou galerie, comme tu préfères. On t&apos;analyse ça en
          quelques secondes.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-2xl bg-coral-50 border border-coral-200 p-3 text-sm text-coral-700">
          {error}
        </div>
      )}

      <div className="space-y-3">
        <button
          onClick={startCamera}
          className="w-full flex items-center gap-4 rounded-2xl bg-white border border-beige-200 p-5 text-left hover:border-coral-300 transition-colors active:scale-[0.99]"
        >
          <div className="h-12 w-12 rounded-xl bg-coral-50 flex items-center justify-center shrink-0">
            <Camera className="h-6 w-6 text-coral-500" />
          </div>
          <div>
            <p className="font-semibold">Prendre une photo</p>
            <p className="text-sm text-muted-foreground">
              Avec la caméra frontale de ton téléphone
            </p>
          </div>
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center gap-4 rounded-2xl bg-white border border-beige-200 p-5 text-left hover:border-coral-300 transition-colors active:scale-[0.99]"
        >
          <div className="h-12 w-12 rounded-xl bg-beige-100 flex items-center justify-center shrink-0">
            <ImageIcon className="h-6 w-6 text-beige-500" />
          </div>
          <div>
            <p className="font-semibold">Choisir depuis la galerie</p>
            <p className="text-sm text-muted-foreground">
              Uploade une photo existante
            </p>
          </div>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileSelected}
      />

      <p className="mt-6 text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
        <RefreshCw className="h-3 w-3" />
        Tu pourras reprendre la photo avant l&apos;analyse
      </p>
    </div>
  );
}
