/**
 * Projets personnels — Portfolio GEII d'Aymeric Noirot
 * ------------------------------------------------------------
 * GUIDE DE PERSONNALISATION :
 * 1. Remplissez un emplacement ci-dessous en remplaçant les textes
 *    de préparation par votre projet réalisé, puis passez `isPlaceholder: false`
 *    et `status: 'Terminé'` (ou `'En cours'`).
 * 2. Pour afficher une photo ou un schéma personnel, placez votre fichier
 *    dans le dossier `images/` et renseignez `image: 'images/mon-projet.jpg'`.
 *    Laissez `image: ''` pour conserver le visuel vectoriel SVG.
 * 3. Pour ajouter un nouveau projet, dupliquez simplement un objet complet
 *    dans le tableau `PERSONAL_PROJECTS` avec un `id` unique.
 * 4. Catégories reconnues par les filtres de la page :
 *    - 'Embarqué & IoT'
 *    - 'Électronique & PCB'
 *    - 'Robotique'
 *    - 'Logiciel & Outils'
 *
 * Schéma partagé par window.PortfolioUI :
 * { id, title, subtitle, category, filterCategories, date, context,
 *   team, status, isPlaceholder, image, competences, summary, problem,
 *   solution, sections, highlights, stack, credits, svg, links }
 */
