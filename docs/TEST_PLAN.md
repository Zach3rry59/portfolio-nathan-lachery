# Tests et vérifications

## Automatisation locale

```powershell
pnpm run lint
pnpm test
pnpm run build
```

Les tests Node couvrent l’API avec un repository isolé : validation, réponses dégradées, CORS, limites JSON et quotas, connexion, expiration, révocation, CRUD, catégories, opérateurs NoSQL et URL dangereuses. Les tests frontend couvrent le calcul de progression, la conservation des scènes et le cache des projets. Le build vérifie l’intégrité de compilation, pas le rendu.

## MongoDB réel et Docker

`pnpm run test:integration` exige `NODE_ENV=test` et `MONGODB_TEST_URI` pointant vers une base locale nommée exactement `portfolio_test`. Les hôtes distants, dont Atlas, sont refusés avant connexion. Les tests vérifient les écritures, l’unicité des slugs, les contacts, la suppression et les sessions avec Mongoose et MongoDB réels. Deux passages du seed vérifient son idempotence et la conservation des éditions administrateur. La base de test est supprimée après l’exécution. Sans URI, ces tests sont marqués ignorés, jamais considérés comme réussis.

GitHub Actions démarre MongoDB 8 pour cette suite, construit le frontend, puis construit et démarre Docker Compose. Le contrôle HTTP vérifie que le conteneur communique avec MongoDB ; un contrôle distinct vérifie l’utilisateur non-root. Aucun secret Atlas n’est nécessaire dans la CI.

## Navigateur

Lancer `pnpm test:preview`, puis ouvrir `http://127.0.0.1:5174/test/cinema-check.html`. Les onze contrôles ciblés couvrent les boucles, le clavier, les catégories, les états zéro/un/deux projets, le retour vers Contact, le chargement sans flash et la non-exécution XSS. La fixture refuse les écritures et le réseau réel ; son catalogue est cloné, sans accès au cache public. Le cadre est vidé en fin de test.

`/test/mobile-check.html` fournit un viewport de 390 × 844 dans un iframe et un test d’événements Pointer tactiles simulés. Compléter par un drag souris et une inspection visuelle avec FX. La simulation ne remplace pas un essai sur téléphone physique. Ces pages exigent le mode Vite `test` et sont absentes du build public.

## Livraison

Vérifier le hash du commit, la réussite CI/CodeQL, les journaux des builds hébergeurs, l’état `/api/health`, le catalogue, les liens CV/EF SET/LinkedIn et le rendu des URL publiques. Effectuer ensuite un nouveau push et constater un nouveau déploiement. Un workflow présent dans Git n’est pas la preuve d’une CI ni d’un déploiement réussis.

## Vérifications ciblées

Six tests Node de chronologie/cache/navigation/carousel, un scénario CRUD catégories/order/featured et onze contrôles navigateur ciblés vérifiés localement. Les résultats d’intégration MongoDB, Docker et de livraison sont consultables dans GitHub Actions. Le rendu desktop et mobile doit être vérifié séparément du build.
