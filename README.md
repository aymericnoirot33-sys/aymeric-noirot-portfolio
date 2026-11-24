# Portfolio — Aymeric Noirot (BUT GEII · IUT de Bordeaux)

Portfolio technique statique en français d'**Aymeric Noirot**, étudiant en 1re année de **BUT GEII** (*Génie Électrique et Informatique Industrielle*) à l'**IUT de Bordeaux** (*Université de Bordeaux*).

- **Site en ligne** : [https://aymericnoirot33-sys.github.io/aymeric-noirot-portfolio/](https://aymericnoirot33-sys.github.io/aymeric-noirot-portfolio/)
- **GitHub** : [https://github.com/aymericnoirot33-sys](https://github.com/aymericnoirot33-sys)
- **Contact** : `aymeric.noirot33@gmail.com`

---

## Direction visuelle — Graphite-Slate & accents dédiés

Le site adopte une direction éditoriale sobre et technique sur une palette **Graphite-Slate adoucie** (`#161A22` en fond principal, surfaces ardoise étagées, bordures nettes, style strictement plat sans flous ni halos) avec une **couleur d'accent dédiée par page** :

- **Bleu** (`#5294FF`) sur la page d'accueil, présentation & parcours (`index.html`)
- **Vert** (`#28CA67`) sur l'atelier de projets personnels (`projets-personnels.html`)
- **Rouge** (`#F56565`) sur les réalisations universitaires (`projets-universite.html`)

---

## Architecture en 3 pages

1. **`index.html` — Accueil, À propos & Parcours** *(accent bleu `#5294FF`)*
   Présentation éditoriale, carte **À propos** avec logos officiels de l'Université de Bordeaux et du département GEII de l'IUT de Bordeaux, frise chronologique interactive (`Tout`, `Formation`, `Expériences`, `Repères clés`), piliers de compétences (Électronique & Puissance, Robotique & Embarqué, Automatisation & CAO 3D), passerelles vers les galeries et section contact avec copie rapide de l'adresse e-mail.
2. **`projets-universite.html` — Projets universitaires** *(accent rouge `#F56565`)*
   Catalogue interactif des réalisations menées à l'IUT de Bordeaux, filtrable par année (`S1–S2`, `S3–S4`, `S5–S6`) et selon les **4 compétences officielles du référentiel BUT GEII** (*Concevoir*, *Vérifier*, *Maintenir*, *Intégrer / Implanter*), avec galerie photo/SVG et fenêtre modale détaillée :
   - **Robot Holonome Autonome** *(DU Robotique — Raspberry Pi 3, LiDAR 360°, servomoteurs Dynamixel MX-12W, Python, CAO 3D OnShape & découpe laser)*
   - **Kart à Hélice Télécommandé — KAH** *(SAÉ S1 — motorisation propulsive, variateur et commande radio)*
   - **Thermomètre de Bain Bébé — TDB** *(SAÉ S1 — conception analogique, gravure PCB, étalonnage thermique et affichage par seuils)*
   - **Système Lumineux du Rafale — SLR** *(SAÉ S1 — génération analogique de feux aéronautiques autour du NE555, brasage et validation sur banc)*
3. **`projets-personnels.html` — Projets personnels** *(accent vert `#28CA67`)*
   Espace dédié aux réalisations et expérimentations menées en autonomie (développement web et outils logiciels, électronique & PCB, systèmes embarqués, robotique & CAO 3D), avec filtrage par domaine et fiches détaillées.

---

## Lancer le site en local

Aucune dépendance externe ni étape de compilation n'est requise : le site fonctionne aussi bien en ouverture directe (`file://`) que servi en HTTP ou déployé sur GitHub Pages.

### Option 1 — Serveur local Node.js (recommandé)
Depuis la racine du dépôt :

```bash
node serve.mjs
```

Le portfolio est alors accessible sur `http://127.0.0.1:4173`.
Pour choisir un autre port :

```bash
# Linux / macOS
PORT=4174 node serve.mjs

# Windows PowerShell
$env:PORT=4174; node serve.mjs
```

### Option 2 — Ouverture directe
Ouvrez directement **`index.html`** dans un navigateur moderne pour naviguer entre les 3 pages.

---

## Structure du dépôt

```text
aymeric-noirot-portfolio/
├── index.html                 # Accueil, À propos, parcours, compétences et contact
├── projets-personnels.html    # Galerie interactive des projets personnels
├── projets-universite.html    # Galerie interactive des SAÉ GEII et du DU Robotique
├── serve.mjs                  # Serveur HTTP local zéro-dépendance
├── images/                    # Photos des réalisations & logos institutionnels (UB, IUT GEII)
├── css/
│   ├── design-system.css      # Tokens Graphite-Slate, typographie, header, footer, cartes, modale
│   ├── home.css               # Styles de l'accueil, section À propos et frise chronologique
│   ├── personal.css           # Styles de la page projets personnels
│   └── university.css         # Styles de la page projets universitaires
└── js/
    ├── common.js              # Menu mobile, copie d'e-mail avec toast, modale accessible
    ├── home.js                # Filtres et courbe dynamique de la frise du parcours
    ├── data-personal.js       # Données et schémas SVG des projets personnels
    ├── personal.js            # Rendu et filtrage des projets personnels
    ├── data-university.js     # Données, photos et schémas des projets universitaires
    └── university.js          # Rendu et filtrage par année / compétence BUT GEII
```

---

## Ajouter un futur projet

Pour ajouter une nouvelle SAÉ dans `js/data-university.js` (`window.UNIVERSITY_PROJECTS`) ou un nouveau prototype dans `js/data-personal.js` (`window.PERSONAL_PROJECTS`), ajoutez un objet suivant ce format :

```js
{
  id: 'identifiant-projet',
  title: 'Titre du projet',
  subtitle: 'Résumé court en une ligne',
  category: 'Robotique',             // pour data-personal.js
  saeCode: 'SAÉ 2.01',               // uniquement pour data-university.js
  yearGroup: 'y1',                   // 'y1' (S1–S2), 'y2' (S3–S4) ou 'y3' (S5–S6)
  semester: 'Semestre 2',            // uniquement pour data-university.js
  competences: ['concevoir', 'verifier', 'integrer'], // uniquement pour data-university.js
  date: '2026',
  context: 'IUT de Bordeaux · BUT GEII',
  team: 'Binôme',
  status: 'Terminé',
  isPlaceholder: false,
  image: 'images/mon-projet.jpg',    // laisser '' pour utiliser le schéma `svg`
  summary: 'Présentation concise de l’objectif et du résultat obtenu.',
  problem: 'Besoin initial, cahier des charges et contraintes techniques.',
  solution: 'Architecture matérielle/logicielle retenue et validation sur banc.',
  highlights: [
    'Point technique ou mesure clé n°1',
    'Compétence mobilisée ou résultat n°2'
  ],
  stack: ['C / C++', 'Python', 'PCB', 'CAO 3D'],
  svg: '<svg viewBox="0 0 400 220" ...></svg>',
  links: [
    { label: 'Dépôt GitHub', href: 'https://github.com/aymericnoirot33-sys', primary: true }
  ]
}
```
