/**
 * Configuration et contenu de la landing page
 * Toutes les données sont centralisées ici pour faciliter la maintenance
 */

// ===== HERO SECTION =====

export const heroData = {
  badge: '💍 Été 2026',
  title: {
    couple: 'Guillaume & [Nom]',
    action: 'se marient',
  },
  subtitle: [
    'Plutôt que de vous faire venir à nous,',
    'nous viendrons à vous.',
  ],
  description: [
    'En tenue de cérémonie, avec nos rires et nos maladresses,',
    'pour célébrer l\'amour dans vos salons, vos jardins, vos cuisines.',
  ],
  explanation: [
    'Un mariage itinérant à travers villes et pays,',
    'pour que personne ne reste dehors,',
    'et que chaque moment soit vraiment partagé.',
  ],
  stats: [
    { number: '12', label: 'villes' },
    { number: '3', label: 'pays' },
    { number: '1', label: 'promesse' },
    { number: '∞', label: 'souvenirs' },
  ],
};

// ===== STORY SECTION (Problem.jsx) =====

export const storyData = {
  title: 'Comment on en est arrivés là',
  subtitle: 'L\'histoire d\'un choix un peu fou, mais tellement évident',
  cards: [
    {
      icon: '💫',
      title: 'Le début',
      description:
        '[À personnaliser : racontez comment vous vous êtes rencontrés en 2-3 phrases touchantes. Par exemple : "Nous nous sommes rencontrés un soir d\'automne à Paris, autour d\'un projet commun. Un regard, un sourire, et tout a commencé."]',
    },
    {
      icon: '🗺️',
      title: 'Nos vies, en pointillés',
      description:
        'Nos amis et familles sont partout. Paris, Lyon, Bruxelles, Tokyo... Comment rassembler tous ces univers en un seul endroit ? Impossible. Alors on a décidé de ne pas choisir.',
    },
    {
      icon: '💡',
      title: 'L\'idée folle',
      description:
        'Et si au lieu de vous faire voyager, on venait vous voir ? En tenue de mariage, avec nos vœux dans la poche et des étoiles dans les yeux. Un mariage itinérant. Un peu fou, complètement nous.',
    },
    {
      icon: '🏡',
      title: 'Ce qu\'on veut vraiment',
      description:
        'Pas 5 minutes dans une file de réception. De vrais moments. Vous voir dans vos espaces, partager un café, un repas, un fou rire. Célébrer avec chacun, vraiment.',
    },
  ],
  promise: {
    title: '💝 Notre promesse',
    content:
      'On préfère passer une heure avec chacun de vous qu\'une minute avec 200 personnes en même temps.',
    signature: 'Ce mariage, c\'est notre façon de dire que vous comptez. Chacun. Vraiment.',
  },
};

// ===== VALUES SECTION (Benefits.jsx) =====

export const valuesData = {
  title: 'Pourquoi c\'est important pour nous',
  subtitle: 'Derrière ce choix un peu fou, il y a des convictions profondes',
  values: [
    {
      icon: '🤝',
      title: 'Personne ne reste dehors',
      description:
        'Mamie qui ne peut plus voyager. L\'ami à Tokyo. Le cousin en fauteuil. Tout le monde compte. Tout le monde est là. C\'est nous qui nous adaptons.',
    },
    {
      icon: '❤️',
      title: 'De vrais moments',
      description:
        'Pas de protocole rigide. Pas de stress logistique. Juste nous, vous, et le temps de se retrouver vraiment. Pas de faux-semblants.',
    },
    {
      icon: '☕',
      title: 'La proximité plutôt que la quantité',
      description:
        'On préfère une heure avec vous qu\'une minute avec 200 personnes. Les grands rassemblements, c\'est beau. Mais les petits moments, c\'est précieux.',
    },
    {
      icon: '🚀',
      title: 'Un mariage-épopée',
      description:
        'C\'est un peu fou ? Oui. C\'est compliqué ? Aussi. Mais c\'est notre histoire. Une aventure à travers villes et vies, pour célébrer l\'amour partout où il habite.',
    },
  ],
  finalMessage: {
    intro: 'Ce mariage, c\'est notre manière à nous de dire :',
    highlight: 'Vous êtes importants. Chacun. Vraiment.',
  },
};

// ===== DREAM SECTION (Solution.jsx) =====

