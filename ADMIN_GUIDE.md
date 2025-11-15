# Admin Dashboard Guide

## Overview
The 3D Marketplace now features a comprehensive admin-only system for managing 3D objects. All changes are persisted in browser localStorage and reflected immediately across the site.

## Admin Access

### Login Credentials
```
Username: admin
Password: admin123
```

### Access Points
1. Click "Admin Login" in the navigation
2. Enter credentials
3. Redirected to Admin Dashboard automatically

## Supported 3D Formats

The system supports the following 3D file formats:

### ✅ Fully Supported Formats
1. **GLB** (GL Transmission Format Binary)
   - Recommended format
   - Best performance
   - Single file with textures

2. **GLTF** (GL Transmission Format)
   - JSON-based format
   - Separate texture files
   - Industry standard

3. **OBJ** (Wavefront Object)
   - Widely supported
   - Simple geometry
   - Requires MTL file for materials

4. **FBX** (Filmbox)
   - Autodesk format
   - Animation support
   - Complex scenes

5. **STL** (Stereolithography)
   - 3D printing format
   - Simple geometry
   - No color/texture

## Admin Dashboard Features

### 1. Add New 3D Objects

#### Required Fields
- **Object Name**: Descriptive name (e.g., "Modern Office Chair")
- **Category**: Choose from Furniture, Lighting, or Decoration
- **Description**: Detailed description of the object
- **3D Model Path**: Path to model file (e.g., `/models/chair.glb`)
- **File Size**: Size of the 3D file (e.g., "2.8 MB")
- **Polygons**: Number of polygons in the model
- **Vertices**: Number of vertices in the model
- **Formats**: Select all available formats (at least one required)

#### Optional Fields
- **Preview Image URL**: Custom preview image (uses placeholder if empty)

#### Steps to Add
1. Fill in all required fields
2. Select at least one 3D format
3. Click "Add Object"
4. Object appears immediately in gallery

### 2. Edit Existing Objects

#### How to Edit
1. Find object in the list
2. Click "Edit" button
3. Modify any fields
4. Click "Update Object"
5. Changes reflect immediately

#### What You Can Edit
- All object properties
- Name, description, category
- Model path and formats
- Technical specifications
- Featured status

### 3. Delete Objects

#### How to Delete
1. Find object in the list
2. Click "Delete" button
3. Confirm deletion
4. Object removed permanently

⚠️ **Warning**: Deletion cannot be undone!

### 4. Toggle Featured Status

#### Featured Objects
- Appear on homepage
- Highlighted in gallery
- Better visibility

#### How to Toggle
1. Find object in list
2. Check/uncheck "Featured" checkbox
3. Changes save automatically

## Adding 3D Models

### Step-by-Step Process

#### 1. Prepare Your 3D Model
```bash
# Recommended: Convert to GLB format
# Use tools like Blender, 3ds Max, or online converters
```

#### 2. Place Model File
```bash
# Copy your model to:
3D-hustle/public/models/your-model.glb
```

#### 3. Add to Dashboard
1. Login to admin dashboard
2. Click "Add New Object"
3. Fill in details:
   - Name: "Your Model Name"
   - Category: Select appropriate category
   - Description: Describe the model
   - Model Path: `/models/your-model.glb`
   - File Size: Check actual file size
   - Polygons: Get from 3D software
   - Vertices: Get from 3D software
   - Formats: Select GLB (or others if available)

#### 4. Verify
1. Check gallery page
2. Click on your object
3. Verify 3D viewer works
4. Test camera controls

## Format-Specific Guidelines

### GLB/GLTF
- **Best for**: Web display
- **Pros**: Fast loading, embedded textures
- **Cons**: None for web use
- **Recommended**: Yes

### OBJ
- **Best for**: Simple models
- **Pros**: Universal support
- **Cons**: Separate texture files needed
- **Recommended**: For simple geometry

### FBX
- **Best for**: Complex scenes
- **Pros**: Animation support
- **Cons**: Larger file size
- **Recommended**: For animated models

