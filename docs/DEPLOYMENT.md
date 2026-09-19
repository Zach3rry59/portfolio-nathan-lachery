# Déploiement

Le frontend statique et l’API sont déployés séparément. MongoDB reste dans Atlas ; aucun secret de base n’est nécessaire au frontend.

## Backend Docker — Render

Créer un Web Service connecté au dépôt GitHub, branche `main`, runtime Docker, contexte racine et Dockerfile `backend/Dockerfile`. Sélectionner explicitement le plan Free et une région européenne. Le processus écoute le `PORT` fourni par l’hébergeur et `HOST=0.0.0.0`.

Variables privées à configurer dans Render :

| Variable | Valeur |
| --- | --- |
| NODE_ENV | production |
| HOST | 0.0.0.0 |
| TRUST_PROXY | 1, après contrôle du proxy hébergeur |
| CLIENT_ORIGIN | origine HTTPS exacte du frontend |
| MONGODB_URI | URI Atlas avec la base `/portfolio`, utilisateur limité et mot de passe encodé |
| ADMIN_EMAIL | identifiant choisi par le propriétaire |
| ADMIN_PASSWORD_HASH | hash scrypt produit localement par `pnpm run admin:password` |

Health check : `/api/health`. Il indique séparément la disponibilité de MongoDB ; une réponse HTTP 200 prouve que le serveur répond, pas que la base fonctionne. Ajouter les adresses sortantes Render dans la liste réseau Atlas. Éviter `0.0.0.0/0`. Ne pas laisser l’adresse de test locale après validation.

Le plan gratuit peut se mettre en veille. Le catalogue de secours reste visible pendant le réveil ; le contact et l’admin exigent une base disponible. Le formulaire propose l’email en cas d’échec. Ne pas utiliser un service de requêtes artificielles pour empêcher la veille.

## Frontend — Cloudflare Pages

Connexion Git native au même dépôt, branche de production `main`, racine du dépôt, commande `pnpm run build`, sortie `frontend/dist`. Utiliser Node 24 et pnpm 11.19.0. Configurer `VITE_API_URL` avec l’URL HTTPS du backend suivie de `/api`. Cette valeur est publique.

Les en-têtes de sécurité sont dans `frontend/public/_headers`. Pages doit servir `index.html` pour les routes React `/admin` et `/privacy`. Vérifier ces accès directs après déploiement. Les previews ne doivent pas recevoir de secrets ni être autorisées par une règle CORS générique ; ajouter uniquement une origine de preview explicitement approuvée si nécessaire.

## CI et mises à jour

Le workflow CI exécute lint, tests unitaires/HTTP, intégration MongoDB, build, audit des dépendances et contrôle Docker. CodeQL analyse JavaScript. Dependabot couvre npm, Actions et Docker. Activer les alertes et la protection contre la publication de secrets dans les paramètres GitHub quand disponibles.

L’intégration native des hébergeurs doit déclencher un build à chaque push sur `main`. Sur Render, sélectionner le déploiement après réussite des contrôles CI si proposé. La livraison doit confirmer un premier déploiement et un second cycle push → CI → build → production. Ne pas confondre génération d’un build local et publication réelle.

## Retour arrière

Utiliser le redéploiement d’un commit connu chez l’hébergeur, puis corriger Git avec un commit de revert. Ne pas réécrire l’historique partagé. Une restauration de code ne restaure pas les documents MongoDB : exporter les données avant une transformation risquée. Un changement des variables `VITE_*` exige un nouveau build frontend.

Référence : [intégration Git Cloudflare Pages](https://developers.cloudflare.com/pages/configuration/git-integration/).
