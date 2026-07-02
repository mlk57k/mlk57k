import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ancrage — Le journal du soir",
    short_name: "Ancrage",
    description:
      "Trois minutes pour déposer ta journée — par écrit ou à voix haute. Ancrage t'écoute et te renvoie une pensée douce.",
    id: "/journal",
    start_url: "/journal",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#FBF7EE",
    theme_color: "#FBF7EE",
    lang: "fr",
    categories: ["health", "lifestyle", "productivity"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
