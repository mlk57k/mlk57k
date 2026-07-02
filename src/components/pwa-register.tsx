"use client";

import { useEffect } from "react";

export function PwaRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // service worker indisponible — l'app reste fonctionnelle
      });
    }
  }, []);
  return null;
}
