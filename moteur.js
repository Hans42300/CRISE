/* =====================================================================
   MOTEUR : le fonctionnement commun à tous les scénarios.
   Chrono, journal des observations, voix, SMS, position, notifications,
   langues, mode entraînement, plusieurs épisodes à la suite.
   On n'y met AUCUN texte propre à une maladie : tout ça vient de SCENARIO.
   ===================================================================== */

/* MODE ENTRAÎNEMENT : ouvre la page avec ?test à la fin de l'adresse.
   Aucune notification n'est envoyée et les boutons d'appel ne composent rien.
   Avec ?test=notif : les appels restent bloqués, mais les notifications partent
   vraiment, marquées [TEST]. Sert aux parents à vérifier que leur téléphone les reçoit. */
const MODE_TEST = new URLSearchParams(location.search).has("test");
const NOTIF_TEST = new URLSearchParams(location.search).get("test") === "notif";

const SEUIL_MIN = CONFIG.seuilAlerteMin || SCENARIO.seuilAlerteMin;

/* =====================================================================
   GENRE : dans les textes du scénario, on écrit {masculin|féminin},
   par exemple "tournez-{le|la}". Le moteur garde le bon mot selon
   CONFIG.genre ("f" = fille ; sinon masculin).
   ===================================================================== */
const FILLE = CONFIG.genre === "f";
function accorder(v) {
  if (typeof v === "string") return v.replace(/\{([^{}|]*)\|([^{}]*)\}/g, (_, m, f) => FILLE ? f : m);
  if (typeof v === "function") return (...args) => accorder(v(...args));   // ex : titrePrenom
  if (Array.isArray(v)) return v.map(accorder);
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, accorder(x)]));
  return v;
}

/* "de Léo" mais "d'Emma", "d'Hugo" (et "de l'enfant" sans prénom) */
const de = nom => (/^[aeiouhàâäéèêëîïôöùûü]/i.test(nom) ? "d'" : "de ") + nom;

/* Numéro du parent sans espaces, points ni tirets : "06 12.34-56 78" → "0612345678".
   Le "+" est gardé pour les numéros étrangers (+33…). Indispensable pour les liens SMS. */
const TEL_PARENT = (CONFIG.telParent || "").replace(/[^\d+]/g, "");

/* =====================================================================
   TEXTES DU MOTEUR (génériques). Le scénario ajoute les siens par-dessus.
   ===================================================================== */
const LANGUES = { fr: "FR", en: "EN", es: "ES" };
const VOIX = { fr: "fr-FR", en: "en-GB", es: "es-ES" };   // langue de la synthèse vocale

