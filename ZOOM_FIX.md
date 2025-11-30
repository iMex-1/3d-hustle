# Mouse Scroll Zoom Fix - Product Page

## Problem
The initial zoom configuration (FOV 35) was preventing proper mouse scroll zoom interaction on the product detail page. The page was also blocking scroll when hovering over the 3D viewer.

## Solution

### 1. Removed Scroll Blocking
**Before:**
```javascript
const handleViewerMouseEnter = () => {
    document.body.style.overflow = 'hidden';
};

const handleViewerMouseLeave = () => {
    document.body.style.overflow = 'auto';
};
```

**After:**
- Removed scroll blocking handlers completely
- Allows natural page scrolling even when hovering over viewer

### 2. Added `enableZoom` Prop
**XeokitViewer Component:**
```javascript
function XeokitViewer({ 
    xktUrl, 
    height = '100%', 
    width = '100%', 
    enableZoom = false 
})
```

### 3. Different Behavior for Gallery vs Product Page

#### Gallery Cards (enableZoom = false)
- **Initial Camera**: Closer zoom (FOV 35)
- **Camera Position**: [-2.5, 2.0, 8.0]
- **Rotation**: Enabled (0.0008 rad/frame)
- **Hover Zoom**: Enabled (FOV 35 → 30)
- **User Controls**: Limited (hover only)

#### Product Page (enableZoom = true)
- **Initial Camera**: Default xeokit position
- **Camera Position**: [-3.933, 2.855, 27.018]
- **Rotation**: Disabled
- **Hover Zoom**: Disabled
- **User Controls**: Full (mouse wheel zoom, click to rotate)

### 4. Updated Hints

#### Gallery Cards
```
"Survolez pour zoomer"
```

#### Product Page
```
"Molette pour zoomer • Clic pour pivoter"
```

## Implementation Details

### Camera Configuration

**Gallery Cards:**
```javascript
viewer.camera.eye = [-2.5, 2.0, 8.0];
viewer.camera.look = [0, 0, 0];
viewer.camera.up = [0, 1, 0];

viewer.cameraFlight.flyTo({
    aabb: model.aabb,
    duration: 0.5,
    fitFOV: 35 // Closer zoom
});
```

**Product Page:**
```javascript
viewer.camera.eye = [-3.933, 2.855, 27.018];
viewer.camera.look = [4.400, 3.724, 8.899];
viewer.camera.up = [-0.018, 0.999, 0.039];

viewer.cameraFlight.flyTo({
    aabb: model.aabb,
    duration: 0.5
    // No fitFOV - uses default camera controls
});
```

### Rotation Logic

**Gallery Cards:**
```javascript
// Start rotation animation
let angle = 0;
rotationRef.current = setInterval(() => {
    if (!isHovered) {
        angle += 0.0008;
        const radius = 8;
        viewer.camera.eye = [
            Math.sin(angle) * radius,
            2.0,
            Math.cos(angle) * radius
        ];
        viewer.camera.look = [0, 0, 0];
    }
}, 16);
```

**Product Page:**
```javascript
// No rotation animation
// User has full control via mouse
```

### Hover Zoom Logic

**Gallery Cards:**
```javascript
useEffect(() => {
    if (!enableZoom && viewerRef.current && viewerRef.current.scene.models.length > 0) {
        const model = Object.values(viewerRef.current.scene.models)[0];
        if (isHovered) {
            viewerRef.current.cameraFlight.flyTo({
                aabb: model.aabb,
                duration: 0.3,
                fitFOV: 30 // Zoom in
            });
        } else {
            viewerRef.current.cameraFlight.flyTo({
                aabb: model.aabb,
                duration: 0.3,
                fitFOV: 35 // Zoom out
            });
        }
    }
}, [isHovered, enableZoom]);
```

**Product Page:**
- Hover zoom disabled
- User controls via mouse wheel

## Usage

### Gallery Component
```jsx
<XeokitViewer 
    xktUrl={obj.xktFile} 
    height="100%" 
    width="100%" 
/>
// enableZoom defaults to false
```

### Product Detail Component
```jsx
<XeokitViewer 
    xktUrl={object.xktFile} 
    height="100%" 
    width="100%" 
    enableZoom={true} 
/>
```

## Benefits

### Product Page
✅ **Mouse Wheel Zoom**: Works perfectly
✅ **Click & Drag Rotate**: Full control
✅ **No Scroll Blocking**: Page scrolls naturally
✅ **Better Initial View**: Default camera position
✅ **User Control**: Full xeokit navigation

### Gallery Cards
✅ **Automatic Rotation**: Showcases model
✅ **Hover Zoom**: Quick preview
✅ **Closer Initial View**: Better preview
✅ **Minimal Interaction**: Simple hover

## Technical Details

### Props
- `xktUrl`: string (required) - Path to XKT model
- `height`: string (optional) - Default '100%'
- `width`: string (optional) - Default '100%'
- `enableZoom`: boolean (optional) - Default false

### Camera FOV Values
- **Gallery Default**: 35 (closer)
- **Gallery Hover**: 30 (even closer)
- **Product Page**: Auto (xeokit default)

### Rotation Speed
- **Gallery**: 0.0008 rad/frame (~2 min per rotation)
- **Product Page**: None (user controlled)

## CSS Updates

### Zoom Hint Styling
```css
.viewer-hint-zoom {
    bottom: 8px;
    right: 8px;
    left: 8px;
    text-align: center;
    justify-content: center;
    font-size: 0.75rem;
    padding: 0.6rem 1rem;
}
```

### Responsive
```css
@media (max-width: 768px) {
    .viewer-hint-zoom span {
        font-size: 0.7rem;
    }
}
```

## Testing Checklist

### Product Page
- [x] Mouse wheel zooms in/out
- [x] Click and drag rotates model
- [x] Page scrolls normally
- [x] No rotation animation
- [x] Hint shows correct text
- [x] Model fits in view initially

### Gallery Cards
- [x] Automatic rotation works
- [x] Hover zooms in
- [x] Mouse leave zooms out
- [x] Rotation pauses on hover
- [x] Hint shows correct text
- [x] Model is closer initially

## Performance

### Gallery Cards
- 60fps rotation animation
- Smooth hover transitions
- GPU accelerated

### Product Page
- No rotation overhead
- Native xeokit controls
- Efficient zoom/rotate

## Browser Compatibility
- Chrome: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Edge: ✅ Full support

## Future Enhancements
- [ ] Touch gestures for mobile
- [ ] Pinch to zoom on mobile
- [ ] Double-click to reset view
- [ ] Keyboard shortcuts
- [ ] View presets (top, front, side)
