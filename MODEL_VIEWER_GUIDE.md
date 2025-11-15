# 3D Model Viewer Integration Guide

## Overview
This project now uses Google's `<model-viewer>` web component to display interactive 3D models directly in the browser. All 3D models are stored in the `public/models/` folder and rendered with full interactivity.

## Features Implemented

### 🎨 3D Model Display
- **Interactive 3D viewer** on all pages
- **Auto-rotate** feature for automatic model rotation
- **Camera controls** - users can zoom, pan, and rotate models
- **Shadow rendering** for realistic presentation
- **Responsive sizing** - adapts to container dimensions

### 📦 Available 3D Models

1. **Modern Office Chair** (`chair.glb`)
   - Category: Furniture
   - Format: GLB
   - Size: 2.8 MB

2. **Scandinavian Nightstand** (`scandi_nightstand_psx_style__low-poly_3d_model.glb`)
   - Category: Furniture
   - Format: GLB
   - Size: 1.5 MB
   - Style: Low-poly PSX

3. **Activated Amethyst Crystal** (`activated_ametyst.glb`)
   - Category: Decoration
   - Format: GLB
   - Size: 3.2 MB

4. **Comfortable Sofa** (`sofa.glb`)
   - Category: Furniture
   - Format: GLB
   - Size: 4.1 MB

5. **Drinking Fountain** (`drinking_fountain.glb`)
   - Category: Decoration
   - Format: GLB
   - Size: 2.9 MB

6. **Golden Achievement Trophy** (`golden_achievement_trophy.gltf`)
   - Category: Decoration
   - Format: GLTF
   - Size: 1.8 MB

### 🎯 Where Models Are Displayed

#### Homepage - Featured Section
- 3D models shown in featured cards
- Auto-rotate enabled
- Click to view full details

#### Gallery Page
- All models displayed in grid layout
- Interactive 3D preview on each card
- Camera controls enabled
- Hover overlay with "View Details" button

#### Object Detail Page
- Full-size 3D model viewer
- Complete camera controls
- Auto-rotate feature
- Shadow rendering
- Download buttons for each format

### 🎨 React Icons Integration

All UI elements now use React Icons for consistent, scalable iconography:

#### Navigation Icons
- `FaHome` - Home link
- `FaImages` - Gallery link
- `FaUserShield` - Admin link
- `FaCube` - Brand logo
- `FaSignInAlt` - Login button
- `FaUserPlus` - Register button
- `FaSignOutAlt` - Logout button

#### Content Icons
- `FaCube` - File size indicator
- `FaDownload` - Downloads count & download buttons
- `FaChevronLeft/Right` - Carousel navigation
- `FaArrowLeft` - Back button

## Technical Implementation

### Model Viewer Setup

The model-viewer script is loaded in `index.html`:
```html
<script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js"></script>
```

### Usage in Components

```jsx
<model-viewer
    src={object.model}
    alt={object.name}
    auto-rotate
    camera-controls
    shadow-intensity="1"
    style={{ width: '100%', height: '100%' }}
></model-viewer>
```

### Model Viewer Attributes

- **src**: Path to the 3D model file
- **alt**: Alternative text for accessibility
- **auto-rotate**: Enables automatic rotation
- **camera-controls**: Enables user interaction (zoom, pan, rotate)
- **shadow-intensity**: Controls shadow darkness (0-1)
- **style**: CSS styling for dimensions

## Supported Formats

- **GLB** (GL Transmission Format Binary) - Recommended
- **GLTF** (GL Transmission Format)
- **OBJ** (with MTL files)
- **FBX** (via conversion)
- **STL** (via conversion)

## Adding New Models

### Step 1: Add Model File
Place your 3D model in `public/models/` folder:
```
public/models/your-model.glb
```

### Step 2: Update objects.js
Add entry to the objects array in `src/data/objects.js`:
```javascript
{
  id: 7,
  name: "Your Model Name",
  category: "Furniture", // or "Lighting", "Decoration"
  description: "Model description",
  image: "placeholder-url", // Optional preview image
  model: "/models/your-model.glb",
  formats: ["GLB"],
  fileSize: "X.X MB",
  polygons: 00000,
  vertices: 00000,
  downloads: 0,
  featured: true // or false
}
```

### Step 3: Test
The model will automatically appear in:
- Gallery (if not featured)
- Homepage featured section (if featured: true)
- Detail page when clicked

## Model Viewer Controls

### User Interactions
- **Left Click + Drag**: Rotate model
- **Right Click + Drag**: Pan camera
- **Scroll Wheel**: Zoom in/out
- **Two-finger Pinch**: Zoom on mobile
- **Two-finger Drag**: Rotate on mobile

### Auto-Rotate
Models automatically rotate when idle. Interaction pauses auto-rotate.

## Performance Optimization

### Best Practices
1. **Optimize models** before upload (reduce polygons if possible)
2. **Use GLB format** for best performance
3. **Compress textures** to reduce file size
4. **Test on mobile** devices for performance

### File Size Guidelines
- Small models: < 2 MB
- Medium models: 2-5 MB
- Large models: 5-10 MB
- Very large: > 10 MB (consider optimization)

## Browser Compatibility

Model-viewer works on:
- ✅ Chrome 67+
- ✅ Firefox 65+
- ✅ Safari 12.1+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Model Not Loading
1. Check file path is correct
2. Verify model file exists in `public/models/`
3. Check browser console for errors
4. Ensure model format is supported

### Performance Issues
1. Reduce polygon count
2. Compress textures
3. Use GLB instead of GLTF
4. Disable auto-rotate on mobile

### Display Issues
1. Check container dimensions
2. Verify CSS styling
3. Test in different browsers
4. Check model scale

## Advanced Features

### Custom Styling
```jsx
<model-viewer
    src={model}
    style={{
        width: '100%',
        height: '500px',
        background: 'linear-gradient(#f0f0f0, #ffffff)'
    }}
></model-viewer>
```

### Additional Attributes
- `exposure`: Lighting intensity
- `environment-image`: Custom HDR environment
- `skybox-image`: Background image
- `poster`: Loading placeholder image
- `loading`: "eager" or "lazy"

## Resources

- [Model Viewer Documentation](https://modelviewer.dev/)
- [GLB/GLTF Validator](https://github.khronos.org/glTF-Validator/)
- [3D Model Optimization Tools](https://www.khronos.org/gltf/)
- [React Icons Library](https://react-icons.github.io/react-icons/)

## Future Enhancements

- [ ] AR (Augmented Reality) support
- [ ] Model annotations
- [ ] Animation playback
- [ ] Material variants
- [ ] Custom lighting controls
- [ ] Screenshot capture
- [ ] Model comparison view
