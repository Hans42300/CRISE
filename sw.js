/* =====================================================================
   SERVICE WORKER : un petit script que le navigateur garde en arrière-plan.
   Il se place entre la page et le réseau, et peut répondre à la place du réseau.

   Stratégie choisie : "réseau d'abord, copie si échec".
   - Réseau OK  → on affiche la version en ligne (donc toujours à jour)
                  et on met la copie à jour au passage.
   - Réseau absent ou trop lent (3 s) → on affiche la copie gardée en mémoire.

   ⚠ Quand tu modifies la page, change le numéro de CACHE (v3 → v4)
   pour que les téléphones remplacent bien l'ancienne copie.
   ===================================================================== */
const CACHE = "crise-v6";
// Fichiers communs à tous les enfants, mis en mémoire dès l'installation
const FICHIERS = ["./", "./index.html", "./moteur.js", "./manifest.webmanifest", "./icone-192.png", "./icone-512.png"];

// 1. Installation : on enregistre la page dans le cache
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FICHIERS)));
  self.skipWaiting();                      // s'active tout de suite, sans attendre
});

// 1 bis. La page nous envoie la liste de SES fichiers (son profil, son scénario)
//        pour qu'on les garde aussi en mémoire.
self.addEventListener("message", e => {
  if (e.data && Array.isArray(e.data.garder)) {
    caches.open(CACHE).then(c => c.addAll(e.data.garder)).catch(() => {});
  }
});

// 2. Activation : on supprime les anciennes versions du cache
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(noms => Promise.all(noms.filter(n => n !== CACHE).map(n => caches.delete(n))))
  );
  self.clients.claim();
});

// 3. Chaque requête de la page passe par ici
self.addEventListener("fetch", e => {
  const req = e.request;
  // On ne touche qu'aux fichiers de notre site (pas à ntfy, Google Maps…)
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;

  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    // ignoreSearch : la copie sert aussi pour l'adresse avec ?test ou ?p=…
    const copie = await cache.match(req, { ignoreSearch: true });

    const reseau = fetch(req).then(reponse => {
      // On ne garde que les bonnes réponses (pas une page d'erreur 404 à la place de la vraie)
      if (reponse.ok) cache.put(req, reponse.clone());
      return reponse;
    });

    if (!copie) {
      // Pas encore de copie : on attend le réseau, même lent (sinon il n'y a rien à afficher)
      try { return await reseau; }
      catch (erreur) {
        // Hors ligne : la page elle-même peut servir de secours, mais jamais à la place d'un fichier .js
        return (req.mode === "navigate" && await cache.match("./index.html")) || Response.error();
      }
    }

    // Copie disponible : version en ligne si elle arrive en moins de 3 s et sans erreur, sinon la copie
    const trop_lent = new Promise(r => setTimeout(() => r(copie), 3000));
    return Promise.race([reseau.then(r => r.ok ? r : copie, () => copie), trop_lent]);
  })());
});
