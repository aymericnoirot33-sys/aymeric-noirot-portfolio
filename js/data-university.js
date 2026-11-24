/**
 * ============================================================================
 * PROJETS UNIVERSITAIRES (BUT GEII — IUT DE BORDEAUX) — AYMERIC NOIROT
 * ============================================================================
 * Fichier autonome (sans ES module) compatible file:// et serveur local.
 *
 * COMMENT AJOUTER OU MODIFIER UN PROJET :
 * 1. Modifiez un bloc existant ci-dessous ou dupliquez-en un avec un nouvel `id`.
 * 2. Renseignez `status: 'SAÉ évaluée'` ou `'Projet validé'` et `isPlaceholder: false`
 *    (ou `isPlaceholder: true` pour un emplacement futur).
 * 3. Pour afficher une photo ou un schéma réel :
 *    renseignez `image: 'images/mon-projet.jpg'` (sinon laissez `image: ''`).
 * 4. Optionnel : ajoutez `sections: [{ title, image, imageAlt, imageFit, paragraphs }]`
 *    et `credits: '...'` pour enrichir la modale détaillée.
 *
 * VALEURS RECONNUES POUR LES FILTRES :
 * - `yearGroup`   : 'y1' (1re année S1–S2), 'y2' (2e année S3–S4), 'y3' (3e année S5–S6)
 * - `competences` : tableau parmi :
 *     'Concevoir', 'Vérifier', 'Maintenir', 'Intégrer / Implanter'
 *     (les variantes 'Intégrer' et 'Implanter' sont aussi reconnues)
 * - `links`       : [{ label: 'Rapport PDF', href: 'docs/sae.pdf' }] ou []
 * ============================================================================
 */