const TEXTES_MOTEUR = {
  fr: {
    debutVers: h => "Début estimé : " + h,
    plus1: "Ça a commencé avant : +1 min",
    voix: "🔊 Lire les consignes à voix haute",
    voixStop: "⏹ Arrêter la voix",
    sms: "✉️ Prévenir par SMS",
    smsPosition: "📍 Recherche de la position…",
    recapTitre: "Récapitulatif pour les secours et les parents",
    copier: "Copier le récap",
    copie: "Copié ✓",
    obsTitre: "Ce que je vois (appuyez, l'heure est notée)",
    journalTitre: "Notes prises",
    annuler: "Annuler",
    retablir: "Rétablir",
    protocoleTitre: "Protocole prévu par son médecin",
    appel15: "Appeler le 15",
    appelParent: n => "Appeler " + (n || "le parent"),
    ntfyOk: "✓ Les parents ont reçu une notification. Cela ne remplace pas le 15.",
    bandeauTest: "MODE ENTRAÎNEMENT : aucune alerte envoyée, aucun appel passé",
    bandeauTestNotif: "MODE ENTRAÎNEMENT : notifications [TEST] envoyées aux parents, aucun appel passé",
    testAppel: "Mode entraînement : l'appel n'est pas passé.",
    reprendre: "↩️ Erreur, ce n'est pas fini : reprendre le chrono",
    positionTxt: (lat, lon, m) => "📍 Votre position, à donner au 15 : " + lat + ", " + lon + " (± " + m + " m)"
  },
  en: {
    debutVers: h => "Estimated start: " + h,
    plus1: "It started earlier: +1 min",
    voix: "🔊 Read instructions aloud",
    voixStop: "⏹ Stop voice",
    sms: "✉️ Alert by text",
    smsPosition: "📍 Getting location…",
    recapTitre: "Summary for paramedics and parents (in French)",
    copier: "Copy summary",
    copie: "Copied ✓",
    obsTitre: "What I see (tap, the time is recorded)",
    journalTitre: "Notes taken",
    annuler: "Undo",
    retablir: "Restore",
    protocoleTitre: "Plan from their doctor (in French)",
    appel15: "Call emergency (15)",
    appelParent: n => "Call parent",
    ntfyOk: "✓ Parents have been notified. This does not replace calling 15.",
    bandeauTest: "TRAINING MODE: no alert sent, no call made",
    bandeauTestNotif: "TRAINING MODE: [TEST] notifications sent to parents, no call made",
    testAppel: "Training mode: no call is made.",
    reprendre: "↩️ Mistake, it's not over: resume the timer",
    positionTxt: (lat, lon, m) => "📍 Your location, give it to 15: " + lat + ", " + lon + " (± " + m + " m)"
  },
  es: {
    debutVers: h => "Inicio estimado: " + h,
    plus1: "Empezó antes: +1 min",
    voix: "🔊 Leer las instrucciones en voz alta",
    voixStop: "⏹ Parar la voz",
    sms: "✉️ Avisar por SMS",
    smsPosition: "📍 Buscando la ubicación…",
    recapTitre: "Resumen para emergencias y padres (en francés)",
    copier: "Copiar el resumen",
    copie: "Copiado ✓",
    obsTitre: "Lo que veo (pulse, se anota la hora)",
    journalTitre: "Notas tomadas",
    annuler: "Anular",
    retablir: "Restablecer",
    protocoleTitre: "Protocolo de su médico (en francés)",
    appel15: "Llamar a emergencias (15)",
    appelParent: n => "Llamar a los padres",
    ntfyOk: "✓ Los padres han recibido un aviso. Esto no sustituye la llamada al 15.",
    bandeauTest: "MODO ENTRENAMIENTO: no se envía ningún aviso ni se llama",
    bandeauTestNotif: "MODO ENTRENAMIENTO: avisos [TEST] enviados a los padres, no se llama",
    testAppel: "Modo entrenamiento: no se realiza la llamada.",
    reprendre: "↩️ Error, no ha terminado: reanudar el cronómetro",
    positionTxt: (lat, lon, m) => "📍 Su ubicación, para dársela al 15: " + lat + ", " + lon + " (± " + m + " m)"
  }
};

// Fusion : pour chaque langue, textes du moteur + textes du scénario (le scénario gagne)
const TEXTES = {};
for (const code in LANGUES) {
  TEXTES[code] = accorder({ ...TEXTES_MOTEUR[code], ...(SCENARIO.textes[code] || SCENARIO.textes.fr) });
}

const OBSERVATIONS = accorder(SCENARIO.observations);
const obsParId = id => OBSERVATIONS.find(o => o.id === id);

/* =====================================================================
   ÉTAT DE LA PAGE (les données qui changent pendant l'utilisation)
   ===================================================================== */
let langue = "fr";
let debut = Date.now();      // heure de début de l'épisode (en millisecondes)
let fin = null;              // rempli quand l'épisode est terminé
let alerteDonnee = false;
let observations = [];       // liste de { obs, t, annule } : quoi, à quel moment, annulée ou non
let position = null;         // coordonnées GPS si on les obtient
let historique = [];         // épisodes précédents quand ils s'enchaînent : [{ debut, fin, observations }]

const $ = id => document.getElementById(id);   // raccourci pour aller chercher un élément

/* =====================================================================
   SAUVEGARDE SUR LE TÉLÉPHONE
   Si la page se ferme (bouton retour, onglet fermé après l'envoi du SMS…),
   on retrouve le chrono et les notes en la rouvrant.
   - crise en cours : reprise si la dernière action date de moins de 2 h
   - crise terminée : reprise pendant 15 min seulement (pour qu'une crise un autre
     jour ne soit pas prise pour une "crise qui s'enchaîne")
   Le mode entraînement a sa propre sauvegarde : il ne mélange rien avec une vraie crise.
   ===================================================================== */
const CLE_SAUVEGARDE = "crise:" + PROFIL + (MODE_TEST ? ":test" : "");

