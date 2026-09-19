import '../styles/admin.css';
export default function Privacy() {
  return <main className="admin-shell"><a href="/">← Retour au portfolio</a><article className="admin-panel" style={{ marginTop: 32 }}>
    <h1>Confidentialité</h1>
    <p>Nathan Lachery est le destinataire et responsable du traitement des messages envoyés depuis ce portfolio.</p>
    <h2>Formulaire de contact</h2><p>Le nom, l’email, le sujet et le message sont utilisés pour répondre à votre demande et assurer le suivi de cet échange professionnel. Les champs demandés sont nécessaires à ce traitement. La base juridique est l’intérêt légitime à répondre aux sollicitations reçues.</p>
    <p>Les messages enregistrés sont supprimés automatiquement de la base après 180 jours. Ils ne sont ni vendus ni utilisés à des fins publicitaires. L’email reste disponible si le formulaire est indisponible.</p>
    <h2>Hébergement et accès</h2><p>Seul Nathan accède au contenu des messages, ainsi que les prestataires techniques nécessaires au fonctionnement du site et de la base de données. Les hébergeurs peuvent traiter des journaux techniques pour la sécurité et le fonctionnement de leurs services.</p>
    <h2>Vos droits</h2><p>Pour demander l’accès, la rectification, l’effacement, la limitation ou vous opposer au traitement de vos données, écrivez à <a href="mailto:lachery.nathan59@gmail.com">lachery.nathan59@gmail.com</a>. Vous pouvez également adresser une réclamation à la CNIL.</p>
    <h2>Stockage dans votre navigateur</h2><p>Le choix FX et une copie des projets publics permettent de conserver vos préférences et de consulter le portfolio lorsque l’API est indisponible. Le cache des projets est valable sept jours. Aucun outil publicitaire ou de mesure d’audience n’est intégré. L’administration garde son jeton de connexion uniquement en mémoire jusqu’à la déconnexion, l’expiration ou le rechargement.</p>
  </article></main>;
}
