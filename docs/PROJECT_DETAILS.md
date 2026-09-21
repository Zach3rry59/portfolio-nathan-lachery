# Fiches projet

Le carousel ouvre une boîte de dialogue native : Échap ferme la fiche, le focus revient au bouton d’ouverture et le défilement reste dans la fiche. Un déplacement du pointeur supérieur à 8 pixels annule le clic d’ouverture.

Le CRUD projet existant gère `description`, `context`, `features` et les nouveaux champs facultatifs `problem`, `role`, `challenges`, `solutions`, `screenshots`. Les sections sans contenu sont masquées. Chaque capture comporte une `url` HTTP(S) sans identifiants et un `alt` obligatoire ; maximum 8 captures. L’ordre du tableau est l’ordre de la galerie. Les fichiers restent hébergés ailleurs : aucun upload ni stockage média supplémentaire. La limite globale du corps JSON de l’API reste applicable.

La migration `project-details-v1` enrichit les deux projets existants sans en créer. Elle ne remplace un champ que s’il est absent ou identique à sa valeur de référence initiale. Le marqueur de migration empêche de réintroduire un contenu ensuite retiré par l’administrateur. Le seed et le fallback utilisent les mêmes fiches enrichies.

## Sources du contenu

SOFIP : stage de quatre semaines en 2024 et réalisation individuelle. Code examiné au [commit 8af281e](https://github.com/Zach3rry59/projet_stage/tree/8af281ebe6f6ca6bf4b8332d376bbb79eb13b83a) :

- `backend/routes/keysRoute.js` : routes de lecture et d’écriture, vérifications utilisateur/administrateur.
- `backend/controllers/keysController.js`, `backend/socket.js`, `src/routes/App.jsx` : émission de `newKey` après écriture, réception et rechargement des données.
- `backend/models/keysModel.js`, `roomsModel.js` : accès SQL, centre et employé associés aux clés.
- `src/components/KeysList/KeysList.jsx` : disponibilité des clés et lien vers l’employé.
- `src/main.jsx`, `src/store.ts`, `src/types/types.ts` : navigation, stores et types métier.

Ces observations ne constituent ni un audit du projet SOFIP ni un récit de difficultés personnelles. Aucune capture réelle n’est présente dans ce dépôt ; l’illustration du carousel est explicitement identifiée comme telle.

Portfolio : fonctionnalités confirmées dans les composants React, hooks de navigation, routes Express, modèles Mongoose, tests et configurations Docker/GitHub Actions du présent dépôt. Les hébergements sont Cloudflare Pages, Render et MongoDB Atlas. Aucun résultat chiffré ni technologie supplémentaire n’est attribué au projet.

## Vérifications ciblées

`node --test backend/test/project-details.test.js` couvre validation, compatibilité, droits d’écriture, captures, ordre et migration sans écrasement. L’intégration MongoDB vérifie aussi la migration et les captures dans la base jetable `portfolio_test`. Les vérifications navigateur couvrent ouverture, fermeture, clavier, drag/clic, galerie, absence de sections vides et viewport mobile. Les fixtures restent isolées de la production.