function sauver() {
  const versJSON = liste => liste.map(o => ({ id: o.obs.id, t: o.t, annule: o.annule }));
  try {
    localStorage.setItem(CLE_SAUVEGARDE, JSON.stringify({
      debut, fin, alerteDonnee,
      observations: versJSON(observations),
      historique: historique.map(c => ({ debut: c.debut, fin: c.fin, observations: versJSON(c.observations) }))
    }));
  } catch (e) {}   // navigation privée ou stockage plein : la page marche quand même
}

function restaurer() {
  try {
    const e = JSON.parse(localStorage.getItem(CLE_SAUVEGARDE));
    if (!e) return false;
    const depuisJSON = liste => liste
      .map(o => ({ obs: obsParId(o.id), t: o.t, annule: o.annule }))
      .filter(o => o.obs);                       // observation retirée du scénario entre-temps : ignorée
    const derniereAction = Math.max(e.debut, ...e.observations.map(o => o.t));
    const tropVieux = e.fin
      ? Date.now() - e.fin > 15 * 60 * 1000
      : Date.now() - derniereAction > 2 * 60 * 60 * 1000;
    if (tropVieux) { localStorage.removeItem(CLE_SAUVEGARDE); return false; }

    debut = e.debut; fin = e.fin; alerteDonnee = e.alerteDonnee;
    observations = depuisJSON(e.observations);
    historique = e.historique.map(c => ({ debut: c.debut, fin: c.fin, observations: depuisJSON(c.observations) }));
    return true;
  } catch (err) { return false; }               // sauvegarde abîmée : on repart de zéro
}
const reprise = restaurer();

/* =====================================================================
   NOTIFICATIONS AUTOMATIQUES (ntfy)
   Le parent installe l'appli ntfy et s'abonne au canal CONFIG.ntfyCanal.
   Astuce : titre/priorité dans l'adresse (?title=...) plutôt que dans des en-têtes HTTP,
   pour que le navigateur envoie une requête "simple" (pas de "preflight" CORS).
   ===================================================================== */
function notifier(message, { titre = "Alerte", priorite = 5, tags = "rotating_light", lien = "" } = {}) {
  if (!CONFIG.ntfyCanal || (MODE_TEST && !NOTIF_TEST)) return Promise.resolve(false);
  if (NOTIF_TEST) { titre = "[TEST] " + titre; message = "[TEST] " + message; }
  const params = new URLSearchParams({ title: titre, priority: priorite, tags: tags });
  if (lien) params.set("click", lien);          // toucher la notif ouvre ce lien (ex : la carte)
  return fetch("https://ntfy.sh/" + CONFIG.ntfyCanal + "?" + params, {
    method: "POST",
    body: message,
    keepalive: true                             // la requête part même si on quitte la page (ex : ouverture des SMS)
  }).then(r => r.ok).catch(() => false);        // pas de réseau : on n'empêche pas la page de fonctionner
}

const qui = CONFIG.prenom || "l'enfant";

// 1re notification : dès l'ouverture. "Page ouverte", pas "crise" : c'est peut-être un curieux.
// Si la page a été rouverte pendant un épisode, on le dit (avec la durée).
(reprise
  ? notifier("La page d'urgence " + de(qui) + " a été rouverte à " + heure(Date.now()) +
      (fin ? " (épisode déjà noté comme terminé)." : " : épisode en cours depuis " + formater(Date.now() - debut) + "."),
      { titre: "Page d'urgence rouverte" })
  : notifier("La page d'urgence " + de(qui) + " vient d'être ouverte à " + heure(Date.now()) +
      ". Un témoin est probablement avec " + qui + ".",
      { titre: "Page d'urgence ouverte" })
).then(ok => {
  if (ok) {
    $("statut-ntfy").textContent = TEXTES[langue].ntfyOk;
    $("statut-ntfy").classList.remove("cache");
  }
});

/* =====================================================================
   LANGUE : celle du téléphone si on la connaît, sinon le français
   ===================================================================== */
const langueTel = (navigator.language || "fr").slice(0, 2);
if (TEXTES[langueTel]) langue = langueTel;

