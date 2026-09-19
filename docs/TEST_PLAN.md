# Tests et vérifications

## Automatisation locale

```powershell
pnpm run lint
pnpm test
pnpm run build
```

Les tests Node couvrent l’API avec un repository isolé : validation, réponses dégradées, CORS, limites JSON et quotas, connexion, expiration, révocation, CRUD, catégories, opérateurs NoSQL et URL dangereuses. Les tests frontend couvrent le calcul de progression, la conservation des scènes et le cache des projets. Le build vérifie l’intégrité de compilation, pas le rendu.

## MongoDB réel et Docker

`pnpm run test:integration` exige `MONGODB_TEST_URI` pointant vers une base nommée exactement `portfolio_test`. Les tests vérifient les écritures, l’unicité des slugs, les contacts, la suppression et les sessions avec Mongoose et MongoDB réels. La base de test est supprimée après l’exécution. Sans URI, ces tests sont marqués ignorés, jamais considérés comme réussis.

GitHub Actions démarre MongoDB 8 pour cette suite, construit le frontend, puis construit et démarre Docker Compose. Le contrôle HTTP vérifie que le conteneur communique avec MongoDB ; un contrôle distinct vérifie l’utilisateur non-root. Aucun secret Atlas n’est nécessaire dans la CI.

## Navigateur

En développement, ouvrir `/test/cinema-check.html` et lancer les contrôles. Le rapport vérifie les deux sens de molette, les positions fractionnaires, le viewport immobile, les changements de profil, FX, les largeurs 320/390/768/1280, les états API vide/lente/indisponible et l’échappement du texte. Les fixtures restent uniquement dans les tests ; elles ne sont pas intégrées au build public ni injectées dans Atlas.

Compléter par une inspection visuelle desktop et mobile de chaque scène, des menus, du formulaire, des dialogues et de l’admin. Utiliser une vraie interaction molette et le clavier. Une mesure requestAnimationFrame est un indicateur local, pas une garantie de 60 FPS sur chaque appareil.

## Livraison

Vérifier le hash du commit, la réussite CI/CodeQL, les journaux des builds hébergeurs, l’état `/api/health`, le catalogue, les liens CV/EF SET/LinkedIn et le rendu des URL publiques. Effectuer ensuite un nouveau push et constater un nouveau déploiement. Un workflow présent dans Git n’est pas la preuve d’une CI ni d’un déploiement réussis.

## Dernière vérification locale

Le 19 septembre 2026 : 16 tests Node réussis, lint réussi, build réussi, 19 contrôles navigateur réussis. Les résultats Docker, MongoDB d’intégration et production doivent être confirmés séparément lors du déploiement.
