# Hero Slide Design - Full-Screen Dark Theme

## Design Specifications Implemented

### Layout
- **Full-screen hero slides** (100vh) with dark charcoal background (#0a0a0a)
- **Left-aligned content** positioned in the left third of the screen (8% padding)
- **Full-frame background images** with subtle zoom effect on hover
- **Dark gradient overlay** from left (95% opacity) to right (transparent)

### Typography Hierarchy

#### Labels (Small Thin Sans-Serif)
- Font: System sans-serif stack
- Size: 11px
- Weight: 300 (thin)
- Color: rgba(255, 255, 255, 0.6)
- Letter-spacing: 4px
- Transform: UPPERCASE

#### Titles (Massive Bold Serif)
- Font: Georgia, Times New Roman, Playfair Display (serif)
- Size: Responsive 3.5rem - 7rem (clamp)
- Weight: 700 (bold)
- Color: #ffffff
- Line-height: 0.95 (tight)
- Letter-spacing: -0.02em (tight)

#### Descriptions (Thin Sans-Serif)
- Font: System sans-serif stack
- Size: 0.95rem - 1.1rem
- Weight: 300 (thin)
- Color: rgba(255, 255, 255, 0.75)
- Line-height: 1.8
- Max-width: 500px

### Navigation

#### Vertical Dot Navigation (Right Side)
- Position: Fixed right at 40px from edge
- Orientation: Vertical column
- Dots: 8px circles with 1px white border
- Active state: Filled white circle
- Gap: 20px between dots
- Hover: Scale 1.3x

#### Arrow Navigation (Bottom Left)
- Position: Bottom 60px, left 8%
- Style: Minimal 50px squares with 1px border
- Color: White with transparency
- Hover: Subtle background fill

### Buttons
- Style: Minimal text-only with underline animation
- Font: Uppercase sans-serif, 0.9rem, letter-spacing 1px
- Hover: Underline slides in from left, button shifts right 4px
- Primary: White text
- Secondary: 60% opacity white text

### Color Scheme
- Background: #0a0a0a (black)
- Overlay: Gradient from rgba(10,10,10,0.95) to transparent
- Text: White (#ffffff) with varying opacity
- Accents: Pure white for active states

### Animations
- Content slides up with fade-in (1.2s cubic-bezier)
- Background images zoom slowly on hover (12s ease-out)
- Smooth transitions throughout (0.3-0.4s)

### Responsive Breakpoints
- Desktop: Full implementation
- Tablet (≤1024px): Adjusted padding and font sizes
- Mobile (≤768px): Smaller navigation, adjusted spacing
- Small Mobile (≤480px): Optimized for small screens

## Visual Effect
The design creates a dramatic, editorial magazine-style presentation with:
- High contrast white-on-black typography
- Minimal, sophisticated aesthetic
- Strong typographic hierarchy
- Subtle, elegant interactions
- Full-screen immersive experience
