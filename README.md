# Nathan Lachery — Portfolio

**Site public : [portfolio-nathan-lachery.pages.dev](https://portfolio-nathan-lachery.pages.dev)**

CV interactif à deux profils, Développement et Industrie. La molette vers le haut avance, vers le bas recule, dans un viewport fixe. Les boutons, le clavier et la progression offrent d’autres moyens de navigation.

Accès candidature : [Développement](https://portfolio-nathan-lachery.pages.dev/dev) · [Maintenance industrielle](https://portfolio-nathan-lachery.pages.dev/maintenance). Chaque entrée sélectionne le profil correspondant et ouvre sa présentation ; les liens CV et Contact sont directement disponibles. La route Maintenance met en avant la recherche de stage TSMI, sans publier de dates de stage non confirmées.

## Stack

React, Vite, CSS et Node.js/Express. MongoDB avec Mongoose conserve les projets, les expériences, les formations, les groupes de compétences, les messages de contact et les sessions administrateur. Le backend est conteneurisé avec Docker. Le contenu du CV et un catalogue de secours restent disponibles sans API.

## Démarrage

Prérequis : Node.js 24 et pnpm 11.19.0.

```powershell
pnpm install --frozen-lockfile
Copy-Item .env.example .env
pnpm run dev
```

Frontend : http://127.0.0.1:5173. API : http://127.0.0.1:3001/api/health. Renseigner `MONGODB_URI` dans le fichier local `.env` pour activer les écritures. Aucun secret ne doit être placé dans une variable `VITE_*` ou dans Git.

```powershell
pnpm run lint
pnpm test
pnpm run build
docker compose up --build -d --wait
```

Le build frontend est produit dans `frontend/dist`. Docker Compose lance le backend et une base MongoDB locale isolée, sans publier le port de MongoDB. `pnpm run seed` ajoute les deux projets Dev confirmés (SOFIP et ce portfolio) sans écraser un projet existant.

## Administration

La route `/admin` permet de créer, modifier et supprimer des projets `dev` ou `industry`. Configurer `ADMIN_EMAIL` et générer `ADMIN_PASSWORD_HASH` avec `pnpm run admin:password`. Le mot de passe se saisit dans le terminal sans affichage. Les sessions expirent après une heure, restent uniquement en mémoire dans le navigateur et sont révoquées à la déconnexion.

À partir de deux projets, une carte principale forme un carousel infini, navigable par flèches, clavier et glissement. Les projets suivent leur champ `order` ; les parcours professionnels conservent toujours une chronologie décroissante identique dans les deux profils. Un profil sans projet n’affiche ni scène ni lien Portfolio. Le bouton FX respecte la préférence système puis conserve le choix manuel. Les données de secours ne contiennent aucun projet Industrie inventé.

## Documentation

- [Architecture et API](docs/ARCHITECTURE.md)
- [Modélisation MongoDB](docs/DATABASE.md)
- [Sécurité applicative](docs/SECURITY.md)
- [Tests](docs/TEST_PLAN.md)
- [Accessibilité](docs/ACCESSIBILITY.md)
- [Déploiement](docs/DEPLOYMENT.md)

Le formulaire conserve les messages dans MongoDB ; il n’envoie pas d’email. Une panne de la base produit une erreur explicite, jamais une confirmation d’enregistrement. Le lien email reste disponible. La politique de confidentialité est accessible à `/privacy`.

Les fiches projet détaillent les réalisations et proposent une galerie. Les quatre captures SOFIP montrent l’application originale restaurée en 2026 avec des données fictives ; le projet a été réalisé en stage en 2024. Les champs et sources sont décrits dans [Fiches projet](docs/PROJECT_DETAILS.md).

L’admin gère également les expériences, formations, compétences et messages Contact. Les migrations préservent les éditions existantes ; les suppressions ne sont pas réintroduites au redémarrage. Les notifications email restent désactivées : la consultation se fait dans l’admin.

Cloudflare Pages publie le frontend et Render le backend Docker après la CI GitHub Actions. Le build génère des entrées HTML pour `/dev` et `/maintenance`, leurs métadonnées, canonical, Open Graph, `robots.txt` et `sitemap.xml`. Le domaine public existant est conservé afin de maintenir les liens déjà diffusés.

Le certificat [EF SET](https://cert.efset.org/ZL3F62) et le profil [LinkedIn](https://www.linkedin.com/in/nathan-lachery/) sont accessibles via leurs liens publics respectifs.
