import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Glowy — Découvre l'âge réel de ta peau";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#FDFAF7",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Background blobs */}
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(255,107,82,0.12)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -60,
            left: -60,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(255,107,82,0.08)",
          }}
        />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "linear-gradient(135deg, #FF6B52 0%, #ff9a87 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 800,
              fontSize: 28,
            }}
          >
            G
          </div>
          <span
            style={{
              fontSize: 48,
              fontWeight: 800,
              background: "linear-gradient(135deg, #FF6B52, #e85c40)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Glowy
          </span>
        </div>

        {/* Tagline */}
        <p
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: "#1a1a1a",
            textAlign: "center",
            maxWidth: 700,
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          Découvre l&apos;âge réel de ta peau ✨
        </p>

        {/* Sub */}
        <p
          style={{
            fontSize: 22,
            color: "#6b7280",
            textAlign: "center",
            maxWidth: 600,
            margin: 0,
          }}
        >
          Analyse IA en 10 secondes · Score · Routine personnalisée
        </p>

        {/* CTA pill */}
        <div
          style={{
            marginTop: 8,
            padding: "14px 36px",
            borderRadius: 999,
            background: "#FF6B52",
            color: "white",
            fontWeight: 700,
            fontSize: 20,
          }}
        >
          Essayer gratuitement
        </div>
      </div>
    ),
    { ...size }
  );
}
