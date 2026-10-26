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

`src/App.jsx` assemble les composants de `src/components/` : navigation, sections de la page, illustration Smart Grid et footer. Les données des cinq modules sont dans `src/data/modules.js`. Les animations sont isolées dans `src/hooks/useHomeAnimations.js` et `src/hooks/useHeroAnimations.js`. Les liens utilisent des ancres ; aucune donnée énergétique ni réponse IA n’est simulée.

GSAP et ScrollTrigger animent l’entrée du hero, les révélations des sections et les flux d’énergie. Le visuel suit aussi le défilement avec une parallaxe réversible (déplacement vertical et réduction progressive de taille), allégée sur mobile. Les animations sont nettoyées au démontage et désactivées lorsque `prefers-reduced-motion` est actif. Le défilement reste natif, les icônes et l’illustration sont locales, sans service externe.

Seule la page frontend est implémentée. Le backend Python, les requêtes SPARQL, la base RDF/OWL et l’assistant IA restent à connecter.
