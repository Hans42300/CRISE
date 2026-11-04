/* =====================================================================
   SCÉNARIO : CRISE D'ÉPILEPSIE
   Un scénario contient tout ce qui est propre à une situation :
   les consignes, les observations, le seuil d'alerte et les textes des notifications.
   Le moteur (moteur.js) ne change pas d'une situation à l'autre.

   Pour créer un nouveau scénario : copie ce fichier, renomme-le (ex : allergie.js),
   remplace les textes, puis mets scenario: "allergie" dans config.js.
   ⚠ Les consignes doivent être relues par un professionnel de santé.
   ===================================================================== */
const SCENARIO = {
  id: "epilepsie",
  seuilAlerteMin: 5,            // au-delà : alerte rouge + "appelez le 15"

  /* Mots utilisés dans le récap et les notifications (toujours en français) */
  recap: {
    nom: "crise d'épilepsie",   // "Crise d'épilepsie de 14:02 à 14:04 (durée 2 min 10 s)."
    unite: "Crise",             // "Crise 1 de …", "Crise 2 en cours…"
    plusieurs: n => n + " crises à la suite"
  },
  /* deQui arrive déjà accordé : "de Léo", "d'Emma", "de l'enfant" */
  notif: {
    depasse: (deQui, min) => "La crise " + deQui + " dure depuis plus de " + min + " minutes. La page a demandé au témoin d'appeler le 15.",
    nouvelle: (deQui, num, h) => "Nouvelle crise " + deQui + " (n°" + num + ") à " + h + ". Les crises s'enchaînent : la page demande au témoin d'appeler le 15.",
    nouvelleTitre: "Nouvelle crise",
    reprise: deQui => "Erreur de manipulation : la crise " + deQui + " n'est PAS terminée. Le chrono a repris.",
    repriseTitre: "Crise en cours (erreur corrigée)",
    finTitre: "Crise terminée"
  },

  /* Textes affichés, dans chaque langue.
     Une clé présente ici remplace celle du moteur (ex : "plus1").
     GENRE : écrire {masculin|féminin}, ex : "tournez-{le|la}".
     Le moteur garde le bon mot selon CONFIG.genre du profil. */
  textes: {
    fr: {
      titre: "Crise d'épilepsie : que faire ?",
      titrePrenom: p => p + " fait une crise d'épilepsie",
      termineA: h => "Crise terminée à " + h,
      alerte: "Plus de 5 minutes : appelez le 15 maintenant",
      plus1: "La crise a commencé avant : +1 min",
      fin: "La crise est terminée",
      nouvelle: "⚠️ Une nouvelle crise commence",
      numero: n => "Crise n°" + n + " · ",
      alerteRepetee: "Les crises s'enchaînent : appelez le 15 maintenant",
      pendantTitre: "Pendant la crise",
      pendant: [
        ["⏱️", "Restez calme et <strong>restez à côté</strong>. Le chrono tourne."],
        ["🧥", "<strong>Protégez la tête</strong> avec un vêtement plié ou un sac."],
        ["🪑", "<strong>Écartez</strong> les objets durs ou dangereux. Retirez ses lunettes."],
        ["👔", "Desserrez ce qui serre le cou (col, écharpe)."],
        ["✋", "<span class='non'>Ne retenez pas</span> ses mouvements."],
        ["🚫", "<span class='non'>Ne mettez rien</span> dans sa bouche, même pas les doigts."],
        ["🤢", "<strong>{S'il|Si elle} vomit</strong> : tournez-{le|la} sur le côté dès que possible pour qu'{il|elle} ne s'étouffe pas."]
      ],
      video: ["📹", "<strong>Si une 2e personne est là</strong>, elle peut filmer la crise (utile pour son médecin), puis envoyer la vidéo aux parents et la supprimer."],
      apresTitre: "Quand les secousses s'arrêtent",
      apres: [
        ["🛌", "Mettez en <strong>position latérale de sécurité</strong> (sur le côté)."],
        ["🫁", "Vérifiez qu'{il|elle} <strong>respire</strong>. Une respiration bruyante juste après est fréquente."],
        ["💬", "Restez présent, parlez doucement. La fatigue et la confusion sont normales."],
        ["🥤", "<span class='non'>Ne donnez rien</span> à boire ou à manger avant le réveil complet."],
        ["👥", "<strong>Ne {le|la} laissez pas {seul|seule}</strong> tant qu'{il|elle} n'est pas bien {réveillé|réveillée}."],
        ["✅", "Appuyez sur <strong>« La crise est terminée »</strong> en haut."]
      ],
      appelTitre: "Appelez le 15 si…",
      appelTexte: "La crise dure <strong>plus de 5 minutes</strong> · les crises s'enchaînent · blessure · difficulté à respirer · crise dans l'eau · pas de réveil après la crise.",
      groupes: { debut: "Début", corps: "Mouvements", signes: "Autres signes", fin: "Fin de crise", actions: "Ce qui a été fait" }
    },
    en: {
      titre: "Epileptic seizure: what to do",
      titrePrenom: p => p + " is having an epileptic seizure",
      termineA: h => "Seizure ended at " + h,
      alerte: "Over 5 minutes: call 15 (or 112) now",
      plus1: "It started earlier: +1 min",
      fin: "The seizure is over",
      nouvelle: "⚠️ Another seizure is starting",
      numero: n => "Seizure #" + n + " · ",
      alerteRepetee: "Seizures are repeating: call 15 (or 112) now",
      pendantTitre: "During the seizure",
      pendant: [
        ["⏱️", "Stay calm and <strong>stay close</strong>. The timer is running."],
        ["🧥", "<strong>Protect the head</strong> with a folded jacket or a bag."],
        ["🪑", "<strong>Move away</strong> hard or dangerous objects. Remove glasses."],
        ["👔", "Loosen anything tight around the neck."],
        ["✋", "<span class='non'>Do not hold</span> the person down."],
        ["🚫", "<span class='non'>Put nothing</span> in their mouth, not even fingers."],
        ["🤢", "<strong>If they vomit</strong>: turn them on their side as soon as possible so they don't choke."]
      ],
      video: ["📹", "<strong>If a second person is there</strong>, they can film the seizure (useful for the doctor), then send the video to the parents and delete it."],
      apresTitre: "When the jerking stops",
      apres: [
        ["🛌", "Put them in the <strong>recovery position</strong> (on their side)."],
        ["🫁", "Check they are <strong>breathing</strong>. Noisy breathing right after is common."],
        ["💬", "Stay with them, speak softly. Tiredness and confusion are normal."],
        ["🥤", "<span class='non'>Give nothing</span> to eat or drink until fully awake."],
        ["👥", "<strong>Do not leave them alone</strong> until fully awake."],
        ["✅", "Tap <strong>“The seizure is over”</strong> at the top."]
      ],
      appelTitre: "Call 15 (or 112) if…",
      appelTexte: "The seizure lasts <strong>over 5 minutes</strong> · seizures follow one another · injury · trouble breathing · seizure in water · they don't wake up afterwards.",
      groupes: { debut: "Start", corps: "Movements", signes: "Other signs", fin: "End of seizure", actions: "What was done" }
    },
    es: {
      titre: "Crisis epiléptica: qué hacer",
      titrePrenom: p => p + " tiene una crisis epiléptica",
      termineA: h => "Crisis terminada a las " + h,
      alerte: "Más de 5 minutos: llame al 15 (o al 112) ahora",
      plus1: "Empezó antes: +1 min",
      fin: "La crisis ha terminado",
      nouvelle: "⚠️ Empieza otra crisis",
      numero: n => "Crisis n.º " + n + " · ",
      alerteRepetee: "Las crisis se repiten: llame al 15 (o al 112) ahora",
      pendantTitre: "Durante la crisis",
      pendant: [
        ["⏱️", "Mantenga la calma y <strong>quédese al lado</strong>. El cronómetro corre."],
        ["🧥", "<strong>Proteja la cabeza</strong> con una prenda doblada o una bolsa."],
        ["🪑", "<strong>Aparte</strong> los objetos duros o peligrosos. Quítele las gafas."],
        ["👔", "Afloje lo que apriete el cuello."],
        ["✋", "<span class='non'>No sujete</span> sus movimientos."],
        ["🚫", "<span class='non'>No ponga nada</span> en su boca, ni siquiera los dedos."],
        ["🤢", "<strong>Si vomita</strong>: póngale de lado lo antes posible para que no se ahogue."]
      ],
      video: ["📹", "<strong>Si hay una segunda persona</strong>, puede grabar la crisis (útil para el médico), enviar el vídeo a los padres y después borrarlo."],
      apresTitre: "Cuando paran las sacudidas",
      apres: [
        ["🛌", "Póngale en <strong>posición lateral de seguridad</strong> (de lado)."],
        ["🫁", "Compruebe que <strong>respira</strong>. Es frecuente una respiración ruidosa justo después."],
        ["💬", "Quédese a su lado, hable con calma. El cansancio y la confusión son normales."],
        ["🥤", "<span class='non'>No le dé nada</span> de comer ni de beber hasta que esté bien {despierto|despierta}."],
        ["👥", "<strong>No le deje {solo|sola}</strong> hasta que esté bien {despierto|despierta}."],
        ["✅", "Pulse <strong>«La crisis ha terminado»</strong> arriba."]
      ],
      appelTitre: "Llame al 15 (o al 112) si…",
      appelTexte: "La crisis dura <strong>más de 5 minutos</strong> · las crisis se repiten · herida · dificultad para respirar · crisis en el agua · no se despierta después.",
      groupes: { debut: "Inicio", corps: "Movimientos", signes: "Otros signos", fin: "Fin de la crisis", actions: "Lo que se ha hecho" }
    }
  },

  /* Ordre d'affichage des groupes de boutons */
  groupesAffiches: ["debut", "corps", "signes", "fin", "actions"],

  /* Boutons d'observation.
     - "fr" sert aussi pour le récap (destiné aux parents / SAMU)
     - siProtocole: true → visible seulement si un protocole est rempli dans config.js
     - siVideo: true     → visible seulement si consigneVideo est activé
     Les observations du groupe "auto" (appel15, appelParent, sms) sont exigées par le moteur. */
  observations: [
    { groupe: "debut",   id: "nonvu",     ico: "❓", fr: "Début non vu",              en: "Start not seen",           es: "Inicio no visto" },
    { groupe: "debut",   id: "cri",       ico: "📢", fr: "Cri / bruit au début",      en: "Cry / sound at start",     es: "Grito / ruido al inicio" },
    { groupe: "debut",   id: "chute",     ico: "⬇️", fr: "Chute",                     en: "Fall",                     es: "Caída" },

    { groupe: "corps",   id: "raide",     ico: "🧍", fr: "Corps raide",               en: "Body stiff",               es: "Cuerpo rígido" },
    { groupe: "corps",   id: "secG",      ico: "⬅️", fr: "Secousses côté gauche",     en: "Jerking left side",        es: "Sacudidas lado izquierdo" },
    { groupe: "corps",   id: "secD",      ico: "➡️", fr: "Secousses côté droit",      en: "Jerking right side",       es: "Sacudidas lado derecho" },
    { groupe: "corps",   id: "sec2",      ico: "↔️", fr: "Secousses des 2 côtés",     en: "Jerking both sides",       es: "Sacudidas ambos lados" },
    { groupe: "corps",   id: "teteG",     ico: "↩️", fr: "Tête / yeux tournés à gauche", en: "Head / eyes turned left", es: "Cabeza / ojos hacia la izquierda" },
    { groupe: "corps",   id: "teteD",     ico: "↪️", fr: "Tête / yeux tournés à droite", en: "Head / eyes turned right", es: "Cabeza / ojos hacia la derecha" },
    { groupe: "corps",   id: "regard",    ico: "👀", fr: "Regard fixe / yeux révulsés", en: "Staring / eyes rolled",  es: "Mirada fija / ojos en blanco" },
    { groupe: "corps",   id: "bouche",    ico: "👄", fr: "Mâchonne / mouvements de bouche", en: "Chewing / mouth movements", es: "Mastica / movimientos de boca" },

    { groupe: "signes",  id: "vomi",      ico: "🤢", fr: "Vomissement",               en: "Vomiting",                 es: "Vómito" },
    { groupe: "signes",  id: "bave",      ico: "💦", fr: "Bave / salive abondante",   en: "Drooling / foaming",       es: "Babeo / mucha saliva" },
    { groupe: "signes",  id: "levres",    ico: "🔵", fr: "Lèvres bleues",             en: "Blue lips",                es: "Labios azules" },
    { groupe: "signes",  id: "urine",     ico: "💧", fr: "Perte d'urine",             en: "Loss of urine",            es: "Pérdida de orina" },
    { groupe: "signes",  id: "langue",    ico: "👅", fr: "Morsure de langue",         en: "Bitten tongue",            es: "Mordedura de lengua" },
    { groupe: "signes",  id: "blessure",  ico: "🩹", fr: "Blessure",                  en: "Injury",                   es: "Herida" },

    { groupe: "fin",     id: "stop",      ico: "⏸️", fr: "Secousses arrêtées",        en: "Jerking stopped",          es: "Sacudidas paradas" },
    { groupe: "fin",     id: "respire",   ico: "😮‍💨", fr: "Respire normalement",     en: "Breathing normally",       es: "Respira normal" },
    { groupe: "fin",     id: "reponds",   ico: "🗣️", fr: "Répond / se réveille",      en: "Responds / wakes up",      es: "Responde / se despierta" },
    { groupe: "fin",     id: "confus",    ico: "😵", fr: "{Somnolent / confus|Somnolente / confuse}", en: "Drowsy / confused", es: "{Somnoliento / confuso|Somnolienta / confusa}" },

    { groupe: "actions", id: "pls",       ico: "🛌", fr: "{Mis|Mise} en PLS",             en: "Recovery position",        es: "Posición lateral" },
    { groupe: "actions", id: "medoc",     ico: "💊", fr: "Médicament d'urgence donné", en: "Rescue medicine given",   es: "Medicamento de urgencia dado", siProtocole: true },
    { groupe: "actions", id: "video",     ico: "📹", fr: "Vidéo filmée",              en: "Video recorded",           es: "Vídeo grabado", siVideo: true },
    { groupe: "actions", id: "appel15",   ico: "📞", fr: "15 appelé",                 en: "15 called",                es: "15 llamado" },
    { groupe: "actions", id: "secours",   ico: "🚑", fr: "Secours arrivés",           en: "Paramedics arrived",       es: "Llegaron los servicios" },
    { groupe: "auto",    id: "appelParent", ico: "📞", fr: "Parent appelé",           en: "Parent called",            es: "Padres llamados" },
    { groupe: "auto",    id: "sms",       ico: "✉️", fr: "SMS envoyé",                en: "Text sent",                es: "SMS enviado" }
  ]
};
