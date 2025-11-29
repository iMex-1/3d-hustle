# Dark Theme Quick Reference

## 🎨 Color Variables

### Background Colors
```css
--color-background-dark: #121212    /* Main page background */
--color-surface: #1E1E1E            /* Cards, panels, modals */
--color-surface-elevated: #2A2A2A   /* Elevated surfaces */
--color-surface-hover: #252525      /* Hover states */
--color-viewport-bg: #0A0A0A        /* 3D model viewer */
```

### Text Colors
```css
--color-on-background: #E0E0E0           /* Primary text */
--color-on-surface-secondary: #A0A0A0    /* Secondary text */
```

### Accent Colors
```css
--color-primary: #BB86FC           /* Main accent */
--color-primary-hover: #D4A5FF     /* Hover state */
--color-secondary: #03DAC6         /* Secondary accent */
--color-error: #CF6679             /* Errors */
--color-border: #3A3A3A            /* Borders */
```

## 🔧 Common Patterns

### Card Component
```css
.my-card {
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    color: var(--color-on-background);
}
```

### Button Component
```css
.my-button {
    background-color: var(--color-primary);
    color: var(--color-background-dark);
    border-radius: var(--radius-md);
}

.my-button:hover {
    background-color: var(--color-primary-hover);
}
```

### Input Field
```css
.my-input {
    background-color: var(--color-background-dark);
    border: 1px solid var(--color-border);
    color: var(--color-on-background);
}

.my-input:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(187, 134, 252, 0.2);
}

.my-input::placeholder {
    color: var(--color-on-surface-secondary);
}
```

### 3D Viewport
```css
.viewport {
    background-color: var(--color-viewport-bg);
    border: 1px solid var(--color-border);
}
```

## 📏 Spacing & Sizing

### Border Radius
```css
--radius-sm: 6px
--radius-md: 8px
--radius-lg: 12px
--radius-xl: 16px
--radius-full: 9999px
```

### Shadows
```css
--shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.4)
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.5)
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.6)
--shadow-xl: 0 12px 32px rgba(0, 0, 0, 0.7)
```

### Transitions
```css
--transition-fast: 0.15s cubic-bezier(0.4, 0, 0.2, 1)
--transition-normal: 0.3s cubic-bezier(0.4, 0, 0.2, 1)
--transition-slow: 0.5s cubic-bezier(0.4, 0, 0.2, 1)
```

## 🎯 Utility Classes

### Pre-built Components
```html
<!-- Buttons -->
<button class="btn-primary">Primary</button>
<button class="btn-secondary">Secondary</button>
<button class="btn-accent">Accent</button>

<!-- Surfaces -->
<div class="surface">Basic surface</div>
<div class="surface-elevated">Elevated surface</div>

<!-- Cards -->
<div class="card">Card content</div>

<!-- Tabs -->
<div class="tab-bar">
    <button class="tab active">Active Tab</button>
    <button class="tab">Inactive Tab</button>
</div>

<!-- Badges -->
<span class="badge badge-primary">Primary</span>
<span class="badge badge-secondary">Secondary</span>
```

### Text Utilities
```html
<p class="text-primary">Primary colored text</p>
<p class="text-secondary">Secondary colored text</p>
<p class="text-error">Error colored text</p>
```

### Background Utilities
```html
<div class="bg-surface">Surface background</div>
<div class="bg-elevated">Elevated background</div>
```

## ⚡ Quick Tips

1. **Always use CSS variables** instead of hardcoded colors
2. **Include fallback values** for older browsers: `var(--color-primary, #BB86FC)`
3. **Use semantic naming** - describe purpose, not appearance
4. **Test contrast ratios** for accessibility
5. **Maintain consistency** across all components

## 🔍 Finding Colors to Replace

When updating existing code:
- Replace `#fff` or `white` → `var(--color-surface)`
- Replace `#333` → `var(--color-on-background)`
- Replace `#666` → `var(--color-on-surface-secondary)`
- Replace `#f5f5f5` → `var(--color-viewport-bg)` or `var(--color-surface-hover)`
- Replace `#e5e7eb` → `var(--color-border)`

## 📱 Responsive Considerations

The dark theme works seamlessly with responsive design:
- All color variables work at any screen size
- Shadows and borders scale appropriately
- Mobile menus maintain dark theme
- Touch targets remain accessible

## ✅ Checklist for New Components

- [ ] Use `var(--color-surface)` for backgrounds
- [ ] Use `var(--color-on-background)` for primary text
- [ ] Use `var(--color-on-surface-secondary)` for secondary text
- [ ] Use `var(--color-border)` for borders
- [ ] Use `var(--color-primary)` for interactive elements
- [ ] Add hover states with `var(--color-primary-hover)`
- [ ] Include focus states with primary color
- [ ] Test contrast ratios
- [ ] Verify in dark environment
