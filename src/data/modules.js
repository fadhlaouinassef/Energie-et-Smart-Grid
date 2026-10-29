const modules = [
  {
    name: "Production et stockage",
    slug: "production-stockage",
    theme: "production",
    headline: "De la source à la réserve.",
    suggestions: [
      "Affiche les installation",
      "Liste les batteries",
      "Affiche la réserve de puissance",
    ],
    icon: "solar",
    tag: "PRODUIRE",
    description:
      "Explorez les sources de production et les réserves d’énergie.",
    detail:
      "Du panneau solaire à la batterie, comprenez les liens entre les installations de production et les solutions de stockage.",
  },
  {
    name: "Réseaux et infrastructures",
    slug: "reseaux-infrastructures",
    theme: "network",
    headline: "Explorez les connexions.",
    suggestions: [
      "Affiche les réseaux à Tunis",
      "Liste les transformateurs",
      "Affiche les lignes haute tension",
    ],
    icon: "grid",
    tag: "CONNECTER",
    description:
      "Découvrez les réseaux, lignes électriques et transformateurs.",
    detail:
      "Suivez les relations entre les infrastructures qui acheminent l’électricité, de sa production à sa distribution.",
  },
  {
    name: "Équipements et suivi énergétique",
    slug: "equipements-suivi",
    theme: "equipment",
    headline: "Comprendre chaque usage.",
    suggestions: [
      "Quels équipements sont installés dans ce bâtiment ?",
      "Quelles mesures sont liées à cet équipement ?",
      "Quels incidents concernent cette installation ?",
    ],
    icon: "equipment",
    tag: "COMPRENDRE",
    description: "Consultez les équipements, mesures et incidents.",
    detail:
      "Reliez les équipements à leurs installations, à leurs mesures et aux incidents pour mieux comprendre les usages énergétiques.",
  },
  {
    name: "Acteurs et organisations",
    slug: "acteurs-organisations",
    theme: "people",
    headline: "Les énergies se rencontrent.",
    suggestions: [
      "Quelle organisation gère cette installation ?",
      "Quels techniciens interviennent sur ce site ?",
      "Quels acteurs sont liés à ce réseau ?",
    ],
    icon: "people",
    tag: "COLLABORER",
    description:
      "Identifiez les utilisateurs, techniciens et organismes impliqués.",
    detail:
      "Découvrez les relations entre les personnes, les organisations et les installations dont elles assurent la gestion.",
  },
  {
    name: "Lieux et transports",
    slug: "lieux-transports",
    theme: "places",
    headline: "Chaque lieu est connecté.",
    suggestions: [
      "Quels sites sont desservis par ce réseau ?",
      "Où se situe cette installation ?",
      "Quels transports sont associés à ce site ?",
    ],
    icon: "place",
    tag: "LOCALISER",
    description:
      "Explorez les sites desservis et les transports d’électricité ou de matériel.",
    detail:
      "Situez les installations dans leur environnement et comprenez les liaisons entre sites, réseaux et transports.",
  },
];

export default modules;
