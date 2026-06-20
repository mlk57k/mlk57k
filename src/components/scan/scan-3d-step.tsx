"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { X } from "lucide-react";

type Phase = "loading_model" | "requesting_camera" | "detecting" | "stable" | "captured";

interface FaceLandmark {
  x: number;
  y: number;
  z: number;
}

interface FaceMeshResults {
  multiFaceLandmarks?: FaceLandmark[][];
  image: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement;
}

interface FaceMeshOptions {
  maxNumFaces: number;
  refineLandmarks: boolean;
  minDetectionConfidence: number;
  minTrackingConfidence: number;
}

interface FaceMeshInstance {
  setOptions: (opts: FaceMeshOptions) => void;
  onResults: (cb: (results: FaceMeshResults) => void) => void;
  send: (input: { image: HTMLVideoElement }) => Promise<void>;
  close: () => void;
}

interface Connection {
  start: number;
  end: number;
}

interface DrawStyle {
  color: string;
  lineWidth: number;
}

declare global {
  interface Window {
    FaceMesh: new (config: { locateFile: (file: string) => string }) => FaceMeshInstance;
    drawConnectors: (
      ctx: CanvasRenderingContext2D,
      landmarks: FaceLandmark[],
      connections: Connection[],
      style: DrawStyle
    ) => void;
    FACEMESH_TESSELATION: Connection[];
    FACEMESH_FACE_OVAL: Connection[];
    FACEMESH_LEFT_EYE: Connection[];
    FACEMESH_RIGHT_EYE: Connection[];
    FACEMESH_LIPS: Connection[];
  }
}

const CDN_BASE = "https://cdn.jsdelivr.net/npm";
const FACE_MESH_URL = `${CDN_BASE}/@mediapipe/face_mesh@0.4.1633559619/face_mesh.js`;
const DRAWING_UTILS_URL = `${CDN_BASE}/@mediapipe/drawing_utils@0.3.1675466124/drawing_utils.js`;
const FACE_MESH_CDN = `${CDN_BASE}/@mediapipe/face_mesh@0.4.1633559619`;

const STABLE_FRAME_TARGET = 45;

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.crossOrigin = "anonymous";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

interface Props {
  onCapture: (dataUrl: string) => void;
  onCancel: () => void;
}

