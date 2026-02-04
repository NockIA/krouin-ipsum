# Krouin Ipsum

**Generateur de Lorem Ipsum en langue bretonne**

Un outil gratuit pour generer du faux texte en breton authentique, destine aux developpeurs et designers.

[Demo en ligne](https://krouin-ipsum.bzh)

---

## Fonctionnalites

- Generation de texte breton authentique (corpus de 10 000 phrases)
- Parametres personnalisables (nombre de paragraphes et phrases)
- Copie en un clic vers le presse-papier
- Statistiques (paragraphes, phrases, mots)
- Theme clair/sombre
- Interface bilingue francais/breton
- API REST gratuite

## Stack technique

| Technologie | Version |
|-------------|---------|
| Next.js | 16.1.6 |
| React | 19.2.3 |
| TypeScript | 5 |

## Installation

```bash
# Cloner le repository
git clone https://github.com/votre-username/krouin-ipsum.git
cd krouin-ipsum

# Installer les dependances
npm install

# Lancer le serveur de developpement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de developpement |
| `npm run build` | Build de production |
| `npm run start` | Serveur de production |
| `npm run lint` | Verification ESLint |

## API

### Endpoint

```
POST /api/generate
GET  /api/generate
```

### Parametres

| Parametre | Type | Defaut | Min | Max |
|-----------|------|--------|-----|-----|
| `paragraphs` | number | 3 | 1 | 20 |
| `sentencesPerParagraph` | number | 5 | 1 | 10 |

### Exemple de requete

```bash
# POST
curl -X POST https://krouin-ipsum.bzh/api/generate \
  -H "Content-Type: application/json" \
  -d '{"paragraphs": 2, "sentencesPerParagraph": 3}'

# GET
curl "https://krouin-ipsum.bzh/api/generate?paragraphs=2&sentencesPerParagraph=3"
```

### Exemple de reponse

```json
{
  "success": true,
  "data": {
    "text": "Ar brezhoneg zo ur yezh keltiek...",
    "stats": {
      "paragraphs": 2,
      "sentences": 6,
      "words": 87
    }
  }
}
```

## Structure du projet

```
krouin-ipsum/
├── app/
│   ├── page.tsx              # Page principale
│   ├── layout.tsx            # Layout + metadonnees SEO
│   ├── globals.css           # Styles + themes
│   ├── sitemap.ts            # Sitemap dynamique
│   ├── robots.ts             # Configuration robots.txt
│   └── api/generate/route.ts # API de generation
├── components/
│   ├── GeneratorForm.tsx     # Formulaire
│   ├── TextOutput.tsx        # Affichage texte
│   ├── ThemeToggle.tsx       # Theme switcher
│   └── HermineLogo.tsx       # Logo SVG
├── lib/
│   └── generator.ts          # Logique de generation
├── data/
│   └── sentences.json        # Corpus breton (10k phrases)
└── public/
    └── hermine.webp          # Favicon
```

## Corpus

Le corpus de 10 000 phrases provient de [Leipzig Corpora Collection](https://wortschatz.uni-leipzig.de/en/download/Breton) - Wikipedia Brezhoneg 2021.

Les phrases sont selectionnees aleatoirement sans repetition pour garantir la variete du texte genere.

## Deploiement

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/votre-username/krouin-ipsum)

### Variables d'environnement

```env
NEXT_PUBLIC_SITE_URL=https://votre-domaine.com
```

## Contribuer

Les contributions sont les bienvenues. Pour les changements majeurs, ouvrez d'abord une issue pour discuter des modifications souhaitees.

## Licence

[MIT](LICENSE)

---

**Krouin Ipsum** - *Testenn-loss e brezhoneg*

*« Brezhoneg bev, brezhoneg frank »*
