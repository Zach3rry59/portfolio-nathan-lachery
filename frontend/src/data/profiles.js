import { newestFirst } from './chronology.js';
// Informations professionnelles fournies et confirmées par Nathan Lachery.
// Le BTS est une première année suivie, le TSMI une formation en cours.
const developmentExperience = {
  date: '2024 · 4 semaines', title: 'Développeur d’applications stagiaire',
  organization: 'SOFIP · Douai',
  description: 'Réalisation en autonomie d’une application de gestion de clés : suivi des clés, utilisateurs et droits d’accès. Interfaces React / TypeScript, API REST et mises à jour en temps réel.',
};
const industrialExperiences = [
  { date: '2014 et 2015', title: 'Mécanicien', organization: 'COMOTEQ', description: 'Remplacement d’un moteur thermique et de pièces défaillantes. Travaux de soudure.' },
  { date: 'Mai – juin 2013', title: 'Stagiaire en maintenance industrielle', organization: 'SEVEL NORD', description: 'Participation à la maintenance préventive et systématique. Observation d’interventions de maintenance curative.' },
];
const developmentTraining = [
  { date: '2024', title: 'Concepteur développeur d’applications', organization: 'SOFIP · Douai', detail: 'Titre professionnel · Niveau 6' },
  { date: '2022', title: 'Développeur web et web mobile', organization: 'SOFIP · Douai', detail: 'Titre professionnel · Niveau 5' },
];
const industrialTraining = [
  { date: 'En cours', title: 'Technicien supérieur de maintenance industrielle', organization: 'AFPI · Hénin-Beaumont', detail: 'TSMI · Fin prévue : mai 2027' },
  { date: '2016', title: 'BTS Maintenance industrielle', organization: 'Lycée La Salle Deforest de Lewarde · Douai', detail: 'Première année suivie' },
  { date: '2015', title: 'Bac professionnel MEI', organization: 'Lycée La Salle Deforest de Lewarde · Douai', detail: 'Maintenance des équipements industriels' },
];
export const profiles = {
  dev: {
    label: 'Dev', icon: '</>', caption: 'CONCEPTION & DÉVELOPPEMENT',
    title: ['Construire des idées.', 'Développer des solutions.'],
    role: 'Concepteur développeur d’applications',
    introduction: 'Diplômé du titre professionnel CDA (niveau 6), je développe des applications web avec React et Node.js. Du modèle de données à l’interface, j’aime comprendre l’ensemble pour construire une application cohérente.',
    objective: 'À la recherche d’un poste junior en conception et développement d’applications.',
    note: 'Une approche nourrie par un parcours technique, entre développement et industrie.',
    skills: [
      { label: '01 / Interface', items: ['React', 'TypeScript', 'JavaScript', 'HTML / CSS', 'Tailwind CSS'] },
      { label: '02 / Application & données', items: ['Node.js', 'Express', 'API REST', 'SQL', 'MySQL / MariaDB', 'Socket.io'] },
      { label: '03 / Méthode & outils', items: ['Git', 'Agile / Kanban', 'Authentification', 'Droits d’accès'] },
    ],
    skillsNote: 'Technologies et méthodes mentionnées dans mon CV développeur.',
    experiences: newestFirst([developmentExperience, ...industrialExperiences]),
    training: newestFirst([...developmentTraining, ...industrialTraining]),
    cv: "Nathan Lachery - Concepteur développeur d'applications  - CV professionnel.pdf",
  },
  industrie: {
    label: 'Industrie', icon: '⚙', caption: 'MAINTENANCE & INDUSTRIE',
    title: ['Comprendre les systèmes.', 'Veiller à leur fiabilité.'],
    role: 'Maintenance industrielle · TSMI en cours',
    introduction: 'Titulaire d’un bac professionnel en maintenance, je prépare le titre de technicien supérieur de maintenance industrielle à l’AFPI. Mon parcours associe pratique mécanique, capacité d’analyse et compétences informatiques.',
    objective: 'Formation TSMI en cours à Hénin-Beaumont, avec une fin prévue en mai 2027.',
    note: 'Du diagnostic mécanique à la logique informatique, une même attention au fonctionnement des systèmes.',
    skills: [
      { label: '01 / Maintenance', items: ['Maintenance préventive', 'Maintenance corrective', 'Diagnostic de panne'] },
      { label: '02 / Systèmes industriels', items: ['Mécanique', 'Électricité industrielle', 'Pneumatique', 'Hydraulique', 'Automatismes'] },
      { label: '03 / Compétences complémentaires', items: ['Programmation', 'Bases de données'] },
    ],
    skillsNote: 'Acquis du bac professionnel, en cours de consolidation en TSMI.',
    experiences: newestFirst([developmentExperience, ...industrialExperiences]),
    training: newestFirst([...developmentTraining, ...industrialTraining]),
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
