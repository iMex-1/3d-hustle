# Categories & Gallery Page Update

## Categories Page Improvements

### Shrink/Grow Hover Effect
- **Default State**: Cards start at `scale(0.95)` (slightly shrunk)
- **Hover State**: Cards grow to `scale(1.05)` and lift up `-8px`
- **Smooth Animation**: 0.3s ease-out transition
- **Tap Effect**: Scale down to `0.98` on click

### Hidden Button with Reveal Animation
- **Default State**: 
  - `opacity: 0` (invisible)
  - `translateY(10px)` (positioned below)
- **Hover State**:
  - `opacity: 1` (fully visible)
  - `translateY(0)` (slides up to position)
  - Button slides right on hover (`translateX(4px)`)

### Button Styling
- **Dark Mode**: White text (#ffffff) on black background (#1a1a1a)
- **Light Mode**: White text (#ffffff) on black background (#1a1a1a)
- **Hover**: Pure black background (#000000)
- **Style**: Uppercase text, 0.5px letter-spacing, rectangular (4px border-radius)

### Monochrome Color Scheme

#### Dark Theme
- **Card Background**: #1a1a1a
- **Card Border**: #2a2a2a
- **Title**: #ffffff
- **Description**: #999999
- **Icon Background**: rgba(255, 255, 255, 0.05)
- **Icon Color**: #ffffff
- **Button**: #1a1a1a background, #ffffff text

#### Light Theme
- **Card Background**: #f5f5f5
- **Card Border**: #e5e5e5
- **Title**: #1a1a1a
- **Description**: #666666
- **Icon Background**: rgba(0, 0, 0, 0.05)
- **Icon Color**: #1a1a1a
- **Button**: #1a1a1a background, #ffffff text

### Icon Wrapper Animation
- **Default**: Subtle background with transparent border
- **Hover**: 
  - Background intensifies
  - Border appears (white in dark, black in light)
  - Scales to 1.15x
  - Rotates 5 degrees
  - Icon scales to 1.1x with drop shadow

### Card Hover Effects
1. **Scale**: 0.95 → 1.05 (10% growth)
2. **Lift**: translateY(-8px)
3. **Shadow**: Enhanced shadow with depth
4. **Top Border**: Colored line slides in from left
5. **Icon**: Rotates and scales
6. **Button**: Fades in and slides up
7. **Title**: Maintains color (no color change)

## Gallery Page Updates

### Search Input
- **Dark Mode**: #1a1a1a background, #ffffff text
- **Light Mode**: #f5f5f5 background, #1a1a1a text
- **Focus**: White border with subtle shadow
- **Smooth Transitions**: 0.3s ease

### Filter Buttons
- **Default State**:
  - Transparent background
  - Thin border (#2a2a2a dark / #e5e5e5 light)
  - Gray text (#999999 dark / #666666 light)
  - Uppercase, 0.85rem, 0.5px letter-spacing

- **Hover State**:
  - White border (dark) / Black border (light)
  - White text (dark) / Black text (light)
  - Lifts up 2px
  - Shadow appears
  - Shimmer effect slides across

- **Active State**:
  - Black background (#1a1a1a)
  - White text (#ffffff)
  - Black border
  - Shadow

### Gallery Cards
- **Background**: #1a1a1a (dark) / #f5f5f5 (light)
- **Border**: #2a2a2a (dark) / #e5e5e5 (light)
- **Smooth Transitions**: All properties transition smoothly

### Headers
- **Title**: #ffffff (dark) / #1a1a1a (light)
- **Subtitle**: #999999 (dark) / #666666 (light)
- **Smooth Theme Transitions**: 0.3s ease

## Framer Motion Animations

### Category Cards
```jsx
initial={{ opacity: 0, y: 50, scale: 0.95 }}
animate={{ opacity: 1, y: 0, scale: 0.95 }}
whileHover={{ 
  scale: 1.05, 
  y: -8,
  transition: { duration: 0.3, ease: "easeOut" } 
}}
whileTap={{ scale: 0.98 }}
```

### Category Buttons
```jsx
whileHover={{ x: 4 }}
whileTap={{ scale: 0.95 }}
```

## Performance Optimizations

### CSS Transitions
- All transitions use `cubic-bezier` easing for smooth motion
- GPU-accelerated transforms (scale, translateY, translateX)
- No layout-triggering properties in animations

### Hover States
- Opacity and transform only (GPU accelerated)
- No width/height changes
- Smooth 0.3s transitions

### Theme Switching
- All color properties transition smoothly
- 0.3s ease timing
- No jarring color changes

## Accessibility

### Interactive Elements
- All buttons have proper hover states
- Clear visual feedback on interaction
- Keyboard accessible
- Proper contrast ratios maintained

### Motion
- Respects `prefers-reduced-motion`
- Smooth, not jarring animations
- Clear visual hierarchy

## Browser Compatibility
- Works in all modern browsers
- Fallback for older browsers
- GPU acceleration where supported
- Smooth degradation

## Key Features
✅ Cards shrink by default (scale 0.95)
✅ Cards grow on hover (scale 1.05)
✅ Buttons hidden by default
✅ Buttons appear on hover with slide-up animation
✅ White text on black buttons in both themes
✅ Professional monochrome color scheme
✅ Smooth Framer Motion animations
✅ Optimized for 60fps performance
✅ Theme-aware styling throughout
✅ Consistent with overall design system
