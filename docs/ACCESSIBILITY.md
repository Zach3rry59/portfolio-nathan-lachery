# Accessibilité

Le parcours cinématique est une interaction inhabituelle. Son sens est indiqué à l’écran : molette haut pour avancer, bas pour reculer. Les boutons précédent/suivant, le header et le curseur de progression évitent de dépendre de la molette.

Clavier : haut/droite/PageUp avancent ; bas/gauche/PageDown reculent ; Home/End atteignent les extrémités. Les champs de formulaire conservent leurs interactions habituelles. Les scènes inactives sont retirées de la navigation au clavier via `inert`. Les liens de saut, labels, états des contrôles et indications de focus facilitent la navigation.

Sur mobile ou écran peu haut, les contenus trop longs défilent à l’intérieur de la scène afin de rester lisibles. Les contrôles de progression restent disponibles. Le défilement tactile vers le haut avance quand le contenu interne n’a plus besoin de défiler.

FX respecte `prefers-reduced-motion` à la première visite. Une action explicite permet d’activer ou de réduire les effets, et ce choix local devient prioritaire. Le mode réduit conserve toutes les scènes, avec un décor fixe. Un stockage navigateur indisponible ne bloque pas le site.

Les formulaires possèdent des labels natifs, des erreurs associées aux champs et des messages de statut. La boîte de contact restaure le focus à sa fermeture ; les confirmations de suppression utilisent une boîte de dialogue native. Les liens externes portent une indication visuelle.

## Vérifications à maintenir

Tester les deux profils à 320, 390, 768 et 1280 pixels, le zoom navigateur, les petites hauteurs, Tab/Shift+Tab, les dialogues et le changement de profil depuis Contact. Contrôler la lisibilité des contrastes dans les deux thèmes et les mouvements en mode réduit. Les tests automatisés de dimensions ne remplacent pas l’inspection visuelle ni une évaluation avec des utilisateurs de lecteurs d’écran.

Ce projet ne revendique pas une certification de conformité WCAG ou RGAA.
