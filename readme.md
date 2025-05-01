#  Documentation technique - Indexation et Recherche de vidéos Youtube

##  1. Présentation du projet

Ce projet est une application web permettant d’**indexer les vidéos d'une chaîne YouTube** à l'aide de l'API YouTube Data v3, de les stocker localement dans une base SQLite, et d’effectuer des **recherches par mots-clés** dans les vidéos indexées.

L’interface React offre une expérience fluide, avec historique des chaînes, pagination, switch thème clair/sombre, animation de survol, et un bouton pour réinitialiser la base.

---

##  2. Architecture du projet

- **Frontend** : React  
- **Backend** : Node.js avec Express  
- **Base de données** : SQLite  
- **API externe** : YouTube Data v3

### Arborescence simplifiée :

```
indexation/
├── client/
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   └── ...
├── server/
│   ├── server.js
│   ├── database.js
│   ├── .env
│   └── videos.db
```

---

##  3. Installation et lancement

### Prérequis :

- Node.js  
- npm

### Lancer le serveur :

```bash
cd server
npm install
node server.js
```

### Lancer le client React :

```bash
cd client
npm install
npm start
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000)  
Le serveur API écoute sur [http://localhost:5000](http://localhost:5000)

---

##  4. Technologies et librairies utilisées

| Côté     | Librairie | Version  |
|----------|-----------|----------|
| Client   | React     | 18.x     |
| Client   | Axios     | 1.x      |
| Serveur  | Express   | 4.18.x   |
| Serveur  | Axios     | 1.x      |
| Serveur  | dotenv    | 16.x     |
| Serveur  | sqlite3   | 5.1.x    |

---

##  5. API et endpoints

### a) API YouTube Data v3  
Utilisée pour :
- Récupérer les vidéos d’une chaîne (`search`)
- Convertir un `@handle` en `channelId`

### b) Endpoints backend

| Méthode | Route                                  | Description                                       |
|---------|----------------------------------------|--------------------------------------------------|
| `GET`   | `/api/index?channel=<id|@handle>`     | Indexe les 20 dernières vidéos d'une chaîne     |
| `GET`   | `/api/search?q=<mot-clé>`             | Recherche par mots-clés dans les vidéos         |
| `DELETE`| `/api/clear`                          | Vide la base de données et compresse le fichier |

---

##  6. Base de données

- **Nom** : `videos.db` (SQLite)
- **Table** : `videos`

### Schéma :

```sql
CREATE TABLE IF NOT EXISTS videos (
  id TEXT PRIMARY KEY,
  title TEXT,
  description TEXT,
  thumbnail TEXT,
  publishedAt TEXT
);
```

---

##  7. Interface utilisateur

Fonctionnalités :

-  Recherche par mots-clés  
-  Indexation par ID ou `@handle`  
-  Dates de publication affichées  
-  Switch thème sombre/clair  
-  Historique des chaînes indexées  
-  Bouton “Vider la base”
-  Bouton "Vider historique"
-  Loader animé  
-  Animation au survol  
-  Pagination responsive  

---

##  8. Historique et thème

- **Historique local** : via `localStorage`, menu déroulant pour recharger une chaîne indexée.  
- **Thème clair/sombre** : mémorisé en local, switch en haut à droite.  
- **Responsive** : adapté aux petits écrans et au bureau.

---

##  9. Tests et vérification

1. Indexer une chaîne : `GoogleDevelopers`
2. Rechercher un mot-clé comme `"AI"` ou `"Flutter"`
3. Vider la base → 0 vidéo affichée
4. Le fichier `videos.db` est compacté via `VACUUM`

---

##  10. Annexes

### `.env` (exemple)

```
YOUTUBE_API_KEY=VOTRE_CLÉ_ICI
```


### `.gitignore`

```txt
node_modules/
.env
videos.db
```

---

## Remarques

- Ce projet est conçu pour fonctionner **entièrement en local**
- Il respecte les **quotas gratuits** de l’API YouTube
- La base de données est réinitialisable à tout moment