function afficherTextes() {
  const T = TEXTES[langue];
  document.documentElement.lang = langue;

  // Tous les éléments qui ont un attribut data-t reçoivent le texte correspondant
  document.querySelectorAll("[data-t]").forEach(el => {
    el.innerHTML = T[el.dataset.t] || "";
  });

  $("titre").textContent = CONFIG.prenom ? T.titrePrenom(CONFIG.prenom) : T.titre;
  document.title = T.titre;
  if (enLecture) $("btn-voix").textContent = T.voixStop;
  if (!$("statut-ntfy").classList.contains("cache")) $("statut-ntfy").textContent = T.ntfyOk;

  // Listes de consignes avec pictogrammes
  const construire = etapes => etapes
    .map(([ico, txt]) => `<li><span class="ico" aria-hidden="true">${ico}</span><span>${txt}</span></li>`)
    .join("");
  $("liste-pendant").innerHTML = construire(CONFIG.consigneVideo && T.video ? [...T.pendant, T.video] : T.pendant);
  $("liste-apres").innerHTML = construire(T.apres);

  // Boutons d'observation, groupe par groupe
  $("obs-groupes").innerHTML = SCENARIO.groupesAffiches.map(g => {
    const boutons = OBSERVATIONS
      .filter(o => o.groupe === g && (!o.siProtocole || CONFIG.protocole) && (!o.siVideo || CONFIG.consigneVideo))
      .map(o => `<button data-obs="${o.id}"><span class="ico-obs" aria-hidden="true">${o.ico}</span>${o[langue]}<span class="nb cache"></span></button>`)
      .join("");
    return `<h3>${T.groupes[g]}</h3><div class="obs-grille">${boutons}</div>`;
  }).join("");

  // Bouton parent
  if (TEL_PARENT) {
    $("btn-parent").href = "tel:" + TEL_PARENT;
    $("btn-parent").textContent = T.appelParent(CONFIG.nomParent);
    $("btn-parent").classList.remove("cache");
  }

  // Sélecteur de langue
  $("langues").innerHTML = Object.entries(LANGUES)
    .map(([code, nom]) => `<button data-langue="${code}" class="${code === langue ? "actif" : ""}">${nom}</button>`)
    .join("");

  afficherObservations();
  afficherPosition();
  rafraichir();
}

if (CONFIG.protocole) {
  $("protocole").textContent = CONFIG.protocole;
  $("bloc-protocole").classList.remove("cache");
}

/* =====================================================================
   CHRONO
   On ne compte PAS les secondes une par une (le téléphone peut mettre la page
   en veille). On garde l'heure de début et on calcule "maintenant - début".
   ===================================================================== */
function formater(ms) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  return String(Math.floor(totalSec / 60)).padStart(2, "0") + ":" + String(totalSec % 60).padStart(2, "0");
}
function heure(t) {
  return new Date(t).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function rafraichir() {
  const T = TEXTES[langue];
  const ecoule = (fin || Date.now()) - debut;
  $("chrono").textContent = formater(ecoule);
  $("chrono-info").textContent = (historique.length ? T.numero(historique.length + 1) : "") +
    (fin ? T.termineA(heure(fin)) : T.debutVers(heure(debut)));
  $("chrono-box").classList.toggle("repetee", historique.length > 0 && !fin);

  const depasse = ecoule >= SEUIL_MIN * 60 * 1000;
  $("chrono-box").classList.toggle("depasse", depasse);
  if (depasse && !alerteDonnee && !fin) {
    alerteDonnee = true;
    alerter();
  }
}
setInterval(rafraichir, 250);

/* =====================================================================
   ALERTE DU SEUIL : vibration + bip (+ voix si elle a été activée)
   Les navigateurs bloquent le son tant que personne n'a touché la page :
   on "déverrouille" l'audio au premier contact avec l'écran.
   ===================================================================== */
let audioCtx = null;
document.addEventListener("pointerdown", () => {
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
  }
  chercherPosition();   // on profite du premier contact pour commencer à chercher la position
}, { once: true });

function bip(retard) {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.frequency.value = 880;
  osc.connect(gain); gain.connect(audioCtx.destination);
  const t = audioCtx.currentTime + retard;
  gain.gain.setValueAtTime(0.4, t);
  osc.start(t); osc.stop(t + 0.4);
}

function alerter() {
  if (navigator.vibrate) navigator.vibrate([600, 300, 600, 300, 600]);
  bip(0); bip(0.7); bip(1.4);
  if (voixActivee) parler([TEXTES[langue].alerte], true);
  notifier(SCENARIO.notif.depasse(de(qui), SEUIL_MIN),
    { titre: "Plus de " + SEUIL_MIN + " min", tags: "warning" });
}

/* =====================================================================
   SYNTHÈSE VOCALE (intégrée au navigateur, rien à installer)
   ===================================================================== */
