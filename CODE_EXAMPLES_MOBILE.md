# Code Examples - Mobile Responsive Patterns

## Common Responsive Patterns Used in Your Project

### Pattern 1: Responsive Container (Used in App.css)

**Before (Not Responsive)**
```css
.page-container {
  padding: 2rem; /* Same on all screen sizes */
}

.page-card {
  padding: 2rem;
}
```

**After (Responsive)**
```css
/* Mobile first - start small */
.page-container {
  padding: 1rem;
  display: flex;
  justify-content: center;
}

.page-card {
  padding: 1.5rem;
  width: 100%;
  max-width: 1200px;
}

/* Scale up on larger screens */
@media (min-width: 768px) {
  .page-container {
    padding: 2rem;
  }
  .page-card {
    padding: 2rem;
  }
}
```

**Why This Works**:
- Mobile devices get less padding (saves space)
- Tablets and desktop get full padding
- Uses `max-width` to prevent overly wide layout
- Flexbox centers the card

---

### Pattern 2: Responsive Grid (Dashboard Cards)

**Before (Breaks on Mobile)**
```css
.dash-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.25rem;
}
```
Problem: On 375px phone, this tries to fit multiple 180px items, causing overflow.

**After (Mobile-First Grid)**
```css
/* Mobile: 1 column */
.dash-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-top: 1.5rem;
}

/* Tablet: 2 columns */
@media (min-width: 576px) {
  .dash-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }
}

/* Desktop: Auto-fit 3+ columns */
@media (min-width: 992px) {
  .dash-grid {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }
}
```

**Why This Works**:
- Stacks vertically on mobile (1 column)
- 2 columns on tablets
- Multiple columns on desktop
- Responsive gap/spacing

---

### Pattern 3: Responsive Typography

**Before (Fixed Size)**
```css
.contact-content h2 {
  font-size: 2.5rem; /* Too large on mobile */
}

.page-title {
  font-size: 1.75rem; /* Too large on mobile */
}
```

**After (Responsive)**
```css
/* Mobile: Smaller text */
.contact-content h2 {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.page-title {
  font-size: 1.5rem;
}

/* Desktop: Larger text */
@media (min-width: 768px) {
  .contact-content h2 {
    font-size: 2.5rem;
  }
  
  .page-title {
    font-size: 1.75rem;
  }
}
```

**Why This Works**:
- Text is readable on small screens
- Uses `rem` units (scalable)
- Progressive enhancement (bigger on desktop)

---

### Pattern 4: Touch-Friendly Buttons

**Before (Too Small to Tap)**
```css
.btn {
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
  border-radius: 6px;
  /* No minimum height! */
}
```

**After (Accessible)**
```css
/* Mobile: Larger touch target */
.btn {
  padding: 0.6rem 1rem;
  font-size: 0.85rem;
  border-radius: 6px;
  min-height: 44px;  /* Apple accessibility standard */
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.2s;
}

/* Desktop: Original sizing */
@media (min-width: 768px) {
  .btn {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
}
```

**Why This Works**:
- 44px × 44px is the minimum touch target (Apple standard)
- Flexbox centers content vertically and horizontally
- Works on both touch and mouse devices

---

### Pattern 5: Responsive Tables

**Before (Overflows on Mobile)**
```css
.styled-table {
  font-size: 0.95rem;
}

.styled-table th,
.styled-table td {
  padding: 0.75rem 1rem; /* Too much on mobile */
}
```

**After (Mobile-Friendly)**
```css
/* Mobile: Smaller table */
.styled-table {
  font-size: 0.85rem;
  overflow-x: auto; /* Allow horizontal scroll */
}

.styled-table th,
.styled-table td {
  padding: 0.5rem 0.75rem; /* Tighter on mobile */
}

/* Desktop: Original sizing */
@media (min-width: 768px) {
  .styled-table {
    font-size: 0.95rem;
  }
  
  .styled-table th,
  .styled-table td {
    padding: 0.75rem 1rem;
  }
}
```

**Why This Works**:
- Smaller font and padding on mobile
- Horizontal scroll if table is too wide
- Larger on desktop for readability

---

### Pattern 6: Responsive Form Inputs

**Before (Not Mobile-Optimized)**
```css
input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  /* Font too small, no minimum height */
}
```

**After (Mobile-Friendly)**
```css
input,
textarea,
select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;  /* Prevents iOS auto-zoom */
  min-height: 44px; /* Touch target */
  box-sizing: border-box;
  transition: border-color 0.2s;
}

/* Focus state for accessibility */
input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: var(--brand-green);
  box-shadow: 0 0 0 3px rgba(58, 120, 66, 0.1);
}
```

**Why This Works**:
- `font-size: 1rem` prevents iOS from zooming on focus
- `min-height: 44px` makes inputs easy to tap
- `box-sizing: border-box` makes width calculations easier
- Focus state provides visual feedback

---

### Pattern 7: Image & Logo Responsiveness

**Before (Fixed Size)**
```css
.main-header-logo {
  width: 250px;
  height: auto;
  margin: 0 auto;
}

.carousel-item {
  height: 60vh; /* Too tall on mobile */
}
```

