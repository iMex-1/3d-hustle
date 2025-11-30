# Product Detail Page Update

## 3D Model Rotation Speed

### Updated Rotation
- **Previous Speed**: 0.003 rad/frame (~35 seconds per rotation)
- **New Speed**: 0.0008 rad/frame (~2 minutes per rotation)
- **Effect**: Very slow, elegant rotation that feels luxurious
- **Calculation**: 2π / 0.0008 / 60fps ≈ 131 seconds (2.2 minutes)

### Rotation Behavior
- Continuous slow rotation when not hovering
- Pauses when hovering for inspection
- Resumes when hover ends
- Smooth 60fps animation

## Product Detail Page Redesign

### Layout Improvements
- **Grid**: 1.2fr (viewer) + 1fr (info) for better proportions
- **Gap**: Increased to 3rem for breathing room
- **Padding**: 2.5rem for spacious feel
- **Max Width**: 1400px (wider for better viewing)

### Monochrome Theme

#### Dark Theme
- **Container Background**: #0a0a0a (pure black)
- **Container Border**: #1a1a1a
- **Shadow**: 0 8px 32px rgba(0,0,0,0.6)
- **Text**: #ffffff (white)
- **Secondary Text**: #999999
- **Spec Items**: rgba(255,255,255,0.02) background

#### Light Theme
- **Container Background**: #ffffff (pure white)
- **Container Border**: #e5e5e5
- **Shadow**: 0 8px 32px rgba(0,0,0,0.1)
- **Text**: #1a1a1a (black)
- **Secondary Text**: #666666
- **Spec Items**: rgba(0,0,0,0.02) background

### 3D Viewer Section
- **Height**: 600px (increased from 500px)
- **Background**: #0a0a0a (dark) / #f5f5f5 (light)
- **Border**: 1px solid with theme colors
- **Border Radius**: 12px
- **Shadow**: Enhanced depth on hover
- **Hover Effect**: Shadow intensifies

### Back Button
- **Style**: Minimal with icon
- **Icon**: Arrow SVG that slides left on hover
- **Border**: 1px solid with theme colors
- **Hover**: Background tint + border color change
- **Animation**: Icon translateX(-4px) on hover

### Title Section
- **Font Size**: 2.5rem (larger, more prominent)
- **Font Weight**: 700 (bold)
- **Letter Spacing**: -0.02em (tight, modern)
- **Line Height**: 1.2
- **Color**: White (dark) / Black (light)

### Category Badge
- **Style**: Minimal pill
- **Background**: rgba(255,255,255,0.05)
- **Border**: 1px solid rgba(255,255,255,0.1)
- **Font**: 0.75rem, uppercase, 600 weight
- **Letter Spacing**: 0.5px
- **Border Radius**: 4px (rectangular, not rounded)

### Description
- **Font Size**: 1rem
- **Color**: #999999 (dark) / #666666 (light)
- **Line Height**: 1.8 (very readable)
- **Margin**: 2rem bottom

### Specifications Grid
- **Layout**: 2 columns
- **Gap**: 1rem
- **Items**: Hover effect with lift

#### Spec Items
- **Padding**: 1.25rem (spacious)
- **Background**: Subtle tint with transparency
- **Border**: 1px solid with low opacity
- **Border Radius**: 8px
- **Hover**: Lifts up 2px, background intensifies

#### Spec Labels
- **Font Size**: 0.85rem
- **Color**: #666666 (dark) / #999999 (light)
- **Style**: Uppercase, 500 weight, 0.5px spacing

#### Spec Values
- **Font Size**: 1.15rem
- **Font Weight**: 600
- **Color**: White (dark) / Black (light)

### Download Section
- **Background**: Subtle tint with transparency
- **Border**: 1px solid with low opacity
- **Border Radius**: 12px
- **Padding**: 2rem

#### Download Button
- **Background**: #1a1a1a (black in both themes)
- **Color**: #ffffff (white text in both themes)
- **Border**: 1px solid #1a1a1a
- **Style**: Uppercase, 1px letter-spacing
- **Icon**: Download SVG icon
- **Padding**: 1rem 2rem
- **Hover**: Background to #000000, lifts 2px
- **Shadow**: 0 4px 12px rgba(0,0,0,0.3)

