# Énergie & Smart Grid

Page d’accueil du projet universitaire de Web sémantique de l’équipe VORTEX — ESPRIT.

## Démarrage

```sh
npm install
npm run dev
```

Sous PowerShell, si `npm.ps1` est bloqué, utiliser `npm.cmd`.

## Commandes

- `npm run dev` : serveur local Vite.
- `npm run build` : compilation de production dans `dist/`.
- `npm run preview` : aperçu de la compilation.
- `npm run lint` : vérification avec Oxlint.

## Page d’accueil

React et CSS avec Tailwind déjà configuré. Palette vert électrique (`#c5f36b`), vert forêt (`#203c2f`) et blanc cassé (`#fafbf6`). Les couleurs principales sont définies dans `src/index.css`.

`src/App.jsx` déclare les routes. `src/pages/HomePage.jsx` assemble les composants de `src/components/` : navigation, sections de la page, illustration Smart Grid et footer. Les données des cinq modules sont dans `src/data/modules.js`. Les animations sont isolées dans `src/hooks/useHomeAnimations.js` et `src/hooks/useHeroAnimations.js`. La navigation de la page d’accueil utilise des ancres ; aucune donnée énergétique ni réponse IA n’est simulée.

GSAP et ScrollTrigger animent l’entrée du hero, les révélations des sections et les flux d’énergie. Le visuel suit aussi le défilement avec une parallaxe réversible (déplacement vertical et réduction progressive de taille), allégée sur mobile. Les animations sont nettoyées au démontage et désactivées lorsque `prefers-reduced-motion` est actif. Le défilement reste natif, les icônes et l’illustration sont locales, sans service externe.

Seule la page frontend est implémentée. Le backend Python, les requêtes SPARQL, la base RDF/OWL et l’assistant IA restent à connecter.

## Pages des modules

Chaque description dépliée propose un lien vers sa page, via React Router :

- `/modules/production-stockage` : vert, panneaux solaires.
- `/modules/reseaux-infrastructures` : bleu, pylônes et lignes électriques.
- `/modules/equipements-suivi` : ambre, équipements électriques.
- `/modules/acteurs-organisations` : violet, acteurs et connexions.
- `/modules/lieux-transports` : turquoise, lieux et liaisons.

`src/pages/ModulePage.jsx` utilise le même `MessageComposer` pour les cinq modules. La palette et le motif SVG du fond, les descriptions et les suggestions proviennent du module sélectionné dans `src/data/modules.js`.

Le champ s’adapte au texte et accepte jusqu’à 2 000 caractères. Les suggestions remplissent le champ. Le bouton ou `Ctrl/Cmd + Entrée` ajoute la question à la conversation locale. Les messages restent en mémoire uniquement tant que la page du module reste ouverte : aucune requête à un assistant ni sauvegarde persistante n’est réalisée.

Les liens directs et le rechargement des routes fonctionnent avec Vite et son aperçu de production. Pour un hébergement statique, configurer le serveur pour servir `index.html` sur les chemins frontend inconnus. Les routes invalides affichent une page 404.