let enLecture = false;       // la lecture est-elle en cours ?
let voixActivee = false;     // la personne a-t-elle utilisé la voix au moins une fois ?

// Enlève les balises HTML (<strong>…) pour ne lire que le texte
const sansBalises = html => html.replace(/<[^>]+>/g, "");

function parler(phrases, prioritaire) {
  if (!("speechSynthesis" in window)) return;
  if (prioritaire) speechSynthesis.cancel();
  phrases.forEach((p, i) => {
    const u = new SpeechSynthesisUtterance(sansBalises(p));
    u.lang = VOIX[langue];
    u.rate = 0.95;
    if (i === phrases.length - 1) u.onend = () => { enLecture = false; majBoutonVoix(); };
    speechSynthesis.speak(u);
  });
}

function majBoutonVoix() {
  $("btn-voix").textContent = enLecture ? TEXTES[langue].voixStop : TEXTES[langue].voix;
  $("btn-voix").classList.toggle("actif", enLecture);
}

$("btn-voix").addEventListener("click", () => {
  if (enLecture) {
    speechSynthesis.cancel();
    enLecture = false;
  } else {
    const T = TEXTES[langue];
    voixActivee = true;
    enLecture = true;
    parler([T.pendantTitre, ...T.pendant.map(e => e[1]), T.apresTitre, ...T.apres.map(e => e[1])], true);
  }
  majBoutonVoix();
});
if (!("speechSynthesis" in window)) $("btn-voix").classList.add("cache");

/* =====================================================================
   OBSERVATIONS
   On n'efface jamais une observation : "Annuler" la barre, "Rétablir" la remet.
   Les observations barrées restent visibles mais ne vont pas dans le récap.
   ===================================================================== */
function noter(id) {
  const obs = obsParId(id);
  if (!obs) return;                                // observation absente du scénario : on ignore
  observations.push({ obs, t: Date.now(), annule: false });
  if (navigator.vibrate) navigator.vibrate(60);    // petite vibration de confirmation
  afficherObservations();
}

$("obs-groupes").addEventListener("click", e => {
  const bouton = e.target.closest("[data-obs]");   // le bouton touché (même si on touche l'icône)
  if (bouton) noter(bouton.dataset.obs);
});

$("obs-liste").addEventListener("click", e => {
  const bouton = e.target.closest("[data-index]");
  if (!bouton) return;
  const o = observations[bouton.dataset.index];
  o.annule = !o.annule;                            // on inverse : annulée <-> active
  afficherObservations();
});

function afficherObservations() {
  const T = TEXTES[langue];

  // Journal : la plus récente en haut, pour la voir sans faire défiler
  $("obs-liste").innerHTML = observations
    .map((o, i) => ({ o, i }))
    .reverse()
    .map(({ o, i }) => `
      <li class="${o.annule ? "annule" : ""}">
        <span class="txt"><span class="temps">${formater(o.t - debut)}</span> · ${o.obs.ico} ${o.obs[langue]}</span>
        <button data-index="${i}">${o.annule ? T.retablir : T.annuler}</button>
      </li>`)
    .join("");
  $("journal").classList.toggle("cache", observations.length === 0);

  // Compteur sur chaque bouton (ex : "Vomissement 2")
  document.querySelectorAll("#obs-groupes [data-obs]").forEach(b => {
    const n = observations.filter(o => o.obs.id === b.dataset.obs && !o.annule).length;
    const nb = b.querySelector(".nb");
    nb.textContent = n;
    nb.classList.toggle("cache", n === 0);
  });

  if (fin) $("recap-texte").textContent = construireRecap();
  sauver();   // appelée après chaque changement (note, annulation, +1 min…) : on sauvegarde ici
}

/* =====================================================================
   RÉCAP (toujours en français : il est destiné aux parents et au SAMU)
   ===================================================================== */
// Texte d'UN épisode (c = { debut, fin, observations })
function texteEpisode(c, numero, total) {
  const actives = c.observations.filter(o => !o.annule);   // on ignore les observations annulées
  let txt = (total > 1 ? SCENARIO.recap.unite + " " + numero + " : d" : "D") + "ébut vers " + heure(c.debut) + ", ";
  txt += c.fin
    ? "fin à " + heure(c.fin) + ", durée " + formater(c.fin - c.debut) + "."
    : "EN COURS depuis " + formater(Date.now() - c.debut) + ".";
  if (actives.length) {
    txt += " Observations : " + actives
      .map(o => formater(o.t - c.debut) + " " + o.obs.fr.toLowerCase())
      .join(" ; ") + ".";
  }
  return txt;
}

