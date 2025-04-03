# Indexation et recherche de vidéos Youtube

## Description
Application permettant d'indexer les vidéos d'une chaîne Youtube spécifique et d'effectuer des recherches par mots clés, via une interface React connectée à un backend Node.js qui interroge l'API YouTube Data v3.

## Technologies utilisées
- [Node.js](https://nodejs.org/)
- [React](https://react.dev/)
- [SQLite](https://www.sqlite.org/) *(prévu)*
- [API YouTube Data v3](https://developers.google.com/youtube/v3/docs?hl=fr) *(quota de 10 000 unités/jour)*
- [Google Cloud Console](https://console.cloud.google.com/) pour créer le projet et générer la clé API

## Fonctionnalités principales
- Récupération des vidéos d'une chaîne Youtube via l'API
- Stockage des métadonnées dans une base de données SQLite
- Recherche des vidéos par mots clés
- Interface utilisateur pour afficher dynamiquement les résultats

## Choix techniques
Le projet est structuré avec :
- Un dossier `client/` contenant le frontend React (interface utilisateur)
- Un dossier `server/` contenant le backend Node.js (communication avec l'API YouTube)

Cette séparation facilite le développement et permet une meilleure organisation du code.

## Fonctionnement global
1. L'utilisateur saisit un mot clé dans l'interface.
2. Le frontend envoie ce mot clé au backend.
3. Le backend interroge l'API Youtube en utilisant une clé API personnelle générée via Google Cloud.
4. L'API retourne les vidéos associées.
5. Les résultats sont affichés dans l’interface React.

## Installation
1. Installer Node.js
2. Créer un projet sur [Google Cloud Console](https://console.cloud.google.com/)
3. Activer l'API Youtube Data v3 et générer une clé API
4. Ajouter la clé dans un fichier `.env` côté backend (`YOUTUBE_API_KEY=...`)
5. Lancer le serveur :
   ```bash
   cd server
   node server.js
   ```
6. Lancer le frontend :
   ```bash
   cd client
   npm start
   ```

## Déploiement
- Frontend : [Vercel](https://vercel.com/) (prévu en dernière étape)

## Documentation API YouTube
- [Documentation officielle YouTube Data API v3](https://developers.google.com/youtube/v3/docs?hl=fr)
