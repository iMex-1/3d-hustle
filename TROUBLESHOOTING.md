# Troubleshooting Guide

## Models Not Showing

### Step 1: Check Browser Console
1. Open DevTools (F12)
2. Go to Console tab
3. Look for these messages:
   - `Gallery: Loading objects` - Should show 9 objects
   - `Gallery: Current objects state` - Should show 9 objects
   - `Gallery: Filtered objects` - Should show objects based on filter
   - `XeokitViewer: Loading model from` - Should show for each model

### Step 2: Check for Errors
Look for red error messages in console:
- **"Cannot find module"** → Run `npm install`
- **"404 Not Found"** → Files missing or wrong path
- **"XKTLoaderPlugin is not defined"** → xeokit-sdk not installed

### Step 3: Verify Files Exist
Run in terminal:
```bash
# Check XKT files
dir public\files\output\*.xkt

# Check IFC files  
dir public\files\input\*.ifc
```

You should see 9 files in each directory.

### Step 4: Test File Access
In browser console:
```javascript
fetch('/files/output/Building-Architecture.xkt')
    .then(r => console.log('XKT Status:', r.status))
    .catch(e => console.error('XKT Error:', e));
```

Should show: `XKT Status: 200`

### Step 5: Clear Everything and Restart
```bash
# Stop dev server (Ctrl+C)

# Clear node_modules and reinstall
rmdir /s /q node_modules
npm install

# Start dev server
npm run dev
```

In browser:
```javascript
localStorage.clear();
location.reload();
```

## Specific Issues

### Issue: Blank Gallery Page
**Symptoms:** Gallery page loads but no models shown

**Solutions:**
1. Check console for `Gallery: Current objects state` - should show 9 objects
2. If it shows empty array `[]`:
   - Check `src/data/objects.js` exists and has 9 objects
   - Restart dev server
3. If it shows objects but nothing renders:
   - Check CSS is loading
   - Check for JavaScript errors

### Issue: "XKT file not found" (404)
**Symptoms:** Console shows 404 errors for XKT files

**Solutions:**
1. Verify files exist:
   ```bash
   dir public\files\output
   ```
2. Check file names match exactly (case-sensitive)
3. Verify paths in `objects.js` start with `/files/` not `/public/files/`
4. Restart dev server

### Issue: Xeokit Viewer Shows Black Screen
**Symptoms:** Model card shows but viewer is black

**Solutions:**
1. Check console for xeokit errors
2. Verify XKT file is valid:
   - File size should be > 0 bytes
   - File should be properly converted from IFC
3. Try re-converting IFC to XKT:
   ```bash
   xeokit-convert -s public/files/input/Building-Architecture.ifc -o public/files/output/Building-Architecture.xkt
   ```

### Issue: "Viewer is not defined"
**Symptoms:** Error about Viewer or XKTLoaderPlugin

**Solutions:**
1. Install xeokit-sdk:
   ```bash
   npm install @xeokit/xeokit-sdk
   ```
2. Restart dev server
3. Clear browser cache

### Issue: Models Load Slowly
**Symptoms:** Models take long time to appear

**Solutions:**
1. This is normal for large XKT files
2. Check XKT file sizes - should be optimized (< 5MB each)
3. If files are too large, re-convert with compression:
   ```bash
   xeokit-convert -s input.ifc -o output.xkt -c
   ```

### Issue: Only Some Models Show
**Symptoms:** Some models work, others don't

**Solutions:**
1. Check which models fail in console
2. Verify those specific XKT files exist
3. Try re-converting the failing models
4. Check file permissions

## Debug Checklist

Run through this checklist:

- [ ] Dev server is running (`npm run dev`)
- [ ] Browser console is open (F12)
- [ ] No red errors in console
- [ ] `Gallery: Loading objects` shows 9 objects
- [ ] Files exist in `public/files/input/` (9 IFC files)
- [ ] Files exist in `public/files/output/` (9 XKT files)
- [ ] `fetch('/files/output/Building-Architecture.xkt')` returns 200
- [ ] localStorage is cleared
- [ ] Page is refreshed after clearing localStorage
- [ ] xeokit-sdk is installed (`npm list @xeokit/xeokit-sdk`)

## Still Not Working?

### Get Detailed Logs

Add this to `src/components/Gallery.jsx` after the imports:

```javascript
console.log('=== GALLERY DEBUG ===');
console.log('initialObjects imported:', initialObjects);
console.log('Number of objects:', initialObjects?.length);
console.log('First object:', initialObjects?.[0]);
```

### Check Package Installation

```bash
npm list @xeokit/xeokit-sdk
```

Should show version 2.6.95 or similar.

### Verify React is Working

Add a simple test in Gallery:

```javascript
return (
    <div className="gallery">
        <h1>TEST: Gallery Component Loaded</h1>
        <p>Objects count: {objects.length}</p>
        <pre>{JSON.stringify(objects[0], null, 2)}</pre>
        {/* rest of component */}
    </div>
);
```

If you see the test message, React is working and it's a data/rendering issue.

## Contact Info

If none of these solutions work:
1. Check browser console for ALL errors
2. Check terminal for server errors
3. Verify all files are in correct locations
4. Try a different browser
5. Check if port 5173 is accessible

## Quick Reset

Nuclear option - reset everything:

```bash
# Stop server
# Delete node_modules
rmdir /s /q node_modules

# Delete package-lock.json
del package-lock.json

# Reinstall
npm install

# Clear browser
# In browser console:
localStorage.clear();
sessionStorage.clear();
location.reload();

# Start server
npm run dev
```