**After (Responsive)**
```css
/* Mobile: Smaller logo and carousel */
.main-header-logo {
  max-width: 85%;
  width: 180px;
  height: auto;
  display: block;
  margin: 0 auto;
}

.carousel-item {
  height: 40vh;
  background: #f8f9fa;
}

/* Desktop: Larger logo and carousel */
@media (min-width: 768px) {
  .main-header-logo {
    width: 250px;
  }
  
  .carousel-item {
    height: 60vh;
  }
}
```

**Why This Works**:
- Logo scales down on mobile (saves space)
- Carousel height reduced (shows more content)
- `max-width: 85%` ensures logo doesn't touch edges

---

### Pattern 8: Metrics Row (Flex to Grid Conversion)

**Before (Breaks on Mobile)**
```css
.metrics-row {
  display: flex;  /* Doesn't wrap! */
  gap: 1rem;
}

.metric-card {
  flex: 1;  /* Each card 1/4 width even on mobile */
}
```
Problem: 4 cards × 25% each = overflow on small screens

**After (Grid with Breakpoints)**
```css
/* Mobile: Stack vertically */
.metrics-row {
  display: grid;
  grid-template-columns: 1fr;  /* 1 column */
  gap: 1rem;
}

/* Tablet: 2 columns */
@media (min-width: 576px) {
  .metrics-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop: 4 columns */
@media (min-width: 992px) {
  .metrics-row {
    grid-template-columns: repeat(4, 1fr);
  }
}

.metric-card {
  background: white;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
}
```

**Why This Works**:
- Mobile: 1 card per row
- Tablet: 2 cards per row
- Desktop: 4 cards per row
- Much better than flex wrapping

---

### Pattern 9: Padding/Spacing Scale

**Before (Inconsistent)**
```css
.section-box {
  padding: 1rem;  /* What about mobile? */
}

.contact-section {
  padding: 4rem 0;  /* Too much on mobile */
}

.contact-card {
  padding: 2.5rem 2rem;  /* Large on mobile */
}
```

**After (Responsive Spacing)**
```css
/* Mobile: Tighter spacing */
.section-box {
  padding: 1rem;
}

.contact-section {
  padding: 2rem 0;
}

.contact-card {
  padding: 1.5rem 1rem;
}

/* Desktop: Generous spacing */
@media (min-width: 768px) {
  .contact-section {
    padding: 4rem 0;
  }
  
  .contact-card {
    padding: 2.5rem 2rem;
  }
}
```

**Why This Works**:
- Mobile gets minimal spacing (precious screen real estate)
- Desktop gets generous spacing (better visual hierarchy)
- Consistent scaling across breakpoints

---

## Quick Reference Table

| Pattern | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| **Container Padding** | 1rem | - | 2rem |
| **Grid Columns** | 1 | 2 | 4+ |
| **Font Size** | 1.5rem | - | 1.75rem |
| **Button Height** | 44px | 44px | 44px+ |
| **Touch Target** | 44×44px | 44×44px | 44×44px+ |
| **Table Font** | 0.85rem | - | 0.95rem |
| **Logo Width** | 180px | - | 250px |
| **Carousel Height** | 40vh | - | 60vh |

---

## Testing Your Changes

### Method 1: Chrome DevTools (Easiest)
```
1. Open your app in Chrome
2. Press F12 (open DevTools)
3. Press Ctrl+Shift+M (toggle device toolbar)
4. Select different devices from dropdown
5. Resize viewport to test all breakpoints
```

### Method 2: Real Device Testing
```
1. Deploy to staging environment
2. Open on iPhone, iPad, Android
3. Check each page thoroughly
4. Test form submissions
5. Verify touch interactions
```

### Method 3: Responsive Design Checker
```
1. Online tools: responsivedesignchecker.com
2. Upload your site
3. View at different screen sizes
4. Check layout, fonts, images
```

---

## Performance Considerations

### Mobile-First CSS Is Better
```css
/* Good: Mobile styles first, then add for desktop */
.container { padding: 1rem; }
@media (min-width: 768px) { .container { padding: 2rem; } }

/* Worse: Desktop-first, harder to maintain */
.container { padding: 2rem; }
@media (max-width: 768px) { .container { padding: 1rem; } }
```

### Why Mobile-First Wins:
- Mobile CSS loads first (faster)
- Desktop CSS only enhances
- Better for mobile performance

---

## Common Mistakes to Avoid

❌ **Don't do this:**
```css
/* Bad: Fixed widths */
.card { width: 300px; }

/* Bad: Huge padding on mobile */
.container { padding: 2rem; }

/* Bad: Fixed heights on dynamic content */
.box { height: 100px; }
```

✅ **Do this instead:**
```css
/* Good: Flexible width */
.card { width: 100%; max-width: 300px; }

/* Good: Responsive padding */
.container { padding: 1rem; }
@media (min-width: 768px) { .container { padding: 2rem; } }

/* Good: Min-height for touch targets */
.box { min-height: 44px; }
```

---

## Summary

These patterns are now implemented in your codebase:
- ✅ Responsive containers
- ✅ Responsive grids (1 → 2 → 4 columns)
- ✅ Responsive typography
- ✅ Touch-friendly buttons (44px)
- ✅ Mobile-friendly tables
- ✅ Mobile-optimized forms
- ✅ Responsive images
- ✅ Responsive spacing

Test these changes on real devices to ensure they work as expected!

