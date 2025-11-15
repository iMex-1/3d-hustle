# Quick Start Guide

## Run the Project

1. **Install dependencies:**
   ```bash
   cd 3dwebsite
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   Navigate to `http://localhost:5173`

## Test the Features

### Browse as Guest
- View homepage with featured objects
- Browse gallery with search and filters
- View object details

### Login as User
- Username: `user`
- Password: `user123`
- Download 3D objects in various formats

### Login as Admin
- Username: `admin`
- Password: `admin123`
- Access admin dashboard
- Add, edit, or delete 3D objects

## Navigation

- **Home** - Landing page with featured objects
- **Gallery** - Browse all 6 sample objects
- **Login/Register** - User authentication
- **Admin** - Admin dashboard (admin only)

## Key Pages

1. **Homepage** (`/`)
   - Hero section
   - Featured 3D objects grid

2. **Gallery** (`/gallery`)
   - Search bar
   - Category filters (All, Furniture, Lighting, Decoration)
   - Object cards with hover effects

3. **Object Detail** (`/detail`)
   - Large image preview
   - Specifications (polygons, vertices, file size)
   - Download buttons for each format

4. **Admin Dashboard** (`/admin`)
   - Form to add/edit objects
   - List of all objects with edit/delete actions

## Customization Tips

### Change Colors
Edit `src/styles/main.css` and component-specific CSS files.

### Add More Objects
Edit `src/data/objects.js` and add new entries.

### Replace Placeholder Images
Update the `image` property in `src/data/objects.js` with your own image URLs or local paths.

## Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.
