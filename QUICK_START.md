# Quick Start Guide

## 🚀 Start the App Now

```bash
npm run dev
```

Then open: http://localhost:5173

**Important:** Clear your browser's localStorage first (F12 → Application → Clear Storage) to remove old model data.

## 📦 Current Status

✅ **All 9 BIM Models Ready!**
- Building Architecture ✅
- Building HVAC ✅
- Building Structural ✅
- Building Landscaping ✅
- Infrastructure Bridge ✅
- Infrastructure Road ✅
- Infrastructure Landscaping ✅
- Infrastructure Plumbing ✅
- Infrastructure Rail ✅

All models have both IFC (download) and XKT (viewing) files ready!

## 🎯 What You Can Do

1. **View Models** - Browse the gallery and see all 9 models in 3D
2. **Download IFC** - Click on any model to see details and download the IFC file
3. **Filter by Category** - Architecture, MEP, Structure, Paysage, Infrastructure
4. **Admin Panel** - Login (admin/admin123) to add/edit/delete models
5. **Upload Models** - In admin panel, upload XKT (for viewing) and IFC (for download)

## 📂 File Structure

```
public/
  files/
    input/          ← IFC files (for download)
      Building-Architecture.ifc
      Building-Hvac.ifc
      Building-Structural.ifc
      Building-Landscaping.ifc
      Infra-Bridge.ifc
      Infra-Road.ifc
      Infra-Landscaping.ifc
      Infra-Plumbing.ifc
      Infra-Rail.ifc
    output/         ← XKT files (for 3D viewing)
      Building-Architecture.xkt
      Building-Hvac.xkt
      Building-Structural.xkt
      Building-Landscaping.xkt
      Infra-Bridge.xkt
      Infra-Road.xkt
      Infra-Landscaping.xkt
      Infra-Plumbing.xkt
      Infra-Rail.xkt
```

## 🔧 Tech Stack

- **React** - UI framework
- **Xeokit** - 3D BIM viewer
- **Vite** - Build tool
- **IFC** - Download format (original BIM data)
- **XKT** - Viewing format (optimized for web)

## 📝 To Add More Models

1. Place IFC file in `public/files/input/`
2. Convert to XKT:
   ```bash
   xeokit-convert -s public/files/input/YourModel.ifc -o public/files/output/YourModel.xkt
   ```
3. Add to `src/data/objects.js`:
   ```javascript
   {
       id: 10,
       name: "Your Model Name",
       category: "Architecture", // or MEP, Structure, Paysage, Infrastructure
       description: "Model description",
       xktFile: "/files/output/YourModel.xkt",
       ifcFile: "/files/input/YourModel.ifc",
       fileSize: "1.5 Mo",
       downloads: 0,
       featured: true
   }
   ```

## 🐛 Troubleshooting

**Models not showing?**
- Clear localStorage: Open DevTools (F12) → Console → Type: `localStorage.clear()`
- Refresh page

**Xeokit errors?**
- Check XKT files exist in `/public/files/output/`
- Verify paths in `objects.js` start with `/files/` not `/public/files/`

**Old models still appearing?**
- Clear localStorage and refresh

## 🎨 Features

- ✅ 9 BIM models ready to view
- ✅ 3D visualization with xeokit
- ✅ IFC file downloads
- ✅ Search and filter
- ✅ Featured models section
- ✅ Admin panel for management
- ✅ Clean UI without unnecessary libraries

That's it! You're ready to go! 🎉
