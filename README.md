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

Le module Réseaux et infrastructures est connecté au backend Python avec Axios. Les autres modules conservent leur conversation locale.

## Pages des modules

Chaque description dépliée propose un lien vers sa page, via React Router :

- `/modules/production-stockage` : vert, panneaux solaires.
- `/modules/reseaux-infrastructures` : bleu, pylônes et lignes électriques.
- `/modules/equipements-suivi` : ambre, équipements électriques.
- `/modules/acteurs-organisations` : violet, acteurs et connexions.
- `/modules/lieux-transports` : turquoise, lieux et liaisons.

`src/pages/ModulePage.jsx` utilise le même `MessageComposer` pour les cinq modules. La palette et le motif SVG du fond, les descriptions et les suggestions proviennent du module sélectionné dans `src/data/modules.js`.

Le champ s’adapte au texte et accepte jusqu’à 2 000 caractères. Les suggestions remplissent le champ. Le bouton ou `Ctrl/Cmd + Entrée` envoie la demande pour le module Réseaux et infrastructures. Les messages restent en mémoire tant que la page du module reste ouverte, sans sauvegarde persistante.

## Connexion du module Réseaux et infrastructures

Page : http://localhost:5173/modules/reseaux-infrastructures

Le service `src/services/networkApi.js` envoie avec Axios un POST à `http://localhost:8000/api/nlp` :

```json
{"prompt":"Affiche les réseaux à Tunis","execute":true}
```

Le backend Python et Fuseki doivent être démarrés. Pour changer l'adresse du backend, copier `.env.example` vers `.env.local` et adapter `VITE_API_BASE_URL`, puis redémarrer Vite. L'origine du frontend doit être autorisée par le CORS du backend.

La conversation affiche le chargement, les ressources retournées et leurs propriétés dépliables, les résultats vides, les confirmations de création/modification/suppression et les erreurs du backend. Le bouton est désactivé pendant l'envoi pour éviter les doublons. Une erreur restaure la demande dans le champ si celui-ci est encore vide ; aucun renvoi automatique n'est effectué.

Exemples : `Affiche les réseaux à Tunis`, `Liste les transformateurs`, `Affiche les lignes haute tension`. Le vocabulaire et les opérations disponibles sont ceux du traducteur spaCy du backend. Les demandes CRUD sont exécutées par le backend avec `execute: true`.

Les liens directs et le rechargement des routes fonctionnent avec Vite et son aperçu de production. Pour un hébergement statique, configurer le serveur pour servir `index.html` sur les chemins frontend inconnus. Les routes invalides affichent une page 404.