// Récap complet : tous les épisodes (les précédents + celui en cours)
function construireRecap() {
  const tous = [...historique, { debut, fin, observations }];
  const nom = SCENARIO.recap.nom;
  let txt = (CONFIG.prenom ? CONFIG.prenom + " : " + nom : nom.charAt(0).toUpperCase() + nom.slice(1)) +
    " le " + new Date(tous[0].debut).toLocaleDateString("fr-FR") + ". ";
  if (tous.length > 1) txt += SCENARIO.recap.plusieurs(tous.length) + ". ";
  txt += tous.map((c, i) => texteEpisode(c, i + 1, tous.length)).join(" ");
  if (position) {
    txt += " Position : https://maps.google.com/?q=" +
      position.latitude.toFixed(5) + "," + position.longitude.toFixed(5);
  }
  return txt;
}

/* =====================================================================
   POSITION GPS
   Le téléphone demande l'autorisation. Ne marche qu'en https (GitHub Pages).
   Si on refuse, tout le reste fonctionne sans position.
   ===================================================================== */
let recherchePosition = null;
function chercherPosition() {
  if (recherchePosition) return recherchePosition;   // déjà en cours : on ne relance pas
  recherchePosition = new Promise(resolve => {
    if (!navigator.geolocation) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      p => {
        position = p.coords;
        const carte = "https://maps.google.com/?q=" + position.latitude.toFixed(5) + "," + position.longitude.toFixed(5);
        notifier("Position du témoin (touchez pour ouvrir la carte) : " + carte,
          { titre: "Position", priorite: 4, tags: "round_pushpin", lien: carte });
        afficherPosition();
        resolve(position);
      },
      () => resolve(null),                             // refusé ou impossible
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  });
  return recherchePosition;
}

// Affiche la position au-dessus des boutons d'appel : le 15 demande toujours "Où êtes-vous ?"
function afficherPosition() {
  if (!position) return;
  $("position").textContent = TEXTES[langue].positionTxt(
    position.latitude.toFixed(5), position.longitude.toFixed(5), Math.round(position.accuracy));
  $("position").classList.remove("cache");
}

/* =====================================================================
   SMS : un lien "sms:" ouvre l'appli Messages avec le texte déjà écrit.
   ===================================================================== */
$("btn-sms").addEventListener("click", async () => {
  const T = TEXTES[langue];
  if (!position) {
    $("btn-sms").textContent = T.smsPosition;
    // On attend la position au maximum 5 secondes, pas plus : il y a urgence
    await Promise.race([chercherPosition(), new Promise(r => setTimeout(r, 5000))]);
    $("btn-sms").textContent = T.sms;
  }
  noter("sms");
  if (MODE_TEST) { alert(T.testAppel + "\n\n" + construireRecap()); return; }
  sortieVoulue();
  // "?&body=" fonctionne à la fois sur iPhone et sur Android
  window.location.href = "sms:" + TEL_PARENT + "?&body=" + encodeURIComponent(construireRecap());
});

/* =====================================================================
   BOUTONS D'APPEL : on note l'appel automatiquement dans le journal
   ===================================================================== */
function surAppel(id) {
  return e => {
    noter(id);
    if (MODE_TEST) { e.preventDefault(); alert(TEXTES[langue].testAppel); }  // en entraînement on ne compose pas
    else sortieVoulue();
  };
}

/* "QUITTER LA PAGE ?" : demandé si on quitte pendant une crise en cours (bouton retour…).
   Jamais pour un appel ou un SMS : il ne faut surtout pas retarder un appel au 15. */
let sortieAutorisee = false;
function sortieVoulue() {
  sortieAutorisee = true;
  setTimeout(() => { sortieAutorisee = false; }, 3000);
}
window.addEventListener("beforeunload", e => {
  if (!fin && !sortieAutorisee) { e.preventDefault(); e.returnValue = ""; }
});
$("btn-15").addEventListener("click", surAppel("appel15"));
$("btn-parent").addEventListener("click", surAppel("appelParent"));

/* =====================================================================
   AUTRES BOUTONS
   ===================================================================== */
