# OakMesh - BIM Model Viewer

A modern web application for viewing and downloading BIM models using xeokit.

## 🚀 Quick Start

```bash
npm run dev
```

**Important:** Clear browser localStorage first (F12 → Console → `localStorage.clear()`)

Visit: http://localhost:5173

## 📦 What's Included

### 9 BIM Models Ready to View

**Building Models (4):**
- Building Architecture
- Building HVAC
- Building Structural  
- Building Landscaping

**Infrastructure Models (5):**
- Infrastructure Bridge
- Infrastructure Road
- Infrastructure Landscaping
- Infrastructure Plumbing
- Infrastructure Rail

All models include:
- ✅ XKT file for 3D viewing
- ✅ IFC file for download

## 🎯 Features

- **3D Viewer** - Interactive xeokit-based BIM viewer
- **Download IFC** - Download original IFC files
- **Search & Filter** - Find models by name or category
- **Featured Models** - Highlighted models on homepage
- **Admin Panel** - Manage models (add/edit/delete)
- **Responsive** - Works on desktop and mobile

## 📂 Project Structure

```
public/
  files/
    input/          # IFC files (for download)
    output/         # XKT files (for viewing)

src/
  components/
    XeokitViewer.jsx      # 3D viewer component
    Gallery.jsx           # Model gallery
    Homepage.jsx          # Landing page
    ObjectDetail.jsx      # Model details
    AdminDashboard.jsx    # Admin panel
  data/
    objects.js            # Model data
```

## 🔧 Tech Stack

- **React 19** - UI framework
- **Xeokit SDK** - 3D BIM viewer
- **Vite** - Build tool
- **IFC** - Industry Foundation Classes (download format)
- **XKT** - Xeokit format (optimized for web)

## 📝 Adding New Models

1. Place IFC file in `public/files/input/`
2. Convert to XKT:
   ```bash
   npm install -g @xeokit/xeokit-convert
   xeokit-convert -s public/files/input/Model.ifc -o public/files/output/Model.xkt
   ```
3. Add to `src/data/objects.js`
4. Clear localStorage and refresh

## 👨‍💼 Admin Access

- Username: `admin`
- Password: `admin123`

## 📚 Documentation

- `QUICK_START.md` - Fast setup guide
- `SETUP_INSTRUCTIONS.md` - Detailed instructions
- `IFC_TO_XKT_CONVERSION.md` - Conversion guide
- `convert-ifc-to-xkt.ps1` - Automated conversion script

## 🐛 Troubleshooting

**Models not showing?**
```javascript
// In browser console:
localStorage.clear()
// Then refresh page
```

**Need to convert IFC files?**
```bash
.\convert-ifc-to-xkt.ps1
```

## 📄 License

This project uses:
- Xeokit SDK (AGPL-3.0 / Commercial)
- React (MIT)
- Vite (MIT)

## 🎉 Ready to Use!

All 9 models are configured and ready. Just start the dev server and clear localStorage!
