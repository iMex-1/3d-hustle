# OakMesh - Marketplace 3D

Une marketplace moderne d'objets 3D construite avec React et Vite. Parcourez, recherchez et téléchargez des modèles 3D premium.

## Fonctionnalités

- **Page d'Accueil** - Carrousel héro avec diapositives interactives et objets 3D en vedette
- **Galerie** - Parcourez tous les objets avec recherche et filtrage par catégorie
- **Détails d'Objet** - Visualisez les spécifications et téléchargez dans plusieurs formats
- **Authentification** - Système de connexion administrateur
- **Tableau de Bord Admin** - Gérez les objets 3D (ajouter, modifier, supprimer)
- **Design Responsive** - Fonctionne sur tous les appareils (mobile, tablette, desktop)
- **Visionneuse 3D Interactive** - Prévisualisez les modèles avec Google Model Viewer
- **Système de Notifications** - Notifications toast élégantes pour les actions utilisateur

## Stack Technique

- React 19
- Vite 7
- CSS personnalisé (sans frameworks)
- Google Model Viewer pour la visualisation 3D
- React Icons pour les icônes
- LocalStorage pour la persistance des données
- Données de démonstration pour les tests

## Démarrage Rapide

### Installation

```bash
npm install
```

### Développement

```bash
npm run dev
```

Ouvrez [http://localhost:5173](http://localhost:5173) dans votre navigateur.

### Build de Production

```bash
npm run build
```

### Prévisualiser le Build

```bash
npm run preview
```

## Identifiants de Démonstration

**Compte Administrateur:**
- Nom d'utilisateur: `admin`
- Mot de passe: `admin123`

## Structure du Projet

```
src/
├── App.jsx                    # Application principale avec routage
├── main.jsx                   # Point d'entrée React
├── components/
│   ├── Homepage.jsx          # Page d'accueil avec carrousel
│   ├── Gallery.jsx           # Parcourir les objets
│   ├── ObjectDetail.jsx      # Page de détails d'objet
│   ├── Navigation.jsx        # Navigation d'en-tête
│   ├── Login.jsx             # Formulaire de connexion
│   ├── AdminDashboard.jsx    # Panneau d'administration
│   ├── About.jsx             # Page à propos
│   ├── Contact.jsx           # Page de contact
│   └── Notification.jsx      # Système de notifications
├── data/
│   ├── objects.js            # 6 objets 3D d'exemple
│   └── users.js              # Authentification simulée
└── styles/
    ├── main.css              # Styles globaux
    ├── homepage.css          # Styles de la page d'accueil
    ├── gallery.css           # Styles de la galerie
    ├── navigation.css        # Styles de navigation
    ├── object-detail.css     # Styles de la page de détails
    ├── auth.css              # Styles des formulaires d'authentification
    ├── admin.css             # Styles du tableau de bord admin
    ├── about.css             # Styles de la page à propos
    ├── contact.css           # Styles de la page de contact
    └── notification.css      # Styles des notifications
```

## Aperçu des Fonctionnalités

### Objets 3D
- 6 objets d'exemple dans 3 catégories (Mobilier, Éclairage, Décoration)
- Formats de fichiers multiples (GLB, GLTF, OBJ, FBX, STL)
- Spécifications détaillées (polygones, sommets, taille de fichier)
- Suivi des téléchargements
- Visionneuse 3D interactive avec rotation automatique
- Système d'objets en vedette

### Carrousel Héro
- 3 diapositives interactives avec images de fond
- Navigation par flèches et points
- Lecture automatique avec pause au survol
- Support tactile pour mobile (swipe)
- Animations fluides

### Système d'Authentification
- Connexion administrateur
- Accès basé sur les rôles
- Gestion de session avec LocalStorage
- Affichage/masquage du mot de passe

### Fonctionnalités Admin
- Ajouter de nouveaux objets 3D
- Modifier les objets existants
- Supprimer des objets avec confirmation
- Télécharger des modèles 3D (GLB, GLTF, OBJ, FBX, STL)
- Marquer les objets comme "En Vedette"
- Gestion complète des métadonnées
- Interface responsive optimisée pour mobile

### Pages
- **Accueil** - Carrousel héro + objets en vedette
- **Galerie** - Tous les objets avec recherche et filtres
- **Détails** - Spécifications complètes et téléchargements
- **À Propos** - Information sur la marketplace
- **Contact** - Formulaire de contact avec validation
- **Connexion** - Authentification administrateur
- **Tableau de Bord** - Gestion des objets (admin uniquement)

## Personnalisation

### Ajouter de Vrais Modèles 3D

1. Placez vos fichiers 3D dans `public/models/`
2. Mettez à jour `src/data/objects.js`:

```javascript
{
  id: 7,
  name: "Votre Objet",
  category: "Mobilier",
  description: "Description de votre objet...",
  model: "/models/votre-modele.glb",
  formats: ["GLB", "OBJ"],
  fileSize: "3.5 MB",
  polygons: 50000,
  vertices: 25000,
  downloads: 0,
  featured: false
}
```

### Ajouter des Images de Carrousel

Placez vos images dans `public/heroslides/` et mettez à jour les diapositives dans `Homepage.jsx`.

### Changer les Couleurs

Les couleurs principales sont définies dans les fichiers CSS:
- Couleur primaire: `#dda15e` (or/orange)
- Arrière-plan: `#f5f5f5` (gris clair)

## Langues

L'interface est entièrement en français, incluant:
- Tous les textes de l'interface utilisateur
- Messages d'erreur et notifications
- Descriptions des produits
- Formulaires et labels

## Responsive Design

- **Desktop** - Grille 3 colonnes pour les cartes
- **Tablette** - Grille 2 colonnes
- **Mobile** - Grille 1 colonne avec optimisations tactiles
- Modales plein écran sur mobile
- Navigation hamburger sur petits écrans

## Licence

MIT
