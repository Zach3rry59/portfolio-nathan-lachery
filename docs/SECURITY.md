# Sécurité applicative de base

Ces protections et tests ne constituent pas un pentest professionnel ni une garantie d’absence de vulnérabilité.

## Authentification

Un administrateur est configuré dans les variables du backend. Le mot de passe est dérivé avec scrypt (N=32768, r=8, p=3), un sel aléatoire et une comparaison en temps constant. Le format stocké ne contient pas le mot de passe. Une seule dérivation simultanée est acceptée et les tentatives sont limitées à dix par quinze minutes et par IP.

La connexion crée un jeton aléatoire de 256 bits. Seule son empreinte SHA-256 est conservée dans MongoDB. La session expire après une heure et la déconnexion la révoque. Un changement du hash administrateur suivi d’un redémarrage invalide les anciennes sessions. Le navigateur ne conserve le jeton qu’en mémoire React ; recharger impose une nouvelle connexion.

Les écritures exigent explicitement l’en-tête Authorization. Aucun cookie d’authentification n’est envoyé automatiquement : les attaques CSRF par formulaire intersite ne disposent pas de session ambiante. Cela ne protège pas d’un script exécuté dans la même origine ; React échappe le texte et une CSP est configurée sur le frontend.

## Entrées et réseau

- Validation par liste de champs autorisés, types et tailles bornés, refus des opérateurs NoSQL et des clés inattendues.
- Identifiants MongoDB stricts, catégories fermées, liens HTTP(S) sans identifiants intégrés.
- Limite JSON de 12 Ko ; contacts limités à cinq requêtes par quinze minutes.
- CORS utilise des origines exactes ; ce n’est pas un mécanisme d’authentification.
- Helmet, réponses API non mises en cache, messages d’erreur sans pile ni secret.
- MongoDB accessible avec TLS et un compte limité à la seule base du projet.
- Conteneur Node non privilégié ; MongoDB local non publié sur l’hôte.

`TRUST_PROXY=1` est prévu pour le proxy de production. Ne pas utiliser une confiance illimitée : elle permettrait de falsifier l’IP servant à la limitation. Vérifier les en-têtes et le nombre de proxies de l’hébergeur avant de modifier ce réglage.

## Secrets et maintenance

Les fichiers `.env` sont exclus de Git et du contexte Docker. Seuls des exemples sans secrets sont publiés. Les variables `VITE_*` sont publiques car intégrées au JavaScript : ne jamais y mettre de secret. Ne pas journaliser les corps de connexion/contact ni les URI MongoDB.

En cas de fuite : changer le mot de passe Atlas ou le hash administrateur, redéployer puis contrôler les accès. Supprimer une valeur d’un fichier ne l’efface pas de l’historique Git. Dependabot propose les mises à jour ; la CI vérifie dépendances, code et tests. Les fonctions GitHub de détection de secrets doivent être activées dans les paramètres du dépôt.

Limites : pas de MFA administrateur applicatif, de protection distribuée contre les abus ni de service anti-spam externe. La limitation mémoire repart de zéro au redémarrage, ce qui convient à cette instance unique mais pas à un déploiement horizontal.

Référence : [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html).