(function () {
  'use strict';

  function buildPlaceholderSvg(slotNumber, saeLabel, semesterLabel) {
    return [
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 220" width="100%" height="100%" role="img" aria-label="Emplacement réservé ' + slotNumber + ' — ' + saeLabel + '">',
      '  <rect width="400" height="220" fill="var(--surface-visual)"/>',
      '  <rect x="20" y="20" width="360" height="180" rx="8" fill="var(--surface-1)" stroke="var(--border)" stroke-width="1" stroke-dasharray="5 5"/>',
      '  <path d="M 20 38 L 20 20 L 38 20" fill="none" stroke="var(--border)" stroke-width="1.4"/>',
      '  <path d="M 362 20 L 380 20 L 380 38" fill="none" stroke="var(--border)" stroke-width="1.4"/>',
      '  <path d="M 20 182 L 20 200 L 38 200" fill="none" stroke="var(--border)" stroke-width="1.4"/>',
      '  <path d="M 362 200 L 380 200 L 380 182" fill="none" stroke="var(--border)" stroke-width="1.4"/>',
      '  <line x1="200" y1="20" x2="200" y2="30" stroke="var(--border)" stroke-width="1"/>',
      '  <line x1="200" y1="190" x2="200" y2="200" stroke="var(--border)" stroke-width="1"/>',
      '  <line x1="20" y1="110" x2="30" y2="110" stroke="var(--border)" stroke-width="1"/>',
      '  <line x1="370" y1="110" x2="380" y2="110" stroke="var(--border)" stroke-width="1"/>',
      '  <rect x="36" y="34" width="114" height="22" rx="5" fill="var(--accent-tint)" stroke="var(--accent-border)" stroke-width="1"/>',
      '  <circle cx="48" cy="45" r="2.5" fill="var(--accent)"/>',
      '  <text x="57" y="48.5" fill="var(--accent-bright)" font-family="JetBrains Mono, monospace" font-size="8.5">EMPLACEMENT ' + slotNumber + '</text>',
      '  <text x="364" y="48.5" text-anchor="end" fill="var(--text-muted)" font-family="JetBrains Mono, monospace" font-size="8.5">' + saeLabel + ' · ' + semesterLabel + '</text>',
      '  <rect x="172" y="78" width="56" height="44" rx="6" fill="var(--surface-1)" stroke="var(--border)" stroke-width="1.2"/>',
      '  <line x1="184" y1="100" x2="216" y2="100" stroke="var(--border)" stroke-width="1"/>',
      '  <line x1="200" y1="88" x2="200" y2="112" stroke="var(--border)" stroke-width="1"/>',
      '  <rect x="193" y="93" width="14" height="14" rx="3" fill="var(--accent-tint)" stroke="var(--accent-border)" stroke-width="1.2"/>',
      '  <circle cx="200" cy="100" r="2.2" fill="var(--accent)"/>',
      '  <text x="200" y="146" text-anchor="middle" fill="var(--text-primary)" font-family="JetBrains Mono, monospace" font-size="9">' + saeLabel + ' — À COMPLÉTER</text>',
      '  <text x="200" y="168" text-anchor="middle" fill="var(--text-muted)" font-family="JetBrains Mono, monospace" font-size="8">Visuel ou photo à ajouter dans js/data-university.js</text>',
      '</svg>'
    ].join('\n');
  }

  window.UNIVERSITY_COMPETENCES = [
    {
      id: 'concevoir',
      code: '01',
      label: 'Concevoir',
      matches: ['Concevoir'],
      description: 'Dimensionner les architectures électroniques, logicielles et d’automatisme.'
    },
    {
      id: 'verifier',
      code: '02',
      label: 'Vérifier',
      matches: ['Vérifier'],
      description: 'Simuler, instrumenter et valider les performances mesurées sur banc.'
    },
    {
      id: 'maintenir',
      code: '03',
      label: 'Maintenir',
      matches: ['Maintenir'],
      description: 'Diagnostiquer les défauts, fiabiliser et anticiper les dérives système.'
    },
    {
      id: 'integrer',
      code: '04',
      label: 'Intégrer / Implanter',
      matches: ['Intégrer / Implanter', 'Intégrer', 'Implanter'],
      description: 'Assembler, programmer et déployer un système complet en conditions réelles.'
    }
  ];

  window.UNIVERSITY_PROJECTS = [
    {
      id: 'robot-holonome',
      saeCode: 'DU Robotique',
      semester: '1re année · 22h + Hackathon',
      yearGroup: 'y1',
      title: 'Robot Holonome Autonome',
      subtitle: 'Conception et développement d’un robot autonome de sortie de labyrinthe par LiDAR 360°',
      category: 'Robotique & Embarqué',
      date: '2026',
      context: 'DU Robotique · IUT de Bordeaux',
      team: 'Équipe de 4 (GEII & GMP)',
      status: 'Projet validé',
      isPlaceholder: false,
      image: 'images/RobotHolonome.jpg',
      competences: ['Concevoir', 'Vérifier', 'Intégrer / Implanter'],
      summary:
        'Conception d’un robot omnidirectionnel autonome basé sur Raspberry Pi 3, scanner LiDAR 360° et servomoteurs Dynamixel, capable de sortir d’un labyrinthe inconnu.',
      problem:
        'Projet réalisé dans le cadre du Diplôme Universitaire de Robotique en équipe de 4 étudiants, avec pour objectif de concevoir en 22 heures un robot capable de s’orienter et de sortir de façon autonome d’un labyrinthe inconnu sans collision.',
      solution:
        'Architecture complète associant un châssis découpé au laser à roues holonomes, une Raspberry Pi 3 traitant en temps réel les mesures d’un LiDAR 360° et un algorithme de navigation Python pilotant trois servomoteurs Dynamixel MX-12W.',
      sections: [
        {
          title: 'Conception mécanique',
          image: 'images/RobotHolonome/3D.jpg',
          imageAlt: 'Modélisation 3D du robot holonome sur OnShape',
          imageFit: 'contain',
          paragraphs: [
            'Ce projet repose sur la conception et l’assemblage 3D complet du robot. Les roues holonomes lui permettent de se déplacer dans n’importe quelle direction sur un plan 2D sans avoir besoin de pivoter.',
            'Cette manœuvrabilité omnidirectionnelle est idéale pour naviguer avec précision dans les couloirs restreints du labyrinthe. Le châssis a été modélisé en 3D sur OnShape (similaire à SolidWorks) puis fabriqué en découpe laser sur des plaques de 3 mm.'
          ]
        },
        {
          title: 'Architecture électronique',
          image: 'images/RobotHolonome.jpg',
          imageAlt: 'Prototype assemblé avec LiDAR 360° et Raspberry Pi 3',
          paragraphs: [
            'Le traitement principal est assuré par une Raspberry Pi 3 agissant comme cerveau du système pour exploiter le flux de télémétrie en temps réel.',
            'La perception de l’environnement repose sur un scanner LiDAR à 360° mesurant les distances avec précision sur 360 points. La propulsion est confiée à des servomoteurs Dynamixel MX-12W alimentés par 3 accumulateurs Li-ion de 3000 mAh couplés en parallèle.'
          ]
        },
        {
          title: 'Logique logicielle',
          image: 'images/RobotHolonome/Python.png',
          imageAlt: 'Développement de la navigation autonome en Python',
          imageFit: 'contain',
          paragraphs: [
            'Le défi majeur du projet a consisté à développer de A à Z l’algorithme de navigation autonome tout en coordonnant la cinématique de déplacement holonome.',
            'Développé en Python pour accélérer le prototypage, le programme fusionne l’acquisition des distances LiDAR, la détection d’obstacles et la génération des consignes moteurs.'
          ]
        }
      ],
      highlights: [
        'Déplacement omnidirectionnel 2D sans rotation grâce aux roues holonomes et servomoteurs Dynamixel MX-12W',
        'Acquisition laser sur 360 points par tour couplée au traitement embarqué en Python sur Raspberry Pi 3',
        'Assemblage complet et validation sur labyrinthe réel lors d’un hackathon final d’une demi-journée (après 22h de projet)'
      ],
      stack: [
        'Raspberry Pi 3',
        'Python',
        'LiDAR 360°',
        'Dynamixel MX-12W',
        'OnShape 3D',
        'Découpe laser',
        'Li-ion 3×3000mAh'
      ],
      credits:
        'Projet réalisé sur 22h clôturé par un hackathon d’une demi-journée pour assembler et tester le robot sur le labyrinthe. Merci à mes coéquipiers Nicolas, Rémi (GEII) et Thao (GMP) pour leur implication et leur travail.',
      svg: buildPlaceholderSvg('01', 'DU Robotique', '1re année'),
      links: []
    },
    {
      id: 'kart-a-helice',
      saeCode: 'SAÉ S1–S2',
      semester: 'Semestre 1–2',
      yearGroup: 'y1',
      title: 'Kart à Hélice Télécommandé',
      subtitle: 'Conception, routage électronique, fabrication sur cuivre et vérification d’un kart à propulsion aérienne',
      category: 'Électronique & Puissance',
      date: '2026',
      context: 'BUT GEII 1re année · IUT de Bordeaux',
      team: 'Équipe GEII',
      status: 'SAÉ évaluée',
      isPlaceholder: false,
      image: 'images/KAH.jpg',
      competences: ['Concevoir', 'Vérifier', 'Intégrer / Implanter'],
      summary:
        'Conception, routage électronique complet, fabrication sur plaque de cuivre et vérification d’un véhicule télécommandé à propulsion aérienne.',
      problem:
        'Concevoir et réaliser un kart miniature télécommandé propulsé par une hélice carénée, en assurant la commande de direction et la gestion de puissance moteur tout en respectant les contraintes mécaniques du châssis.',
      solution:
        'Schématique et routage complet de la carte électronique, gravure et soudure du circuit imprimé sur plaque de cuivre, intégration sur le châssis découpé et campagne d’essais fonctionnels et électriques.',
      highlights: [
        'Conception du schéma électrique et routage complet du circuit imprimé de commande et de puissance',
        'Fabrication du prototype sur plaque de cuivre, brasage des composants et intégration mécatronique',
        'Protocole de vérification et de tests fonctionnels validant la propulsion aérienne et la direction télécommandée'
      ],
      stack: [
        'Routage PCB',
        'Gravure cuivre',
        'Électronique de puissance',
        'CAO 3D',
        'Commande moteur',
        'Banc de test'
      ],
      svg: buildPlaceholderSvg('02', 'SAÉ S1–S2', 'S1–S2'),
      links: []
    },
    {
      id: 'thermometre-bain-tdb',
      saeCode: 'SAÉ S1 · TDB',
      semester: 'Semestre 1',
      yearGroup: 'y1',
      title: 'Thermomètre de Bain Électronique (TDB)',
      subtitle: 'Conception, réalisation PCB et caractérisation d’un indicateur thermique lumineux',
      category: 'Électronique Analogique',
      date: '2025 — 2026',
      context: 'BUT GEII 1re année · IUT de Bordeaux',
      team: 'Binôme / TP SAÉ',
      status: 'SAÉ évaluée',
      isPlaceholder: false,
      image: 'images/TDB.jpg',
      competences: ['Concevoir', 'Vérifier'],
      summary:
        'Conception et réalisation d’un thermomètre électronique de bain pour bébé signalant par seuils lumineux la plage de température sécurisée.',
      problem:
        'Concevoir une carte électronique autonome et fiable capable de mesurer la température de l’eau d’un bain et d’alerter visuellement l’utilisateur (trop froid, optimal, trop chaud) selon des seuils précis.',
      solution:
        'Conditionnement d’un capteur thermique analogique, étages comparateurs à circuits intégrés sur PCB cuivre simple face, puis calibration et validation expérimentale sur banc avec alimentation stabilisée et multimètre de précision.',
      highlights: [
        'Dimensionnement de la chaîne d’acquisition thermique et des seuils de basculement analogiques',
        'Assemblage et brasage traversant de la carte TDB sur circuit imprimé gravé',
        'Campagne de mesures, réglage des seuils et validation de consommation sur banc de laboratoire'
      ],
      stack: [
        'Capteur thermique',
        'AOP / Comparateurs',
        'PCB simple face',
        'Alimentation DC labo',
        'Multimètre'
      ],
      svg: buildPlaceholderSvg('03', 'SAÉ S1 · TDB', 'S1'),
      links: []
    },
    {
      id: 'son-lumiere-rafale-slr',
      saeCode: 'SAÉ S1 · SLR',
      semester: 'Semestre 1',
      yearGroup: 'y1',
      title: 'Carte Son & Lumière pour Rafale (SLR)',
      subtitle: 'Conception et fabrication de la carte électronique de feux de navigation d’une maquette du Rafale',
      category: 'Électronique & Temporisation',
      date: '2025',
      context: 'BUT GEII 1re année · IUT de Bordeaux',
      team: 'Groupe A1 · Équipe 08',
      status: 'SAÉ évaluée',
      isPlaceholder: false,
      image: 'images/SLR.jpg',
      competences: ['Concevoir', 'Vérifier', 'Maintenir'],
      summary:
        'Conception, gravure cuivre et validation de la carte électronique gérant les séquences lumineuses d’une maquette du chasseur Rafale français.',
      problem:
        'Réaliser une carte fille fiable générant les signaux de clignotement et d’alimentation des feux de position (gauche, centre, droite) tout en s’interfaçant mécaniquement et électriquement sur la carte support.',
      solution:
        'Architecture de temporisation autour d’un circuit intégré NE555 et composants passifs discrets, routage et gravure de la carte cuivre personnalisée, brasage et tests fonctionnels des voies LEDG, LEDC et LEDD.',
      highlights: [
        'Mise en œuvre d’un oscillateur / temporisateur NE555 pour cadencer les séquences lumineuses réglementaires',
        'Réalisation complète du circuit imprimé cuivre simple face et interfaçage sur carte mère d’essais',
        'Diagnostic électrique, vérification des fréquences de clignotement et validation des 3 voies LED'
      ],
      stack: [
        'NE555',
        'Électronique analogique',
        'Routage & gravure PCB',
        'Brasage traversant',
        'Tests sur banc'
      ],
      svg: buildPlaceholderSvg('04', 'SAÉ S1 · SLR', 'S1'),
      links: []
    }
  ];
})();
