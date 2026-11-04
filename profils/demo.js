/* =====================================================================
   PROFIL "demo" : utilisé quand l'adresse ne contient pas ?p=…
   Ne mets AUCUNE donnée personnelle ici : c'est la page que voit un curieux.

   POUR UN NOUVEL ENFANT : copie ce fichier dans le dossier profils/ sous un nom
   IMPRÉVISIBLE (ex : k7f3x9a2.js, jamais leo.js), remplis-le,
   puis écris dans son tag NFC / QR : https://…/crise/?p=k7f3x9a2

   CONFIG : les réglages d'un enfant.
   Laisse une valeur vide ("") pour masquer l'élément correspondant.
   ⚠ Cette page est lisible par n'importe qui : prénom seulement, pas de nom de famille,
   pas de dossier médical.
   ===================================================================== */
const CONFIG = {
  scenario: "epilepsie",      // nom du fichier dans le dossier scenarios/ (sans ".js")

  prenom: "",                 // ex : "Léo"
  genre: "",                  // "m" = garçon, "f" = fille (accorde les consignes : "tournez-le" / "tournez-la")
  telParent: "",              // ex : "06 12 34 56 78" (espaces acceptés ; sert à l'appel ET au SMS)
  nomParent: "",              // ex : "sa maman"
  protocole: "",              // texte exact du PAI validé par le médecin, sinon laisser vide

  seuilAlerteMin: null,       // null = valeur du scénario (5 min pour l'épilepsie)
  consigneVideo: false,       // true = propose de filmer (UNIQUEMENT si les parents sont d'accord)
  ntfyCanal: ""               // nom SECRET du canal ntfy (ex : "alerte-2f09ca5c1eb8"), vide = désactivé
};
