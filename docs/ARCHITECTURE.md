# Architecture

Le frontend React est une application Vite statique. Les scènes partagent les mêmes composants et des variables CSS propres à chaque profil. Les informations du CV sont dans `frontend/src/data`, indépendantes du serveur. Une boucle requestAnimationFrame interpole une progression continue ; les scènes utilisent profondeur, échelle et opacité sans déplacer verticalement la page.

`useProjects` charge uniquement la catégorie active via `/api/projects?category=dev` ou `industry`, puis trie par `order` et identifiant. Chaque catégorie possède son état et sa clé de cache ; une réponse tardive est annulée au changement de profil. Une copie validée est conservée au maximum sept jours dans localStorage pour supporter une indisponibilité. Une réponse vide est conservée comme telle ; elle ne déclenche pas le retour automatique d’un projet supprimé. Sans copie valide, aucun lien Portfolio ne clignote pendant le chargement. En cas de panne, les deux projets Dev confirmés de `shared/projects.js` prennent le relais ; Industrie reste vide. Le catalogue est filtré par catégorie avant de construire les scènes et la navigation.

Express sépare routes, validation, contrôleurs, services et modèles Mongoose. Le repository centralise les accès à MongoDB. Les validations partagées évitent de faire diverger le formulaire et l’API ; le serveur reste l’autorité.

## API

| Méthode et route | Accès / résultat |
| --- | --- |
| GET /api/health | Public ; état du serveur et de MongoDB |
| GET /api/projects | Public ; catalogue, filtre optionnel `?category=dev` ou `industry` |
| GET /api/projects/:id | Public ; détail ou 404 |
| POST /api/contact | Public ; 201 après écriture effective |
| POST /api/auth/login | Email et mot de passe ; session opaque d’une heure |
| GET /api/auth/me | Session valide requise |
| POST /api/auth/logout | Révocation de la session courante |
| POST /api/projects | Administrateur ; création |
| PATCH /api/projects/:id | Administrateur ; modification validée |
| DELETE /api/projects/:id | Administrateur ; suppression définitive |

L’en-tête `Authorization: Bearer …` porte la session administrateur. Les erreurs ont une enveloppe `error` avec un code et un message. Les lectures de projets indiquent leur source et la disponibilité de MongoDB dans `meta`. Aucune écriture ne réussit en mode de secours.

## Limites volontaires

Un seul administrateur, aucun service distribué, pas de gestionnaire de fichiers ni d’envoi d’email. Les images utilisent une URL HTTP(S), sans chargement arbitraire par le backend. La montée en charge et la messagerie administrateur sont hors du périmètre actuel.
