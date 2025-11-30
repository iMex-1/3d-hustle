# Testing Data Loading

## Quick Test in Browser Console

Open your browser console (F12) and run these commands:

### 1. Check if objects are loaded
```javascript
// Import and check objects
import { objects } from './src/data/objects.js';
console.log('Objects:', objects);
console.log('Number of objects:', objects.length);
```

### 2. Check localStorage
```javascript
// Check what's in localStorage
const saved = localStorage.getItem('3d_objects');
if (saved) {
    const parsed = JSON.parse(saved);
    console.log('Saved objects:', parsed);
    console.log('Number of saved objects:', parsed.length);
} else {
    console.log('No objects in localStorage');
}
```

### 3. Clear localStorage and reload
```javascript
localStorage.clear();
location.reload();
```

### 4. Check if XKT files are accessible
```javascript
// Test if XKT files can be fetched
fetch('/files/output/Building-Architecture.xkt')
    .then(response => {
        console.log('XKT file status:', response.status);
        console.log('XKT file OK:', response.ok);
        return response.blob();
    })
    .then(blob => {
        console.log('XKT file size:', blob.size, 'bytes');
    })
    .catch(error => {
        console.error('Error fetching XKT:', error);
    });
```

### 5. Check if IFC files are accessible
```javascript
// Test if IFC files can be fetched
fetch('/files/input/Building-Architecture.ifc')
    .then(response => {
        console.log('IFC file status:', response.status);
        console.log('IFC file OK:', response.ok);
        return response.blob();
    })
    .then(blob => {
        console.log('IFC file size:', blob.size, 'bytes');
    })
    .catch(error => {
        console.error('Error fetching IFC:', error);
    });
```

## Expected Results

### Objects Data
You should see 9 objects with these properties:
- id
- name
- category
- description
- xktFile (path starting with /files/output/)
- ifcFile (path starting with /files/input/)
- fileSize
- downloads
- featured

### File Access
- XKT files should return status 200
- IFC files should return status 200
- File sizes should be > 0 bytes

## Common Issues

### Issue: "No objects in localStorage"
**Solution:** This is normal on first load. The app will populate it.

### Issue: "404 Not Found" for XKT/IFC files
**Solution:** 
1. Check files exist in `public/files/input/` and `public/files/output/`
2. Verify file names match exactly (case-sensitive)
3. Restart dev server: `npm run dev`

### Issue: "Objects array is empty"
**Solution:**
1. Check `src/data/objects.js` has 9 objects
2. Clear localStorage: `localStorage.clear()`
3. Refresh page

### Issue: "XeokitViewer errors in console"
**Solution:**
1. Check xeokit-sdk is installed: `npm list @xeokit/xeokit-sdk`
2. If not installed: `npm install @xeokit/xeokit-sdk`
3. Restart dev server

## Debug Mode

Add this to your Gallery component temporarily to see what's happening:

```javascript
useEffect(() => {
    console.log('Gallery: initialObjects', initialObjects);
    console.log('Gallery: objects state', objects);
    console.log('Gallery: filteredObjects', filteredObjects);
}, [objects, filteredObjects]);
```

This will log every time the data changes.
