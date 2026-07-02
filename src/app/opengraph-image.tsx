import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Ancrage — Le journal du soir. Trois minutes pour déposer ta journée.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#141220",
          position: "relative",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Halo abricot, comme une lampe de chevet la nuit */}
        <div
          style={{
            position: "absolute",
            top: -220,
            left: 320,
            width: 560,
            height: 560,
            borderRadius: 9999,
            background: "radial-gradient(circle, rgba(232,168,124,0.28) 0%, rgba(232,168,124,0) 70%)",
            display: "flex",
          }}
        />

        {/* Ancre */}
        <svg width="72" height="72" viewBox="0 0 20 20" fill="none" style={{ marginBottom: 28 }}>
          <circle cx="10" cy="4" r="2" stroke="#e8a87c" strokeWidth="1.4" />
          <path
            d="M10 6V16M5 11C5 14 7.5 16 10 16C12.5 16 15 14 15 11"
            stroke="#e8a87c"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path d="M6 9H14" stroke="#e8a87c" strokeWidth="1.4" strokeLinecap="round" />
        </svg>

        <div
          style={{
            fontSize: 92,
            fontWeight: 600,
            color: "#efeaf6",
            letterSpacing: "-2px",
            display: "flex",
          }}
        >
          Ancrage
        </div>

        <div
          style={{
            fontSize: 34,
            color: "#e8a87c",
            fontStyle: "italic",
            marginTop: 14,
            display: "flex",
          }}
        >
          Le journal du soir
        </div>

        <div
          style={{
            fontSize: 24,
            color: "#9d95b8",
            marginTop: 30,
            display: "flex",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Trois minutes pour déposer ta journée, à l&apos;écrit ou à voix haute.
        </div>
      </div>
    ),
    { ...size }
  );
}