(function (global) {
  'use strict';

  function escapeSvgText(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function createPortfolioSchematicSvg() {
    return (
      '<svg viewBox="0 0 400 220" width="400" height="220" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
        '<rect width="400" height="220" fill="var(--surface-visual)"/>' +
        '<rect x="18" y="16" width="364" height="188" rx="8" fill="var(--surface-1)" stroke="var(--border)" stroke-width="1"/>' +
        '<line x1="18" y1="46" x2="382" y2="46" stroke="var(--border)" stroke-width="1"/>' +
        '<circle cx="34" cy="31" r="3" fill="var(--accent)"/>' +
        '<circle cx="45" cy="31" r="3" fill="var(--border-hover)"/>' +
        '<circle cx="56" cy="31" r="3" fill="var(--border-hover)"/>' +
        '<text x="70" y="34" fill="var(--text-muted)" font-family="JetBrains Mono, monospace" font-size="8.5">ARCHITECTURE STATIQUE · MULTI-PAGES</text>' +
        '<rect x="292" y="22" width="76" height="18" rx="4" fill="var(--accent-tint)" stroke="var(--accent-border)" stroke-width="1"/>' +
        '<text x="330" y="34" text-anchor="middle" fill="var(--accent-bright)" font-family="JetBrains Mono, monospace" font-size="8" font-weight="500">GITHUB PAGES</text>' +
        '<rect x="34" y="68" width="94" height="68" rx="6" fill="var(--surface-visual)" stroke="var(--border-hover)" stroke-width="1.1"/>' +
        '<text x="81" y="88" text-anchor="middle" fill="var(--text-primary)" font-family="JetBrains Mono, monospace" font-size="9" font-weight="500">DONNÉES JS</text>' +
        '<line x1="48" y1="98" x2="114" y2="98" stroke="var(--border)" stroke-width="1"/>' +
        '<text x="81" y="112" text-anchor="middle" fill="var(--text-muted)" font-family="JetBrains Mono, monospace" font-size="7.5">SAÉ IUT Bordeaux</text>' +
        '<text x="81" y="124" text-anchor="middle" fill="var(--text-muted)" font-family="JetBrains Mono, monospace" font-size="7.5">Projets &amp; Filtres</text>' +
        '<line x1="128" y1="102" x2="152" y2="102" stroke="var(--accent)" stroke-width="1.4" stroke-dasharray="3 2"/>' +
        '<circle cx="152" cy="102" r="2.2" fill="var(--accent-bright)"/>' +
        '<rect x="153" y="64" width="94" height="76" rx="6" fill="var(--accent-tint)" stroke="var(--accent)" stroke-width="1.2"/>' +
        '<text x="200" y="85" text-anchor="middle" fill="var(--accent-bright)" font-family="JetBrains Mono, monospace" font-size="9" font-weight="600">UI &amp; MODALE</text>' +
        '<line x1="167" y1="95" x2="233" y2="95" stroke="var(--accent-border)" stroke-width="1"/>' +
        '<text x="200" y="110" text-anchor="middle" fill="var(--text-primary)" font-family="JetBrains Mono, monospace" font-size="7.5">HTML5 · CSS3 Vars</text>' +
        '<text x="200" y="123" text-anchor="middle" fill="var(--text-muted)" font-family="JetBrains Mono, monospace" font-size="7.5">Vanilla JS · ARIA</text>' +
        '<line x1="247" y1="102" x2="271" y2="102" stroke="var(--accent)" stroke-width="1.4" stroke-dasharray="3 2"/>' +
        '<circle cx="271" cy="102" r="2.2" fill="var(--accent-bright)"/>' +
        '<rect x="272" y="68" width="94" height="68" rx="6" fill="var(--surface-visual)" stroke="var(--border-hover)" stroke-width="1.1"/>' +
        '<text x="319" y="88" text-anchor="middle" fill="var(--text-primary)" font-family="JetBrains Mono, monospace" font-size="9" font-weight="500">DÉPLOIEMENT</text>' +
        '<line x1="286" y1="98" x2="352" y2="98" stroke="var(--border)" stroke-width="1"/>' +
        '<text x="319" y="112" text-anchor="middle" fill="var(--text-muted)" font-family="JetBrains Mono, monospace" font-size="7.5">Git Versioning</text>' +
        '<text x="319" y="124" text-anchor="middle" fill="var(--accent-bright)" font-family="JetBrains Mono, monospace" font-size="7.5">HTTPS · 0 Build</text>' +
        '<line x1="34" y1="158" x2="366" y2="158" stroke="var(--border)" stroke-width="1"/>' +
        '<text x="200" y="176" text-anchor="middle" fill="var(--text-primary)" font-family="Inter, sans-serif" font-size="10.5" font-weight="500">aymeric-noirot-portfolio · Architecture Web Modulaire</text>' +
        '<text x="200" y="192" text-anchor="middle" fill="var(--text-muted)" font-family="JetBrains Mono, monospace" font-size="8">4 pages thématiques · Fiches projets illustrées · Responsive</text>' +
      '</svg>'
    );
  }

  function createPlaceholderSvg(slotNumber, categoryLabel, slotTitle) {
    var safeCategory = escapeSvgText(categoryLabel);
    var safeTitle = escapeSvgText(slotTitle || ('Prototype personnel ' + slotNumber));

    return (
      '<svg viewBox="0 0 400 220" width="400" height="220" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
        '<rect width="400" height="220" fill="var(--surface-visual)"/>' +
        '<rect x="20" y="18" width="360" height="184" rx="8" fill="var(--surface-1)" stroke="var(--border)" stroke-width="1" stroke-dasharray="5 5"/>' +
        '<path d="M20 34 V24 Q20 18 26 18 H36" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round"/>' +
        '<path d="M364 18 H374 Q380 18 380 24 V34" stroke="var(--border-hover)" stroke-width="1.5" stroke-linecap="round"/>' +
        '<path d="M20 186 V196 Q20 202 26 202 H36" stroke="var(--border-hover)" stroke-width="1.5" stroke-linecap="round"/>' +
        '<path d="M364 202 H374 Q380 202 380 196 V186" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round"/>' +
        '<rect x="34" y="32" width="122" height="22" rx="4" fill="var(--accent-tint)" stroke="var(--accent)" stroke-width="1.1"/>' +
        '<text x="95" y="46" text-anchor="middle" fill="var(--accent-bright)" font-family="JetBrains Mono, monospace" font-size="8.5" font-weight="500">EN PRÉPARATION · ' + slotNumber + '</text>' +
        '<text x="366" y="46" text-anchor="end" fill="var(--text-muted)" font-family="JetBrains Mono, monospace" font-size="9">' + safeCategory + '</text>' +
        '<rect x="172" y="76" width="56" height="44" rx="6" fill="var(--accent-tint)" stroke="var(--accent-border)" stroke-width="1.2"/>' +
        '<line x1="200" y1="88" x2="200" y2="108" stroke="var(--accent-bright)" stroke-width="1.5" stroke-linecap="round"/>' +
        '<line x1="190" y1="98" x2="210" y2="98" stroke="var(--accent-bright)" stroke-width="1.5" stroke-linecap="round"/>' +
        '<text x="200" y="144" text-anchor="middle" fill="var(--text-primary)" font-family="Inter, sans-serif" font-size="11" font-weight="500">' + safeTitle + '</text>' +
        '<text x="200" y="166" text-anchor="middle" fill="var(--text-muted)" font-family="JetBrains Mono, monospace" font-size="8.5">Documentation &amp; essais publiés prochainement</text>' +
      '</svg>'
    );
  }

  var PERSONAL_PROJECTS = [
    {
      id: 'portfolio-technique-web',
      title: 'Portfolio Technique Multi-Pages & GitHub Pages',
      subtitle: 'Conception, refonte graphique et déploiement continu de mon portfolio d’étudiant en BUT GEII',
      category: 'Logiciel & Outils',
      filterCategories: ['Logiciel & Outils'],
      date: '2026',
      context: 'Projet personnel',
      team: 'Solo',
      status: 'Terminé',
      isPlaceholder: false,
      image: '',
      competences: [
        'Concevoir',
        'Vérifier',
        'Intégrer / Implanter'
      ],
      summary:
        'Développement et structuration d’un portfolio web multi-pages rapide et accessible pour présenter mes réalisations de BUT GEII à l’IUT de Bordeaux, mes projets de robotique et mon parcours.',
      problem:
        'Concevoir un support technique clair, rapide à charger et simple à maintenir sur le long terme afin de documenter mes SAÉ (cartes électroniques, CAO 3D, robotique autonome) et de faciliter les échanges pour ma recherche d’alternance.',
      solution:
        'Architecture front-end modulaire en HTML5 sémantique, CSS3 piloté par variables de thème et JavaScript vanilla sans dépendance externe, intégrant un filtrage dynamique par compétences GEII, une modale illustrée accessible au clavier et un hébergement sur GitHub Pages.',
      highlights: [
        'Architecture multi-pages découplée séparant les données de projets (JS autonomes) et les composants d’interface partagés',
        'Système de filtrage croisé par année universitaire, compétences du référentiel BUT GEII et domaines techniques',
        'Chargement instantané sans étape de compilation lourde, navigation clavier WAI-ARIA et mise en ligne via GitHub Pages'
      ],
      stack: [
        'HTML5',
        'CSS3 Custom Properties',
        'JavaScript Vanilla',
        'SVG Vectoriel',
        'Git & GitHub Pages'
      ],
      svg: createPortfolioSchematicSvg(),
      links: [
        {
          label: 'Dépôt GitHub',
          href: 'https://github.com/aymericnoirot33-sys/aymeric-noirot-portfolio',
          primary: true
        },
        {
          label: 'Site en ligne',
          href: 'https://aymericnoirot33-sys.github.io/aymeric-noirot-portfolio/'
        }
      ]
    },
    {
      id: 'prototype-embarque-iot',
      title: 'Station de Mesure & Télémétrie Embarquée',
      subtitle: 'Prototype personnel d’acquisition capteurs sur microcontrôleur — documentation en préparation',
      category: 'Embarqué & IoT',
      filterCategories: ['Embarqué & IoT'],
      date: '2026',
      context: 'Projet personnel',
      team: 'Solo',
      status: 'En préparation',
      isPlaceholder: true,
      image: '',
      competences: [
        'Concevoir',
        'Vérifier',
        'Intégrer / Implanter'
      ],
      summary:
        'Prototype personnel en préparation autour d’un microcontrôleur (ESP32 / Arduino), de capteurs environnementaux et d’une interface de relevé de mesures en temps réel.',
      problem:
        'Approfondir en autonomie la programmation embarquée C/C++, les bus de communication numériques (I2C, SPI, UART) et l’optimisation de consommation sur batterie en complément des travaux pratiques.',
      solution:
        'Prototypage sur carte d’essai puis intégration dédiée : acquisition périodique de grandeurs physiques, traitement logiciel embarqué et transmission série ou Wi-Fi documentée.',
      highlights: [
        'Sélection des capteurs et définition du cahier des charges matériel en cours',
        'Mise en œuvre des bus série (I2C / UART) et structuration du firmware embarqué',
        'Schémas de câblage, code source et relevés expérimentaux à paraître'
      ],
      stack: [
        'C / C++',
        'ESP32 / Arduino',
        'I2C / UART',
        'Capteurs',
        'Instrumentation'
      ],
      svg: createPlaceholderSvg('01', 'Embarqué & IoT', 'Prototype Embarqué & IoT'),
      links: []
    },
    {
      id: 'prototype-electronique-pcb',
      title: 'Module d’Alimentation & Carte PCB Sur Mesure',
      subtitle: 'Conception schématique, routage PCB et caractérisation sur banc — prototype en préparation',
      category: 'Électronique & PCB',
      filterCategories: ['Électronique & PCB'],
      date: '2026',
      context: 'Projet personnel',
      team: 'Solo',
      status: 'En préparation',
      isPlaceholder: true,
      image: '',
      competences: [
        'Concevoir',
        'Vérifier',
        'Maintenir'
      ],
      summary:
        'Projet personnel en préparation dédié à la conception complète d’une carte électronique utilitaire sous CAO, dans le prolongement des circuits réalisés à l’IUT de Bordeaux.',
      problem:
        'Disposer d’un module d’alimentation et de protection compact, fiable et réutilisable pour alimenter mes maquettes électroniques personnelles en toute sécurité.',
      solution:
        'Saisie du schéma électrique, dimensionnement des étages de régulation, routage du circuit imprimé avec points de test dédiés et validation des performances électriques après brasage.',
      highlights: [
        'Dimensionnement des régulateurs de tension et des protections d’entrée/sortie',
        'Routage PCB soigné avec plan de masse et sérigraphie de diagnostic',
        'Fichiers de conception, photos d’assemblage et mesures sur banc à venir'
      ],
      stack: [
        'CAO PCB / KiCad',
        'Électronique analogique',
        'Régulation DC',
        'Brasage',
        'Multimètre & Oscilloscope'
      ],
      svg: createPlaceholderSvg('02', 'Électronique & PCB', 'Prototype Électronique & PCB'),
      links: []
    },
    {
      id: 'prototype-robotique-perso',
      title: 'Plateforme Mobile & Asservissement Moteur',
      subtitle: 'Expérimentations personnelles en mécatronique, CAO 3D et commande moteur — en préparation',
      category: 'Robotique',
      filterCategories: ['Robotique'],
      date: '2026',
      context: 'Projet personnel',
      team: 'Solo',
      status: 'En préparation',
      isPlaceholder: true,
      image: '',
      competences: [
        'Concevoir',
        'Vérifier',
        'Intégrer / Implanter'
      ],
      summary:
        'Prototype mécatronique personnel en préparation combinant modélisation mécanique 3D sous OnShape, pilotage d’actionneurs et algorithmes de déplacement autonome.',
      problem:
        'Prolonger l’expérience acquise lors du DU Robotique (Robot Holonome Autonome) sur un châssis personnel compact permettant d’expérimenter de nouvelles lois de commande et capteurs.',
      solution:
        'Conception d’un châssis modulaire en CAO 3D, étage électronique de puissance pour moteurs CC/servomoteurs et logique de contrôle embarquée en Python ou C++.',
      highlights: [
        'Conception mécanique 3D paramétrique sous OnShape et intégration mécatronique',
        'Pilotage PWM, lecture capteurs de distance et tests d’asservissement',
        'Rendus 3D, code embarqué et essais de roulage publiés dès finalisation'
      ],
      stack: [
        'OnShape 3D',
        'Python / C++',
        'Commande moteur PWM',
        'Capteurs de distance',
        'Li-ion'
      ],
      svg: createPlaceholderSvg('03', 'Robotique', 'Prototype Robotique'),
      links: []
    }
  ];

  global.PERSONAL_PROJECTS = PERSONAL_PROJECTS;
})(window);
