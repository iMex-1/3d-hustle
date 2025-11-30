# Theme & Animations Update

## Professional Monochrome Color Palette

### Dark Theme
- **Background**: #0a0a0a (pure black)
- **Surface**: #1a1a1a (dark gray)
- **Elevated Surface**: #2a2a2a
- **Hover Surface**: #333333
- **Text Primary**: #ffffff (white)
- **Text Secondary**: #999999 (mid gray)
- **Borders**: #2a2a2a
- **Accents**: #ffffff

### Light Theme
- **Background**: #ffffff (pure white)
- **Surface**: #f5f5f5 (light gray)
- **Elevated Surface**: #ffffff
- **Hover Surface**: #f5f5f5
- **Text Primary**: #1a1a1a (near black)
- **Text Secondary**: #666666 (dark gray)
- **Borders**: #e5e5e5
- **Accents**: #1a1a1a

## Framer Motion Animations (Mobile Optimized)

### Homepage Animations
1. **Featured Cards**
   - Fade in from bottom with stagger effect
   - Viewport detection (only animates when visible)
   - Hover lift effect (-8px translateY)
   - Optimized with `viewport={{ once: true }}`

2. **Hero Slide Buttons**
   - Horizontal slide on hover (4px translateX)
   - Scale down on tap (0.95)
   - Arrow icon animates independently

3. **Navigation Dots**
   - Scale up on hover (1.3x)
   - Scale down on tap (0.9x)
   - Smooth transitions

4. **View Details Button**
   - Scale up on hover (1.05x)
   - Scale down on tap (0.95x)

### Navigation Animations
1. **Nav Bar**
   - Slides down from top on mount
   - Smooth theme transitions

2. **Brand Logo**
   - Scale up on hover (1.05x)
   - Scale down on tap (0.95x)

3. **Theme Toggle**
   - Scale up on hover (1.1x)
   - Scale down on tap (0.9x)
   - Icon rotates on hover

### Page Transitions
- Fade in/out with vertical slide
- 0.3s duration
- AnimatePresence for smooth unmounting

## Performance Optimizations

### Mobile-Specific (≤768px)
1. **Disabled Heavy Animations**
   - Title glow animation disabled
   - Badge fade animation disabled
   - Overlay pulse disabled
   - Simple fade-in only

2. **Reduced Animation Complexity**
   - Background zoom reduced from 12s to 8s
   - Simplified transforms
   - `will-change: auto` on mobile

3. **GPU Acceleration**
   - `translateZ(0)` for hardware acceleration
   - `backface-visibility: hidden`
   - `perspective: 1000`

### Smooth Theme Transitions
All elements have 0.3s ease transitions for:
- `background-color`
- `color`
- `border-color`

### Viewport Optimization
- Featured cards use `whileInView` with `once: true`
- Only animates when scrolled into view
- Prevents unnecessary re-renders

## CSS Transitions

### Global Transitions
```css
transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
```

Applied to:
- Body
- Navigation
- All surfaces
- Cards
- Buttons
- Form elements
- Scrollbars

### Hover States
All interactive elements have smooth hover transitions:
- Buttons: 0.3s ease
- Links: 0.3s cubic-bezier
- Cards: 0.35s cubic-bezier

## Browser Compatibility

### Scrollbar Styling
- Custom scrollbar for both themes
- Smooth color transitions
- Works in Webkit browsers

### Backdrop Filter
- Navigation uses backdrop blur
- Fallback for unsupported browsers

## Accessibility

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### ARIA Labels
- Navigation dots have descriptive labels
- Theme toggle has aria-label
- All interactive elements are keyboard accessible

## Performance Metrics

### Target Performance
- **Desktop**: 60fps constant
- **Mobile**: 60fps with reduced animations
- **Theme Switch**: < 300ms
- **Page Transition**: 300ms
- **Card Animation**: 400ms with stagger

### Optimization Techniques
1. CSS `will-change` for animated properties
2. GPU-accelerated transforms
3. Viewport-based animation triggers
4. Reduced animation complexity on mobile
5. Debounced scroll events
6. Hardware acceleration hints

## File Changes

### Modified Files
1. `src/App.jsx` - Added page transitions
2. `src/components/Homepage.jsx` - Added Framer Motion animations
3. `src/components/Navigation.jsx` - Already had animations
4. `src/styles/theme.css` - Updated color palette & transitions
5. `src/styles/main.css` - Updated body & scrollbar styles
6. `src/styles/navigation.css` - Updated all navigation colors
7. `src/styles/homepage.css` - Added mobile optimizations

### Key Features
- ✅ Professional monochrome design
- ✅ Smooth theme switching
- ✅ Mobile-optimized animations
- ✅ 60fps performance target
- ✅ Accessibility compliant
- ✅ Framer Motion integration
- ✅ GPU acceleration
- ✅ Reduced motion support
