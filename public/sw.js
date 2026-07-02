// Service worker minimal — requis pour l'installabilité Android.
// Stratégie réseau d'abord, aucune mise en cache agressive.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {
  // passthrough réseau
});
