import { newestFirst } from './chronology.js';
import { referenceCv } from '../../../shared/cv.js';
export const profiles = {
  dev: {
    label: 'Dev', icon: '</>', caption: 'CONCEPTION & DÉVELOPPEMENT',
    title: ['Construire des idées.', 'Développer des solutions.'],
    role: 'Concepteur développeur d’applications',
    introduction: 'Diplômé du titre professionnel CDA (niveau 6), je développe des applications web avec React et Node.js. Du modèle de données à l’interface, j’aime comprendre l’ensemble pour construire une application cohérente.',
    objective: 'À la recherche d’un poste junior en conception et développement d’applications.',
    note: 'Une approche nourrie par un parcours technique, entre développement et industrie.',
    skills: referenceCv.skills.filter(group => group.category === 'dev'),
    skillsNote: 'Technologies et méthodes mentionnées dans mon CV développeur.',
    experiences: newestFirst(referenceCv.experiences),
    training: newestFirst(referenceCv.training),
    cv: "Nathan Lachery - Concepteur développeur d'applications  - CV professionnel.pdf",
  },
  industrie: {
    label: 'Industrie', icon: '⚙', caption: 'MAINTENANCE & INDUSTRIE',
    title: ['Comprendre les systèmes.', 'Veiller à leur fiabilité.'],
    role: 'Maintenance industrielle · TSMI en cours',
    introduction: 'Titulaire d’un bac professionnel en maintenance, je prépare le titre de technicien supérieur de maintenance industrielle à l’AFPI. Mon parcours associe pratique mécanique, capacité d’analyse et compétences informatiques.',
    objective: 'Formation TSMI en cours à Hénin-Beaumont, avec une fin prévue en mai 2027.',
    note: 'Du diagnostic mécanique à la logique informatique, une même attention au fonctionnement des systèmes.',
    skills: referenceCv.skills.filter(group => group.category === 'industry'),
    skillsNote: 'Acquis du bac professionnel, en cours de consolidation en TSMI.',
    experiences: newestFirst(referenceCv.experiences),
    training: newestFirst(referenceCv.training),
    cv: 'Nathan Lachery - Maintenance industrielle - CV professionnel.pdf',
  },
};

export const project = {
  title: 'Gestion de clés', date: '2024', context: 'SOFIP · Stage de 4 semaines',
  description: 'Une application réalisée seul pour la SOFIP, pour suivre les clés, les utilisateurs et leurs droits d’accès.',
  stack: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js / Express', 'MySQL / MariaDB', 'Socket.io'],
  features: [
    ['Interface', 'Interfaces React / TypeScript et Tailwind CSS.'],
    ['Accès & données', 'API REST, authentification et gestion des droits d’accès.'],
    ['Temps réel', 'Mises à jour avec Socket.io.'],
  ],
  repository: 'https://github.com/Zach3rry59/projet_stage',
};
