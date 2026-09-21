// SOFIP : code vérifié au commit 8af281ebe6f6ca6bf4b8332d376bbb79eb13b83a.
// Les choix techniques décrivent le code, pas des difficultés personnelles supposées.
export const projectDetails = {
  'gestion-de-cles-sofip': {
    description: 'Application web de gestion de clés réalisée pendant mon stage de développement à la SOFIP en 2024. Elle permet de consulter les clés par centre, de distinguer les clés libres de celles attribuées à un employé et de naviguer entre villes, centres, salles et employés. Le frontend React dialogue avec une API Express et une base MySQL / MariaDB.',
    role: 'Projet réalisé entièrement par moi pendant un stage de 4 semaines : interface, API et accès aux données.',
    problem: 'Suivre la disponibilité et l’attribution des clés dans les centres SOFIP, en lien avec les employés et les salles.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js / Express', 'MySQL / MariaDB', 'Socket.io', 'Git'],
    features: [
      { title: 'Clés et attributions', description: 'Consultation des clés par centre, distinction libre / attribuée et accès à la fiche de l’employé détenteur.' },
      { title: 'Administration', description: 'Écrans de création et de modification des villes, centres, salles, employés, clés et utilisateurs. Les routes d’écriture des clés vérifient l’utilisateur et son rôle administrateur.' },
      { title: 'API et données', description: 'Backend organisé en routes, contrôleurs et modèles. Les modèles exécutent les requêtes SQL ; les contrôleurs renvoient les réponses HTTP. Les clés référencent un centre et un employé.' },
      { title: 'Synchronisation temps réel', description: 'Après création, modification ou suppression d’une clé, le serveur émet newKey via Socket.io. React écoute cet événement et recharge les clés depuis l’API.' },
      { title: 'Organisation du frontend', description: 'Pages avec React Router, composants d’administration, hooks de chargement et stores Zustand. Des types TypeScript décrivent les comptes, centres, salles, clés et employés.' },
    ],
    screenshots: [],
  },
  'portfolio-nathan-lachery': {
    description: 'Portfolio présentant mes parcours Développement et Industrie dans une interface React / Vite. La progression cinématique, le réglage des animations et le carousel infini structurent la consultation. Une API Express et MongoDB alimentent les projets et le contenu du CV, avec un fallback public lorsque l’API est indisponible.',
    problem: 'Présenter deux parcours professionnels dans un même site, tout en permettant la mise à jour des contenus sans modifier le code du frontend.',
    features: [
      { title: 'Expérience de consultation', description: 'Navigation cinématique, profils Dev / Industrie, contrôleur FX respectant la préférence système et carousel infini utilisable à la souris ou au toucher.' },
      { title: 'Contenu administrable', description: 'Authentification Admin et CRUD des projets, expériences, formations et groupes de compétences. Les messages Contact peuvent être consultés, marqués lus ou non lus et supprimés.' },
      { title: 'API et stockage documentaire', description: 'API Express, schémas Mongoose, validation des entrées et données stockées dans MongoDB Atlas. Les projets sont filtrés par catégorie et triés par ordre d’affichage.' },
      { title: 'Continuité de lecture', description: 'Le frontend conserve un fallback public pour le CV et les projets. Un profil sans projet ne comporte ni scène Portfolio ni raccourci vers celle-ci.' },
      { title: 'Livraison et vérifications', description: 'Backend Docker hébergé sur Render, frontend sur Cloudflare Pages. GitHub Actions exécute les tests, le build et les contrôles de livraison ; CodeQL analyse le code. Tests de sécurité applicative de base.' },
    ],
    screenshots: [],
  },
};
