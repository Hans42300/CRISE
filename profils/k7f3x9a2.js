/* =====================================================================
   EXEMPLE DE PROFIL (enfant fictif "Léo", numéro fictif).
   Adresse à mettre dans son tag : https://…/crise/?p=k7f3x9a2
   CONFIG : les réglages d'un enfant.
   Laisse une valeur vide ("") pour masquer l'élément correspondant.
   ⚠ Cette page est lisible par n'importe qui : prénom seulement, pas de nom de famille,
   pas de dossier médical.
   ===================================================================== */
const CONFIG = {
  scenario: "epilepsie",      // nom du fichier dans le dossier scenarios/ (sans ".js")

  prenom: "Léo",
  genre: "m",                 // "m" = garçon, "f" = fille (accorde les consignes : "tournez-le" / "tournez-la")
  telParent: "0600000000",    // ex : "06 12 34 56 78" (espaces acceptés ; sert à l'appel ET au SMS)
  nomParent: "Marine",              // ex : "sa maman"
  protocole: "",              // texte exact du PAI validé par le médecin, sinon laisser vide

  seuilAlerteMin: null,       // null = valeur du scénario (5 min pour l'épilepsie)
  consigneVideo: true,       // true = propose de filmer (UNIQUEMENT si les parents sont d'accord)
  ntfyCanal: ""               // nom SECRET du canal ntfy (ex : "alerte-2f09ca5c1eb8"), vide = désactivé
};