export function Scan3DStep({ onCapture, onCancel }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const faceMeshRef = useRef<FaceMeshInstance | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const stableFramesRef = useRef(0);
  const capturedRef = useRef(false);
  const processingRef = useRef(false);
  const destroyedRef = useRef(false);

  const [phase, setPhase] = useState<Phase>("loading_model");
  const [stableProgress, setStableProgress] = useState(0);
  const [showFlash, setShowFlash] = useState(false);

  const capture = useCallback(() => {
    if (capturedRef.current || !videoRef.current) return;
    capturedRef.current = true;

    const video = videoRef.current;
    const tmpCanvas = document.createElement("canvas");
    tmpCanvas.width = video.videoWidth;
    tmpCanvas.height = video.videoHeight;
    const tmpCtx = tmpCanvas.getContext("2d");
    if (!tmpCtx) return;

    tmpCtx.save();
    tmpCtx.translate(tmpCanvas.width, 0);
    tmpCtx.scale(-1, 1);
    tmpCtx.drawImage(video, 0, 0);
    tmpCtx.restore();

    const dataUrl = tmpCanvas.toDataURL("image/jpeg", 0.92);
    setShowFlash(true);
    setPhase("captured");

    setTimeout(() => {
      onCapture(dataUrl);
    }, 900);
  }, [onCapture]);

  const onResults = useCallback(
    (results: FaceMeshResults) => {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      if (!canvas || !video || destroyedRef.current) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.save();
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      ctx.restore();

      const landmarks = results.multiFaceLandmarks?.[0];

      if (!landmarks) {
        stableFramesRef.current = 0;
        setStableProgress(0);
        setPhase("detecting");
        return;
      }

      if (!capturedRef.current) {
        setPhase("stable");
        stableFramesRef.current += 1;
        const progress = Math.min(stableFramesRef.current / STABLE_FRAME_TARGET, 1);
        setStableProgress(progress);

        if (
          typeof window.drawConnectors === "function" &&
          window.FACEMESH_TESSELATION
        ) {
          window.drawConnectors(ctx, landmarks, window.FACEMESH_TESSELATION, {
            color: "rgba(232, 130, 106, 0.12)",
            lineWidth: 0.5,
          });
          window.drawConnectors(ctx, landmarks, window.FACEMESH_FACE_OVAL, {
            color: "rgba(232, 130, 106, 0.7)",
            lineWidth: 2,
          });
          window.drawConnectors(ctx, landmarks, window.FACEMESH_LEFT_EYE, {
            color: "rgba(232, 130, 106, 0.9)",
            lineWidth: 1.5,
          });
          window.drawConnectors(ctx, landmarks, window.FACEMESH_RIGHT_EYE, {
            color: "rgba(232, 130, 106, 0.9)",
            lineWidth: 1.5,
          });
          window.drawConnectors(ctx, landmarks, window.FACEMESH_LIPS, {
            color: "rgba(232, 130, 106, 0.9)",
            lineWidth: 1.5,
          });
        }

        if (stableFramesRef.current >= STABLE_FRAME_TARGET) {
          capture();
        }
      }
    },
    [capture]
  );

  useEffect(() => {
    destroyedRef.current = false;

    async function init() {
      try {
        await loadScript(DRAWING_UTILS_URL);
        await loadScript(FACE_MESH_URL);

        if (destroyedRef.current) return;

        const faceMesh = new window.FaceMesh({
          locateFile: (file) => `${FACE_MESH_CDN}/${file}`,
        });

        faceMesh.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.7,
          minTrackingConfidence: 0.7,
        });

        faceMesh.onResults(onResults);
        faceMeshRef.current = faceMesh;

        if (destroyedRef.current) return;
        setPhase("requesting_camera");

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        if (destroyedRef.current) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;

        const video = videoRef.current;
        if (!video) return;

        video.srcObject = stream;
        await video.play();

        if (destroyedRef.current) return;
        setPhase("detecting");

        const tick = async () => {
          if (destroyedRef.current || capturedRef.current) return;
          const v = videoRef.current;
          const fm = faceMeshRef.current;
          if (v && fm && v.readyState >= 2 && !processingRef.current) {
            processingRef.current = true;
            try {
              await fm.send({ image: v });
            } catch {
              // frame errors are non-fatal
            } finally {
              processingRef.current = false;
            }
          }
          rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);
      } catch {
        if (!destroyedRef.current) onCancel();
      }
    }

    init();

    return () => {
      destroyedRef.current = true;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      faceMeshRef.current?.close();
    };
  }, [onResults, onCancel]);

  const showCamera = phase === "detecting" || phase === "stable" || phase === "captured";

  return (
    <div className="relative w-full min-h-screen bg-zinc-950 flex flex-col items-center justify-center overflow-hidden">
      {showFlash && (
        <div
          className="absolute inset-0 z-50 bg-white pointer-events-none"
          style={{ animation: "flashFade 0.5s ease-out forwards" }}
        />
      )}

      <style>{`
        @keyframes flashFade {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>

      <button
        onClick={onCancel}
        className="absolute top-5 right-5 z-40 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-white/70 hover:bg-white/20 hover:text-white transition-all duration-200"
        aria-label="Annuler"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="absolute top-5 left-1/2 -translate-x-1/2 z-40">
        <span className="inline-flex items-center gap-1.5 select-none">
          <svg width={18} height={18} viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M10 1L12 8L19 10L12 12L10 19L8 12L1 10L8 8Z" fill="#e8826a" />
            <circle cx="15.5" cy="4.5" r="1.2" fill="#eea593" opacity="0.7" />
          </svg>
          <span className="font-display font-bold italic tracking-tight text-white leading-none text-xl">
            glowy
          </span>
        </span>
      </div>

      {!showCamera && (
        <div className="flex flex-col items-center gap-8 text-center px-8">
          <div className="relative flex items-center justify-center">
            <svg
              className="h-20 w-20"
              viewBox="0 0 80 80"
              fill="none"
              style={{ animation: "spin 1.4s linear infinite" }}
            >
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <circle
                cx="40"
                cy="40"
                r="34"
                stroke="white"
                strokeOpacity="0.06"
                strokeWidth="3"
              />
              <circle
                cx="40"
                cy="40"
                r="34"
                stroke="#e8826a"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="60 154"
                strokeDashoffset="0"
              />
            </svg>
          </div>

          <div className="space-y-1.5">
            <p className="text-white/90 font-medium text-sm tracking-widest uppercase">
              {phase === "loading_model"
                ? "Chargement du modèle 3D..."
                : "Initialisation caméra"}
            </p>
            {phase === "requesting_camera" && (
              <p className="text-white/35 text-xs font-medium tracking-wide">
                Demande d&apos;accès...
              </p>
            )}
          </div>
        </div>
      )}

      <div
        className="relative w-full max-w-sm mx-auto px-4"
        style={{
          opacity: showCamera ? 1 : 0,
          pointerEvents: showCamera ? "auto" : "none",
          position: showCamera ? "relative" : "absolute",
        }}
      >
        <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl shadow-black/60">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ transform: "scaleX(-1)" }}
            muted
            playsInline
            autoPlay
            aria-hidden="true"
          />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full object-cover"
            aria-hidden="true"
          />

          {phase === "detecting" && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <svg className="w-44 h-60" viewBox="0 0 176 240" fill="none">
                <ellipse
                  cx="88"
                  cy="120"
                  rx="74"
                  ry="102"
                  stroke="white"
                  strokeOpacity="0.4"
                  strokeWidth="1.5"
                  strokeDasharray="7 5"
                >
                  <animate
                    attributeName="stroke-opacity"
                    values="0.4;0.65;0.4"
                    dur="2.2s"
                    repeatCount="indefinite"
                  />
                </ellipse>
              </svg>
            </div>
          )}

          <div className="absolute bottom-0 inset-x-0 p-4">
            <div className="rounded-2xl bg-black/50 backdrop-blur-xl border border-white/10 px-4 py-3.5">
              {phase === "detecting" && (
                <p className="text-white/75 text-sm text-center font-medium leading-snug">
                  Positionnez votre visage dans le cadre
                </p>
              )}

              {phase === "stable" && (
                <div className="space-y-2">
                  <p className="text-white/90 text-sm text-center font-medium">
                    Maintien de la position...
                  </p>
                  <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-coral-400 transition-[width] duration-100 ease-linear"
                      style={{ width: `${stableProgress * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {phase === "captured" && (
                <p className="text-white text-sm text-center font-semibold tracking-wide">
                  Capture effectuée !
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