#### Download Note
- **Layout**: Flex with icon
- **Icon**: Info circle SVG
- **Background**: Subtle tint
- **Border**: 1px solid with low opacity
- **Color**: #999999 (dark) / #666666 (light)
- **Font Size**: 0.85rem

## Framer Motion Animations

### Page Entry
```jsx
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5 }}
```

### Container Entry
```jsx
initial={{ opacity: 0, scale: 0.95 }}
animate={{ opacity: 1, scale: 1 }}
transition={{ duration: 0.5, delay: 0.2 }}
```

### Back Button
```jsx
whileHover={{ x: -4 }}
whileTap={{ scale: 0.95 }}
```

### Download Button
```jsx
whileHover={{ scale: 1.05, y: -2 }}
whileTap={{ scale: 0.95 }}
```

## Responsive Design

### Desktop (>1024px)
- Grid: 1.2fr + 1fr
- Viewer Height: 600px
- Full spacing and padding

### Tablet (≤1024px)
- Grid: Single column (1fr)
- Viewer Height: 500px
- Gap: 2rem

### Mobile (≤768px)
- Padding: 1.5rem
- Viewer Height: 400px
- Spec Grid: Single column
- Title: 2rem

### Small Mobile (≤480px)
- Padding: 1rem
- Viewer Height: 300px
- Title: 1.75rem
- Download Section: 1.5rem padding

## Performance Optimizations

### 3D Viewer
- **Rotation Speed**: Reduced to 0.0008 (very slow)
- **Frame Rate**: 60fps maintained
- **Pause on Hover**: Saves GPU cycles
- **Cleanup**: Proper interval clearing

### Animations
- GPU-accelerated transforms only
- Smooth 0.3s transitions
- No layout-triggering properties
- Efficient cubic-bezier easing

### Theme Transitions
- All colors transition smoothly (0.3s)
- No jarring color changes
- Consistent across all elements

## Accessibility

### Interactive Elements
- Clear hover states
- Keyboard accessible
- Proper focus indicators
- Touch-friendly targets (48px+)

### Visual Hierarchy
- Clear title prominence
- Readable text sizes
- Sufficient contrast ratios
- Logical content flow

### Icons
- SVG icons for clarity
- Proper sizing (16-20px)
- Consistent stroke width (2px)
- Semantic usage

## Key Improvements

✅ **Slower Rotation**: 0.0008 rad/frame (~2 min per rotation)
✅ **Luxurious Feel**: Very slow, elegant movement
✅ **Larger Viewer**: 600px height for better viewing
✅ **Monochrome Theme**: Professional black/white design
✅ **Better Layout**: 1.2fr + 1fr grid proportions
✅ **Enhanced Specs**: Hover effects on spec items
✅ **Modern Button**: Black button with white text
✅ **Icon Integration**: SVG icons throughout
✅ **Smooth Animations**: Framer Motion throughout
✅ **Responsive**: Optimized for all screen sizes
✅ **Theme Support**: Perfect in both light and dark
✅ **Performance**: 60fps with efficient animations

## Technical Details

### Rotation Calculation
```javascript
// Very slow rotation
angle += 0.0008; // rad/frame
// Full rotation time:
// 2π / 0.0008 / 60fps ≈ 131 seconds
```

### Animation Timing
- Page Entry: 0.5s
- Container Entry: 0.5s (0.2s delay)
- Button Hover: 0.3s
- Theme Transition: 0.3s
- Spec Item Hover: 0.3s

### Color Palette
- Pure Black: #0a0a0a
- Dark Gray: #1a1a1a
- Mid Gray: #666666, #999999
- Light Gray: #e5e5e5, #f5f5f5
- Pure White: #ffffff

### Shadow Depths
- Container: 0 8px 32px
- Viewer: 0 4px 20px
- Button: 0 4px 12px
- Hover intensifies all shadows
