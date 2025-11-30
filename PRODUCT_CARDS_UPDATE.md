# Product Cards - Luxurious Minimalist Design

## Overview
Complete redesign of product cards with luxurious, minimalist aesthetics, animated 3D models, and performance-optimized interactions.

## Card Design Features

### Luxurious Minimalist Styling

#### Dark Theme
- **Background**: Pure black (#0a0a0a) with subtle gradient
- **Border**: Dark gray (#1a1a1a) with glow on hover
- **Shadow**: Deep shadows (0 4px 20px rgba(0,0,0,0.5))
- **Hover Shadow**: Enhanced depth (0 20px 40px rgba(0,0,0,0.7))
- **Top Border**: Subtle white gradient line on hover

#### Light Theme
- **Background**: Pure white (#ffffff)
- **Border**: Light gray (#e5e5e5)
- **Shadow**: Soft shadows (0 4px 20px rgba(0,0,0,0.08))
- **Hover Shadow**: Enhanced (0 20px 40px rgba(0,0,0,0.15))

### Card Dimensions
- **Grid**: Auto-fill with minimum 280px width
- **Gap**: 2rem between cards
- **Image Height**: 240px (increased for better 3D view)
- **Border Radius**: 12px (modern, soft corners)

### Hover Effects
1. **Lift**: translateY(-8px)
2. **Scale**: 1.02x growth
3. **Shadow**: Dramatic depth increase
4. **Border**: Color intensifies
5. **Top Line**: White gradient appears
6. **3D Model**: Zooms in (FOV 35 → 30)

## 3D Model Animations

### Initial State
- **Camera Position**: Closer zoom (FOV 35 vs previous 45)
- **Eye Position**: [-2.5, 2.0, 8.0] (optimized for better view)
- **Look At**: [0, 0, 0] (centered)
- **Rotation**: Automatic slow rotation (0.003 rad/frame)

### Rotation Animation
```javascript
// Continuous 360° rotation at ~60fps
angle += 0.003;
camera.eye = [
  Math.sin(angle) * radius,
  2.0,
  Math.cos(angle) * radius
];
```

### Hover Zoom Effect
- **Default FOV**: 35 (closer than before)
- **Hover FOV**: 30 (zooms in further)
- **Transition**: 0.3s smooth camera flight
- **Rotation**: Pauses during hover for better inspection

### Interactive Hint
- **Position**: Bottom right corner
- **Content**: Icon + "Survolez pour zoomer"
- **Animation**: Fades in and slides up on hover
- **Styling**: Glassmorphic with backdrop blur

## Card Content Layout

### Title Section
- **Font Size**: 1.1rem
- **Weight**: 600 (semi-bold)
- **Color**: White (dark) / Black (light)
- **Letter Spacing**: -0.01em (tight, modern)
- **Line Height**: 1.3

### Badge
- **Style**: Minimal pill with subtle background
- **Background**: rgba(255,255,255,0.05) with border
- **Font**: 0.7rem, uppercase, 0.5px letter-spacing
- **Hover**: Background intensifies

### Description
- **Font Size**: 0.85rem
- **Color**: #999999 (dark) / #666666 (light)
- **Line Clamp**: 2 lines with ellipsis
- **Line Height**: 1.5

### Metadata Section
- **Layout**: Flex row with 1rem gap
- **Border Top**: Subtle divider line
- **Icons**: 14x14px with SVG stroke
- **Font Size**: 0.75rem
- **Color**: #666666 with opacity transition

#### Metadata Items
1. **File Size**: Cube icon + size
2. **Downloads**: Download icon + count

### Button (Overlay)
- **Background**: Black (#1a1a1a) with white text
- **Border**: 1px solid white (dark) / black (light)
- **Style**: Uppercase, 0.85rem, 1px letter-spacing
- **Padding**: 0.75rem 2rem
- **Hover**: Scale 1.05x
- **Tap**: Scale 0.95x

## Framer Motion Animations

### Card Entry Animation
```jsx
initial={{ opacity: 0, y: 30, scale: 0.95 }}
animate={{ opacity: 1, y: 0, scale: 1 }}
transition={{ duration: 0.4, delay: index * 0.05 }}
```

### Card Hover Animation
```jsx
whileHover={{ 
  y: -8, 
  scale: 1.02,
  transition: { duration: 0.3 } 
}}
```

### Card Tap Animation
```jsx
whileTap={{ scale: 0.98 }}
```

### Button Animations
```jsx
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}
```

## Performance Optimizations

### GPU Acceleration
- `will-change: transform` on cards
- `transform: translateZ(0)` for hardware acceleration
- `backface-visibility: hidden` on canvas

### Efficient Animations
- Only transform and opacity (GPU accelerated)
- No layout-triggering properties
- Cubic-bezier easing for smooth motion
- 60fps rotation with requestAnimationFrame equivalent

### 3D Model Optimization
- **Rotation**: Pauses on hover (saves GPU)
- **Camera Flight**: Smooth 0.3s transitions
- **Cleanup**: Proper interval clearing on unmount
- **Canvas**: Unique IDs to prevent conflicts

### Lazy Loading
- Models load on demand
- Staggered card animations (0.05s delay)
- Viewport-based rendering ready

## Responsive Design

### Desktop (>768px)
- Grid: auto-fill minmax(280px, 1fr)
- Image Height: 240px
- Full animations enabled

### Tablet (≤768px)
- Grid: auto-fill minmax(240px, 1fr)
- Image Height: 200px
- Gap: 1.5rem
- Reduced padding

### Mobile (≤480px)
- Grid: Single column (1fr)
- Image Height: 220px
- Optimized touch interactions
- Simplified animations

## Theme Transitions

### Smooth Color Transitions
All elements transition smoothly (0.3s ease):
- Background colors
- Border colors
- Text colors
- Shadow colors
- Icon opacity

### Theme-Aware Elements
- Card backgrounds
- Borders
- Text colors
- Shadows
- Overlays
- Badges
- Metadata

## Accessibility

### Interactive Elements
- Proper hover states
- Clear visual feedback
- Keyboard accessible
- Touch-friendly (48px+ tap targets)

### Visual Hierarchy
- Clear title prominence
- Readable metadata
- Sufficient contrast ratios
- Consistent spacing

### Motion
- Respects `prefers-reduced-motion`
- Smooth, not jarring
- Clear purpose for each animation

## Browser Compatibility

### Modern Features
- CSS Grid with fallbacks
- Transform 3D with prefixes
- Backdrop filter with fallback
- Custom properties with defaults

### Performance
- Hardware acceleration where supported
- Graceful degradation
- Optimized for 60fps
- Efficient memory usage

## Key Improvements

✅ **Luxurious Design**: Black/white minimalism with premium feel
✅ **Animated 3D Models**: Continuous rotation with hover zoom
✅ **Better Initial Zoom**: Models start closer (FOV 35)
✅ **Interactive Hover**: Zoom effect on hover (FOV 30)
✅ **Performance**: 60fps animations, GPU accelerated
✅ **Smooth Transitions**: All interactions feel premium
✅ **Modern Layout**: Larger cards (280px min) with better spacing
✅ **Rich Metadata**: Icons + file size + downloads
✅ **Theme Support**: Perfect in both light and dark modes
✅ **Responsive**: Optimized for all screen sizes
✅ **Accessible**: Keyboard and screen reader friendly

## Technical Details

### 3D Model Camera Settings
- **Initial Eye**: [-2.5, 2.0, 8.0]
- **Look At**: [0, 0, 0]
- **Up Vector**: [0, 1, 0]
- **Rotation Radius**: 8 units
- **Rotation Speed**: 0.003 rad/frame (~0.17°/frame)
- **Full Rotation**: ~2094 frames (~35 seconds at 60fps)

### Animation Timing
- **Card Entry**: 0.4s with stagger
- **Card Hover**: 0.3s
- **Button Hover**: 0.3s
- **Camera Flight**: 0.3s
- **Overlay Fade**: 0.4s
- **Theme Transition**: 0.3s

### Z-Index Layers
1. Base card: 0
2. Card content: 1
3. Overlay: 2
4. Viewer hint: 10
5. Button: auto (within overlay)

## Future Enhancements

### Potential Additions
- [ ] Skeleton loading states
- [ ] Image lazy loading
- [ ] Virtual scrolling for large lists
- [ ] Advanced filtering animations
- [ ] Card flip animations
- [ ] Wishlist/favorite functionality
- [ ] Quick view modal
- [ ] Comparison mode
