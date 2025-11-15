# 3D Marketplace Website

A modern 3D object marketplace built with React and Vite. Browse, search, and download premium 3D models.

## Features

- **Homepage** - Hero section with featured 3D objects
- **Gallery** - Browse all objects with search and category filtering
- **Object Details** - View specifications and download in multiple formats
- **Authentication** - User login and registration system
- **Admin Dashboard** - Manage 3D objects (add, edit, delete)
- **Responsive Design** - Works on all devices

## Tech Stack

- React 19
- Vite 7
- Custom CSS (no frameworks)
- Mock data for demo purposes

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Demo Credentials

**Admin Account:**
- Username: `admin`
- Password: `admin123`

**User Account:**
- Username: `user`
- Password: `user123`

## Project Structure

```
src/
├── App.jsx                    # Main app with routing
├── main.jsx                   # React entry point
├── components/
│   ├── Homepage.jsx          # Landing page
│   ├── Gallery.jsx           # Browse objects
│   ├── ObjectDetail.jsx      # Object details page
│   ├── Navigation.jsx        # Header navigation
│   ├── Login.jsx             # Login form
│   ├── Register.jsx          # Registration form
│   └── AdminDashboard.jsx    # Admin panel
├── data/
│   ├── objects.js            # 6 sample 3D objects
│   └── users.js              # Mock authentication
└── styles/
    ├── main.css              # Global styles
    ├── homepage.css          # Homepage styles
    ├── gallery.css           # Gallery styles
    ├── navigation.css        # Navigation styles
    ├── object-detail.css     # Detail page styles
    ├── auth.css              # Auth forms styles
    └── admin.css             # Admin dashboard styles
```

## Features Overview

### 3D Objects
- 6 sample objects across 3 categories (Furniture, Lighting, Decoration)
- Multiple file formats (OBJ, FBX, GLB, STL)
- Detailed specifications (polygons, vertices, file size)
- Download tracking

### User System
- Login/Register functionality
- Role-based access (admin/user)
- LocalStorage-based session management

### Admin Features
- Add new 3D objects
- Edit existing objects
- Delete objects
- Manage all object metadata

## Customization

### Adding Real Images

Replace placeholder images in `src/data/objects.js` with your own:

```javascript
image: "/images/your-image.jpg"
```

Place images in `public/images/` folder.

### Adding More Objects

Edit `src/data/objects.js` and add new objects following the existing structure.

## License

MIT
