# Setup Instructions

## Current Status

Your project is now configured to use xeokit for displaying IFC/XKT models!

### ✅ Available Models (9 Total)

**Building Models:**
1. Building Architecture (IFC + XKT) ✅
2. Building HVAC (IFC + XKT) ✅
3. Building Structural (IFC + XKT) ✅
4. Building Landscaping (IFC + XKT) ✅

**Infrastructure Models:**
5. Infrastructure Bridge (IFC + XKT) ✅
6. Infrastructure Road (IFC + XKT) ✅
7. Infrastructure Landscaping (IFC + XKT) ✅
8. Infrastructure Plumbing (IFC + XKT) ✅
9. Infrastructure Rail (IFC + XKT) ✅

### What's Working

1. ✅ Xeokit viewer component created
2. ✅ Gallery displays all 9 XKT models
3. ✅ Homepage shows 4 featured models
4. ✅ Object detail page with IFC download
5. ✅ Admin dashboard for managing models
6. ✅ All unnecessary libraries removed (framer-motion, react-icons, model-viewer)
7. ✅ All 9 models configured in objects.js

### To Start the App

1. Clear browser localStorage (to remove old data):
   - Open browser DevTools (F12)
   - Go to Application/Storage tab
   - Clear localStorage
   - Or run this in console: `localStorage.clear()`

2. Start the dev server:
   ```bash
   npm run dev
   ```

3. Visit: http://localhost:5173

### File Organization

```
public/
  files/
    input/          ← IFC files (original BIM data for download)
      Building-Architecture.ifc
      Building-Hvac.ifc
      Building-Structural.ifc
      Building-Landscaping.ifc
      Infra-Bridge.ifc
      Infra-Road.ifc
      Infra-Landscaping.ifc
      Infra-Plumbing.ifc
      Infra-Rail.ifc
      
    output/         ← XKT files (optimized for web viewing)
      Building-Architecture.xkt
      Building-Hvac.xkt
      Building-Structural.xkt
      Building-Landscaping.xkt
      Infra-Bridge.xkt
      Infra-Road.xkt
      Infra-Landscaping.xkt
      Infra-Plumbing.xkt
      Infra-Rail.xkt

src/
  components/
    XeokitViewer.jsx          ← Xeokit viewer component
    Gallery.jsx               ← Displays all models
    Homepage.jsx              ← Featured models
    ObjectDetail.jsx          ← Model details + download
    AdminDashboard.jsx        ← Manage models
  data/
    objects.js                ← All 9 models configured here
```

### To Add More Models

If you want to add additional IFC files:

#### Step 1: Add IFC File
Place your IFC file in `public/files/input/`

#### Step 2: Convert to XKT

**Option A: Using CLI**
```bash
# Install converter (if not already installed)
npm install -g @xeokit/xeokit-convert

# Convert single file
xeokit-convert -s public/files/input/YourModel.ifc -o public/files/output/YourModel.xkt
```

**Option B: Using the Script**
```bash
# Converts all IFC files in input folder
.\convert-ifc-to-xkt.ps1
```

#### Step 3: Add to objects.js

Edit `src/data/objects.js` and add:

```javascript
{
    id: 10, // Next available ID
    name: "Your Model Name",
    category: "Architecture", // or MEP, Structure, Paysage, Infrastructure
    description: "Detailed description of your model",
    xktFile: "/files/output/YourModel.xkt",
    ifcFile: "/files/input/YourModel.ifc",
    fileSize: "X.X Mo",
    downloads: 0,
    featured: false // or true to show on homepage
}
```

#### Step 4: Refresh App
1. Clear localStorage
2. Refresh browser

### Categories

- **Architecture** - Building architecture, walls, doors, windows
- **MEP** - Mechanical, Electrical, Plumbing systems
- **Structure** - Structural elements, beams, columns
- **Paysage** - Landscaping, vegetation, outdoor elements
- **Infrastructure** - Roads, bridges, rails, civil works

### Features

- 📦 View XKT models in 3D with xeokit
- ⬇️ Download original IFC files
- 🎨 Clean UI without unnecessary animations
- 👨‍💼 Admin panel to add/edit/delete models
- 🔍 Search and filter by category
- ⭐ Featured models section (4 models on homepage)
- 📱 Responsive design

### Admin Access

- **Username:** admin
- **Password:** admin123

In admin panel you can:
- Add new models (upload XKT + IFC)
- Edit existing models
- Delete models
- Toggle featured status

### Troubleshooting

**If models don't display:**
1. Check browser console for errors
2. Verify XKT file paths are correct in objects.js
3. Make sure XKT files exist in `/public/files/output/`
4. Clear localStorage and refresh
5. Check that paths use `/files/` not `/public/files/`

**If you see old data:**
1. Clear localStorage: `localStorage.clear()`
2. Refresh the page

**If xeokit viewer shows errors:**
1. Check that XKT files are properly converted
2. Verify file paths in objects.js
3. Check browser console for specific errors
4. Ensure xeokit-sdk is installed: `npm list @xeokit/xeokit-sdk`

**If downloads don't work:**
1. Check that IFC files exist in `/public/files/input/`
2. Verify ifcFile paths in objects.js
3. Check browser console for errors

### Performance Tips

- XKT files are optimized for web viewing (much smaller than IFC)
- Large models may take a few seconds to load
- Use featured: true sparingly (only 4 models on homepage)
- Consider file size when adding new models

### Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Supported

Enjoy your BIM viewer! 🎉
