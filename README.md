# Du'as & Invocations Islamiques

Une application web élégante et moderne qui génère des du'as et invocations islamiques à la demande des utilisateurs en utilisant l'API OpenAI.

## Fonctionnalités

- Génération de du'as personnalisées basées sur l'intention ou la situation de l'utilisateur
- Design minimaliste et moderne avec un thème noir et doré
- Texte en arabe, translittération phonétique et traduction française
- Interface utilisateur intuitive et responsive

## Technologies utilisées

- **Next.js** - Framework React pour le développement d'applications web
- **TypeScript** - Super-ensemble JavaScript avec vérification de type
- **Tailwind CSS** - Framework CSS utilitaire
- **OpenAI API** - Pour la génération de contenu

## Installation

```bash
# Cloner le dépôt
git clone https://github.com/votrecompte/islamic-duas-app.git
cd islamic-duas-app

# Installer les dépendances
npm install

# Copier le fichier .env.example en .env.local et ajouter votre clé API OpenAI
cp .env.example .env.local

# Démarrer le serveur de développement
npm run dev
```

## Configuration

Vous devez configurer une clé API OpenAI dans le fichier `.env.local` :

```
OPENAI_API_KEY=votre_cle_api_openai_ici
```

## Structure du projet

```
islamic-duas-app/
├── public/               # Fichiers statiques
├── src/                  # Code source
│   ├── app/              # Pages de l'application
│   │   ├── api/          # Routes API
│   │   ├── about/        # Page À propos
│   │   ├── globals.css   # Styles globaux
│   │   ├── layout.tsx    # Layout principal
│   │   └── page.tsx      # Page d'accueil
│   └── components/       # Composants réutilisables
├── .env.local            # Variables d'environnement locales
├── package.json          # Dépendances et scripts
└── README.md             # Documentation
```

## Déploiement

L'application peut être facilement déployée sur Vercel :

```bash
npm install -g vercel
vercel
```

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou à soumettre une pull request.

## Licence

MIT
