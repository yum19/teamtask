# TeamTask - Application de Gestion des Tâches

Une application web full-stack de gestion des tâches développée avec la stack MERN (MongoDB, Express.js, React, Node.js) et Redux Toolkit pour la gestion d'état.

## 📋 Description

TeamTask est une application interne de gestion des tâches conçue pour structurer et fluidifier la collaboration entre les membres d'une équipe. L'application propose un système de rôles avec des permissions différenciées entre utilisateurs standards et managers.

### ✨ Fonctionnalités principales

- **Authentification sécurisée** avec JWT
- **Gestion des rôles** (User/Manager)
- **CRUD complet** pour les tâches
- **Assignation de tâches** par les managers
- **Filtrage par statut** des tâches
- **Interface responsive** avec React

## 🛠️ Technologies utilisées

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM pour MongoDB
- **JWT** - Authentification par tokens
- **bcryptjs** - Hachage des mots de passe

### Frontend
- **React** - Bibliothèque UI
- **Redux Toolkit** - Gestion d'état
- **React Router** - Navigation
- **Axios** - Client HTTP

## 🚀 Installation et Configuration

### Prérequis
- Node.js (v14 ou supérieur)
- MongoDB (local ou cloud)
- npm ou yarn

### 1. Cloner le projet
```bash
git clone https://github.com/votre-username/teamtask.git
cd teamtask
```

### 2. Configuration du Backend
```bash
cd backend
npm install
```

Créer un fichier `.env` dans le dossier backend :
```env
# Base de données
MONGODB_URI=mongodb://localhost:27017/teamtask
# ou pour MongoDB Atlas :
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/teamtask

# JWT
JWT_SECRET=votre_secret_jwt_très_sécurisé
JWT_EXPIRE=7d

# Serveur
PORT=5000
NODE_ENV=development
```

### 3. Configuration du Frontend
```bash
cd ../frontend
npm install
```

Créer un fichier `.env` dans le dossier frontend :
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🎯 Lancement de l'application

### Démarrage du Backend
```bash
cd backend
npm run dev
```
Le serveur backend sera accessible sur `http://localhost:5000`

### Démarrage du Frontend
```bash
cd frontend
npm start
```
L'application React sera accessible sur `http://localhost:3000`

### Démarrage simultané (optionnel)
Si vous avez configuré concurrently :
```bash
npm run dev
```

## 📁 Structure du projet

```
teamtask/
├── backend/
│   ├── build/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Task.js
│   │   └── User.js
│   ├── node_modules/
│   ├── public/
│   │   └── index.html
│   ├── routes/
│   │   ├── auth.js
│   │   └── task.js
│   ├── .env
│   ├── package-lock.json
│   ├── package.json
│   ├── server.js
│   ├── tailwind.config.js
│   └── test.html
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminPanel.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   └── TaskList.js
│   │   ├── store/
│   │   │   ├── authSlice.js
│   │   │   ├── index.js
│   │   │   └── taskSlice.js
│   │   └── App.js
│   ├── .env
│   ├── index.css
│   ├── index.js
│   ├── package-lock.json
│   └── package.json
└── README.md
```

## 🔐 Système d'authentification

### Rôles et permissions

#### Utilisateur Standard (User)
- ✅ Consulter ses propres tâches
- ✅ Modifier le statut de ses tâches
- ❌ Créer des tâches pour d'autres utilisateurs
- ❌ Accéder aux tâches d'autres utilisateurs

#### Manager
- ✅ Accès global à toutes les tâches
- ✅ Créer et assigner des tâches à n'importe quel utilisateur
- ✅ Modifier toutes les tâches
- ✅ Voir la liste des utilisateurs

## 📊 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/profile` - Profil utilisateur

### Tâches
- `GET /api/task` - Récupérer les tâches de l'utilisateur
- `POST /api/task` - Créer une nouvelle tâche
- `PUT /api/task/:id` - Modifier une tâche
- `DELETE /api/task/:id` - Supprimer une tâche

## 📱 Interface utilisateur

### Pages principales
1. **Login.js** - Page de connexion et authentification des utilisateurs
2. **Register.js** - Page d'inscription pour la création de nouveaux comptes
3. **Dashboard.js** - Tableau de bord avec vue d'ensemble des tâches
4. **TaskList.js** - Liste et gestion des tâches avec filtrage
5. **AdminPanel.js** - Panel d'administration pour les managers

### Fonctionnalités frontend
- Filtrage des tâches par statut (À faire, En cours, Terminée)
- Interface responsive
- Notifications des actions utilisateur
- Gestion des erreurs
- Déconnexion automatique en cas d'expiration du token

## 🧪 Tests et Débogage

### Variables d'environnement de développement
```bash
# Backend
DEBUG=true
LOG_LEVEL=debug

# Frontend
REACT_APP_DEBUG=true
```

### Commandes utiles
```bash
# Vérifier les logs backend
npm run logs

# Lancer les tests (si configurés)
npm test

# Build de production
npm run build
```

## 🚀 Déploiement

### Backend (Render/Railway/Heroku)
1. Configurer les variables d'environnement
2. Connecter à MongoDB Atlas
3. Déployer le dossier backend

### Frontend (Vercel/Netlify)
1. Configurer `REACT_APP_API_URL` avec l'URL du backend déployé
2. Build et déployer le dossier frontend

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Scripts disponibles

### Backend
```bash
npm start          # Démarrage production
npm run dev        # Démarrage développement avec nodemon
npm run seed       # Peupler la base de données (optionnel)
```

### Frontend
```bash
npm start          # Démarrage développement
npm run build      # Build de production
npm test           # Lancer les tests
npm run eject      # Éjecter la configuration (attention!)
```

## 🐛 Dépannage

### Problèmes courants
1. **Erreur de connexion à MongoDB** : Vérifiez votre chaîne de connexion dans `.env`
2. **Token JWT expiré** : Reconnectez-vous à l'application  
3. **CORS errors** : Vérifiez la configuration CORS du backend
4. **Port déjà utilisé** : Changez le port dans les variables d'environnement

### Logs utiles
```bash
# Backend logs
tail -f backend/logs/app.log

# MongoDB logs (si local)
tail -f /var/log/mongodb/mongod.log
```

## 📧 Contact

Pour toute question ou suggestion :
- Email : yomna.bouallegue@esprit.tn
- GitHub : [yum19](https://github.com/yum19)

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

**TeamTask** - Développé avec ❤️ pour optimiser la collaboration en équipe