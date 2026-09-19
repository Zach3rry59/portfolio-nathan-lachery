# Modélisation MongoDB

MongoDB stocke des documents, validés par Mongoose. Il n’existe aucune base relationnelle dans cette application.

## Collections

| Modèle | Données | Index / contraintes |
| --- | --- | --- |
| Project | titre, slug, descriptions, catégorie, technologies, liens, image, année, contexte, fonctionnalités, mise en avant et ordre | slug unique ; catégorie `dev` ou `industry` ; index catégorie/ordre/id ; timestamps |
| Contact | nom, email, sujet, message et date de création | suppression automatique via index TTL de 180 jours |
| AdminSession | empreinte du jeton, version des identifiants et expiration | empreinte unique ; index TTL à la date d’expiration |

Les fonctionnalités sont des sous-documents intégrés au projet. Elles sont consultées et modifiées avec leur projet, sans collection séparée. Technologies et fonctionnalités sont des tableaux bornés. Les champs inconnus et opérateurs transmis par les clients sont refusés avant Mongoose. Les mises à jour utilisent `$set` construit à partir des seuls champs autorisés et exécutent les validations du schéma.

La date d’expiration d’une session est vérifiée à chaque requête : le délai de nettoyage de l’index TTL ne prolonge pas la session. Le nettoyage TTL des contacts est asynchrone et n’est pas une suppression à la seconde près.

## Initialisation et exploitation

`pnpm run seed` utilise un upsert avec `$setOnInsert` pour le seul projet confirmé. Une modification existante n’est pas écrasée. Aucun projet Industrie de démonstration n’est ajouté à la base de production.

Atlas utilise le compte applicatif `portfolio_app`, limité à `readWrite` sur la base `portfolio`. L’URI se trouve uniquement dans les secrets du backend. La liste réseau doit limiter les connexions aux adresses sortantes de l’hébergeur. L’adresse locale utilisée pour une vérification doit être retirée ensuite.

Le MongoDB de Docker Compose est destiné au développement : réseau interne, aucun port MongoDB exposé et volume persistant. Pour une base distante, utiliser Atlas avec authentification et TLS. Les tests d’intégration utilisent exclusivement une base nommée `portfolio_test`, nettoyée après leur exécution. Ils refusent toute autre base.

L’offre Atlas Free ne constitue pas une stratégie de sauvegarde. Avant de stocker des données irremplaçables, prévoir un export chiffré et tester sa restauration. Les sauvegardes peuvent contenir des messages personnels : leur conservation doit rester cohérente avec la politique de confidentialité.
