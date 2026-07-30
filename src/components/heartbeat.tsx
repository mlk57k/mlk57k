"use client";

import { useEffect } from "react";

// Envoie un ping de présence au chargement, puis toutes les 60s tant que
// l'onglet est ouvert et visible. Silencieux (aucun rendu).
export function Heartbeat() {
  useEffect(() => {
    let stopped = false;

    const ping = () => {
      if (document.visibilityState !== "visible") return;
      fetch("/api/heartbeat", { method: "POST" }).catch(() => {});
    };

    ping();
    const interval = setInterval(() => {
      if (!stopped) ping();
    }, 60_000);

    document.addEventListener("visibilitychange", ping);

    return () => {
      stopped = true;
      clearInterval(interval);
      document.removeEventListener("visibilitychange", ping);
    };
  }, []);

  return null;
}