### STL
- **Best for**: 3D printing
- **Pros**: Simple, universal
- **Cons**: No textures or colors
- **Recommended**: For technical models

## Data Persistence

### How It Works
- All changes saved to browser localStorage
- Data persists across sessions
- No database required
- Instant updates

### Storage Location
```javascript
localStorage.getItem('3d_objects')
```

### Backup Your Data
```javascript
// In browser console:
console.log(localStorage.getItem('3d_objects'));
// Copy the output to save your data
```

### Restore Data
```javascript
// In browser console:
localStorage.setItem('3d_objects', 'YOUR_BACKUP_DATA');
// Refresh the page
```

### Clear All Data
```javascript
// In browser console:
localStorage.removeItem('3d_objects');
// Refresh to load default objects
```

## Best Practices

### File Organization
```
public/models/
├── furniture/
│   ├── chair.glb
│   ├── sofa.glb
│   └── table.glb
├── lighting/
│   ├── lamp.glb
│   └── chandelier.glb
└── decoration/
    ├── vase.glb
    └── trophy.glb
```

### Naming Conventions
- Use lowercase
- Replace spaces with underscores or hyphens
- Be descriptive: `modern_office_chair.glb`
- Include version if needed: `chair_v2.glb`

### File Size Guidelines
- **Small**: < 2 MB (recommended)
- **Medium**: 2-5 MB (acceptable)
- **Large**: 5-10 MB (use sparingly)
- **Very Large**: > 10 MB (optimize first)

### Optimization Tips
1. **Reduce Polygons**: Use decimation in Blender
2. **Compress Textures**: Use smaller image sizes
3. **Remove Hidden Geometry**: Delete unseen faces
4. **Use GLB Format**: Better compression than GLTF
5. **Test Performance**: Check on mobile devices

## Troubleshooting

### Model Not Displaying
**Problem**: 3D model doesn't show in viewer

**Solutions**:
1. Check file path is correct
2. Verify file exists in `public/models/`
3. Ensure format is supported
4. Check browser console for errors
5. Try different browser

### Slow Loading
**Problem**: Models take long to load

**Solutions**:
1. Reduce file size
2. Optimize polygon count
3. Compress textures
4. Use GLB instead of GLTF
5. Check internet connection

### Changes Not Saving
**Problem**: Edits don't persist

**Solutions**:
1. Check browser localStorage is enabled
2. Clear browser cache
3. Try different browser
4. Check for JavaScript errors
5. Verify localStorage quota not exceeded

### Format Not Supported
**Problem**: Model format doesn't work

**Solutions**:
1. Convert to GLB format
2. Use online converter
3. Export from 3D software
4. Check model-viewer compatibility
5. Verify file isn't corrupted

## Security Notes

### Admin Access
- Only one admin account
- Change default password in production
- No user registration available
- Admin-only dashboard access

### Data Storage
- localStorage is client-side only
- Data not synced across devices
- Clear browser data = lose changes
- Backup important data regularly

## Advanced Features

### Bulk Operations
Currently not supported. Future enhancements:
- Bulk upload
- Batch editing
- CSV import/export
- Category management

### Analytics
Track object performance:
- Download counts
- View statistics
- Popular categories
- User engagement

### API Integration
Future possibilities:
- Backend database
- Cloud storage
- CDN integration
- Real-time sync

## Support

### Common Issues
1. Model not loading → Check file path
2. Slow performance → Optimize model
3. Format error → Convert to GLB
4. Data lost → Restore from backup

### Resources
- [Model Viewer Docs](https://modelviewer.dev/)
- [GLTF Validator](https://github.khronos.org/glTF-Validator/)
- [Blender Export Guide](https://docs.blender.org/manual/en/latest/addons/import_export/scene_gltf2.html)
- [3D Optimization Tools](https://gltf.report/)

---

**Last Updated**: November 2024
**Version**: 2.0.0
**Status**: Production Ready ✅