export const dreamData = {
  title: 'À quoi ça ressemble, ce mariage ?',
  subtitle: 'Un mariage qui voyage plutôt qu\'un mariage qui rassemble',
  scenes: [
    {
      icon: '🌅',
      title: 'Le réveil en tenue de cérémonie',
      description:
        'On se réveille dans une ville. On enfile nos habits de mariés. Et on part frapper à votre porte, comme si c\'était la première fois.',
    },
    {
      icon: '☕',
      title: 'Chez vous, simplement',
      description:
        'Votre salon, votre jardin, votre cuisine. On s\'installe. On partage. On rit. On pleure peut-être. Le temps s\'arrête. C\'est notre mariage, chez vous.',
    },
    {
      icon: '💍',
      title: 'Autant de cérémonies que d\'étapes',
      description:
        'Chaque visite est unique. Un gâteau ici, des vœux là-bas, une chanson ailleurs. Le mariage se construit, morceau par morceau, avec vous.',
    },
    {
      icon: '✨',
      title: 'Des souvenirs gravés',
      description:
        'Pas de photo de groupe géante où on ne vous voit pas. Mais des moments vrais, capturés, partagés. Votre regard. Notre rire. Cette lumière dans votre salon.',
    },
  ],
  quote: 'Le mariage n\'est pas un lieu, c\'est un voyage.',
};

// ===== JOURNEY SECTION (Itinerary.jsx) =====

export const journeyData = {
  title: 'L\'itinéraire de notre mariage',
  subtitle: 'De ville en ville, de cœur en cœur, notre mariage prendra forme',
  steps: [
    {
      step: '01',
      city: 'Paris',
      subtitle: 'Le départ',
      date: 'Juin 2026',
      description:
        'Tout commence ici. Famille proche, amis de toujours. Les premiers vœux, les premières larmes. Le mariage démarre.',
    },
    {
      step: '02',
      city: 'Lyon',
      subtitle: 'Les racines',
      date: 'Juin 2026',
      description:
        'Retour aux sources. Les amis d\'enfance, les lieux qui nous ont construits. Une étape pleine de nostalgie.',
    },
    {
      step: '03',
      city: '[Ville 3]',
      subtitle: 'À personnaliser',
      date: '[Date]',
      description:
        '[Décrivez cette étape de votre itinéraire en 1-2 phrases. Qui allez-vous voir ? Pourquoi cette ville est importante ?]',
    },
    {
      step: '04',
      city: '[Ville finale]',
      subtitle: 'La boucle se ferme',
      date: '[Date]',
      description:
        'On revient, changés. Plus mariés qu\'au départ. Le voyage nous a transformés, et vous avec.',
    },
  ],
  footnote: '💫 L\'itinéraire complet sera dévoilé progressivement aux invités',
};

// ===== CTA SECTION =====

export const ctaData = {
  title: 'Venez faire partie de notre histoire',
  message: {
    main: 'Ce mariage itinérant, c\'est notre façon de dire :',
    highlight: 'vous comptez. Chacun. Vraiment.',
    closing: 'Alors ouvrez-nous votre porte, et faites partie de l\'aventure.',
  },
  buttons: {
    primary: {
      text: 'Confirmer ma présence',
      link: '/login',
    },
    secondary: {
      text: 'Questions fréquentes',
      link: '#faq',
    },
  },
  footnote: '(Préparez le café, on arrive. Et peut-être des mouchoirs, on ne promet rien.)',
};

// ===== FOOTER =====

export const footerData = {
  couple: 'Guillaume & [Nom]',
  message: [
    'Merci d\'être dans nos vies.',
    'Merci de faire partie de cette aventure.',
    'On a hâte de vous retrouver.',
  ],
  signature: 'Avec amour,',
  links: [
    { icon: '🗺️', text: 'Voir l\'itinéraire', href: '#itinerary' },
    { icon: '❓', text: 'Questions fréquentes', href: '#faq' },
    { icon: '✉️', text: 'Nous contacter', href: '#contact' },
    { icon: '🎁', text: 'Liste de mariage', href: '#gifts' },
  ],
  social: {
    title: 'Suivez l\'aventure',
    links: [
      { emoji: '📸', title: 'Instagram', href: '#' },
      { emoji: '📷', title: 'Album partagé', href: '#' },
      { emoji: '#️⃣', title: 'Hashtag', href: '#' },
    ],
  },
  copyright: {
    main: 'Fait avec ❤️ par Guillaume (qui code quand même un peu)',
    sub: 'Ce site est notre invitation. Prenez-le comme tel.',
  },
};
