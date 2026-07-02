import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "28%",
          background: "#FBF7EE",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="4" r="2" stroke="#BD6E4C" strokeWidth="1.8" />
          <path
            d="M10 6V16M5 11C5 14 7.5 16 10 16C12.5 16 15 14 15 11"
            stroke="#BD6E4C"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path d="M6 9H14" stroke="#BD6E4C" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