$("btn-plus1").addEventListener("click", () => {
  debut -= 60 * 1000;          // on recule l'heure de début d'une minute
  rafraichir();
  afficherObservations();      // les temps des observations changent aussi
});

// Affiche ou cache le récap et les boutons selon que l'épisode est fini ou non
function majModeFin() {
  $("recap").style.display = fin ? "block" : "none";
  $("btn-fin").classList.toggle("cache", !!fin);
  $("btn-plus1").classList.toggle("cache", !!fin);
  if (fin) $("recap-texte").textContent = construireRecap();
}

$("btn-fin").addEventListener("click", () => {
  if (fin) return;
  fin = Date.now();
  if ("speechSynthesis" in window) speechSynthesis.cancel();
  rafraichir();
  majModeFin();
  sauver();
  notifier(construireRecap(), { titre: SCENARIO.notif.finTitre, priorite: 4, tags: "white_check_mark" });
  $("recap").scrollIntoView({ behavior: "smooth" });
});

/* ERREUR DE MANIPULATION : "terminée" touché par erreur.
   On reprend le MÊME épisode : le chrono repart de l'heure de début, comme si on
   n'avait jamais appuyé. Les parents sont prévenus que la crise continue. */
$("btn-reprendre").addEventListener("click", () => {
  if (!fin) return;
  fin = null;
  majModeFin();
  rafraichir();
  sauver();
  garderEcranAllume();
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (SCENARIO.notif.reprise) {
    notifier(SCENARIO.notif.reprise(de(qui)), { titre: SCENARIO.notif.repriseTitre, tags: "warning" });
  }
});

/* NOUVEL ÉPISODE : on range l'épisode fini dans l'historique, puis on repart de zéro.
   Rien n'est perdu : le récap contiendra tous les épisodes. */
$("btn-nouvelle").addEventListener("click", () => {
  historique.push({ debut, fin, observations });
  debut = Date.now();
  fin = null;
  observations = [];
  alerteDonnee = false;

  majModeFin();
  $("btn-copier").textContent = TEXTES[langue].copier;
  afficherObservations();
  rafraichir();
  window.scrollTo({ top: 0, behavior: "smooth" });

  // Des épisodes qui s'enchaînent = urgence : vibration, voix, notification
  if (navigator.vibrate) navigator.vibrate([600, 300, 600]);
  if (voixActivee) parler([TEXTES[langue].alerteRepetee], true);
  notifier(SCENARIO.notif.nouvelle(de(qui), historique.length + 1, heure(debut)),
    { titre: SCENARIO.notif.nouvelleTitre, tags: "rotating_light" });
});

$("btn-copier").addEventListener("click", async () => {
  const t = $("recap-texte").textContent;
  try { await navigator.clipboard.writeText(t); $("btn-copier").textContent = TEXTES[langue].copie; }
  catch (e) { alert(t); }
});

$("langues").addEventListener("click", e => {
  const b = e.target.closest("[data-langue]");
  if (!b) return;
  langue = b.dataset.langue;
  if (enLecture) { speechSynthesis.cancel(); enLecture = false; }
  afficherTextes();
});

/* =====================================================================
   GARDER L'ÉCRAN ALLUMÉ (si le téléphone le permet)
   ===================================================================== */
async function garderEcranAllume() {
  try { if ("wakeLock" in navigator) await navigator.wakeLock.request("screen"); } catch (e) {}
}
garderEcranAllume();
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && !fin) garderEcranAllume();
});

/* =====================================================================
   HORS LIGNE : le "service worker" (sw.js) garde une copie de la page.
   Ne marche qu'en https (GitHub Pages) ou sur localhost.
   ===================================================================== */
if ("serviceWorker" in navigator && window.isSecureContext) {
  navigator.serviceWorker.register("sw.js")
    .then(() => navigator.serviceWorker.ready)
    // On dit au service worker quels fichiers sont propres à CETTE page
    .then(reg => reg.active.postMessage({
      garder: ["profils/" + PROFIL + ".js", "scenarios/" + CONFIG.scenario + ".js"]
    }))
    .catch(() => {});
}

/* C'est parti : on affiche tout */
if (MODE_TEST) {
  $("bandeau-test").classList.remove("cache");
  if (NOTIF_TEST) $("bandeau-test").dataset.t = "bandeauTestNotif";
}
majModeFin();      // si on a retrouvé un épisode déjà terminé, on réaffiche son récap
afficherTextes();
