# Skeleton Loading Components Guide

## Overview
The skeleton loading system provides multiple specialized components for showing content placeholders while data is loading. This improves perceived performance and UX.

## Available Components

### 1. **SkeletonLoader** (Basic)
Generic skeleton rows for simple loading states.

```jsx
import { SkeletonLoader } from './LoadingSpinner';

// Basic usage
<SkeletonLoader count={3} type="row" height="20px" />

// Props
- count: number of skeleton items (default: 3)
- type: 'row' | 'card' | 'list' (default: 'row')
- height: CSS height value (default: '20px')
```

### 2. **CardSkeleton**
Perfect for card layouts (e.g., product cards, article cards).

```jsx
import { CardSkeleton } from './LoadingSpinner';

// Show 3 card skeletons
<CardSkeleton count={3} showImage={true} />

// Props
- count: number of skeleton cards (default: 1)
- showImage: show image placeholder (default: true)
```

**Use Cases:**
- Product listings
- Article/blog previews
- Gallery loading
- Team member cards

### 3. **TableSkeleton**
For loading tabular data.

```jsx
import { TableSkeleton } from './LoadingSpinner';

// Show table with 5 rows and 4 columns
<TableSkeleton rows={5} columns={4} />

// Props
- rows: number of skeleton rows (default: 5)
- columns: number of columns (default: 4)
```

**Use Cases:**
- Invoice tables
- Order history
- Admin data tables
- Inventory listings

### 4. **TextSkeleton**
For paragraph/article content loading.

```jsx
import { TextSkeleton } from './LoadingSpinner';

// Show title + 3 lines of text
<TextSkeleton lines={3} showTitle={true} />

// Props
- lines: number of text lines (default: 3)
- showTitle: show title line (default: false)
```

**Use Cases:**
- Article content
- Description text
- Blog posts
- Modal content

### 5. **AvatarSkeleton**
For loading user profile avatars.

```jsx
import { AvatarSkeleton } from './LoadingSpinner';

// Show 3 medium avatars
<AvatarSkeleton count={3} size="md" />

// Props
- count: number of avatars (default: 1)
- size: 'sm' | 'md' | 'lg' (default: 'md')
```

**Use Cases:**
- User profile images
- Team member photos
- Comment author avatars

### 6. **ListSkeleton**
For loading list items with avatar + text (comments, notifications, etc.).

```jsx
import { ListSkeleton } from './LoadingSpinner';

// Show 3 list items with avatars
<ListSkeleton count={3} showAvatar={true} />

// Props
- count: number of items (default: 3)
- showAvatar: show avatar placeholder (default: true)
```

**Use Cases:**
- Comment sections
- Notification lists
- User lists
- Activity feeds

## Real-World Examples

### Example 1: Invoice List Loading
```jsx
import { useState, useEffect } from 'react';
import { TableSkeleton } from './components/LoadingSpinner';

function InvoicesList() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/invoices');
        const data = await res.json();
        setInvoices(data);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  if (loading) {
    return <TableSkeleton rows={5} columns={4} />;
  }

  return (
    <table>
      {/* Render actual invoices */}
    </table>
  );
}
```

### Example 2: Card Grid Loading
```jsx
import { CardSkeleton } from './components/LoadingSpinner';

function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts().finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <CardSkeleton count={6} showImage={true} />;
  }

  return (
    <div className="product-grid">
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
```

### Example 3: Comments Section Loading
```jsx
import { ListSkeleton } from './components/LoadingSpinner';

function CommentSection() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComments().finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <ListSkeleton count={4} showAvatar={true} />;
  }

  return (
    <div className="comments">
      {comments.map(c => <Comment key={c.id} comment={c} />)}
    </div>
  );
}
```

## Styling & Customization

All skeletons use a consistent gradient animation. To customize:

### Change Animation Speed
```css
.skeleton-item {
  animation: skeleton-loading 2s infinite; /* Change 1.5s to 2s */
}
```

### Change Gradient Colors
```css
.skeleton-item {
  background: linear-gradient(
    90deg,
    #e0e0e0 25%,
    #d0d0d0 50%,
    #e0e0e0 75%
  );
}
```

### Add Rounded Corners
```css
.skeleton-item {
  border-radius: 8px; /* Increase border-radius */
}
```

## Best Practices

1. **Use appropriate skeleton for content type**
   - Cards for grid layouts
   - Tables for tabular data
   - Lists for feed-style content
   - Text for paragraphs

2. **Show correct number of items**
   - Match actual content count when possible
   - Use same layout structure as real content

3. **Consistent animation timing**
   - Keep animations smooth (1.5s-2s)
   - Don't make it too fast (looks janky) or slow (feels stuck)

4. **Combine with existing loaders**
   - Use `PageLoader` for full-page loads
   - Use skeletons for partial/incremental loads
   - Use `LoadingSpinner` for small operations

5. **Responsive design**
   - Ensure skeletons adapt to mobile (cards grid changes)
   - Test on different screen sizes

## Migration Checklist

Use this when replacing old loading states:

- [ ] Replace plain text "Loading..." with skeleton
- [ ] Match skeleton count to actual content
- [ ] Use appropriate skeleton type
- [ ] Test on mobile
- [ ] Verify animation timing
- [ ] Check dark mode appearance (if applicable)

## Dark Mode Support

Skeletons automatically adapt to dark mode via CSS media queries. Add this if customizing:

```css
@media (prefers-color-scheme: dark) {
  .skeleton-item {
    background: linear-gradient(
      90deg,
      #374151 25%,
      #4b5563 50%,
      #374151 75%
    );
  }
}
```

## Performance Notes

- Skeletons have minimal performance impact
- GPU-accelerated animations
- No JS performance cost
- Use CSS animations (not JavaScript)

## Troubleshooting

**Animation looks choppy:**
- Reduce animation speed (increase duration)
- Check browser performance

**Skeleton doesn't fill width:**
- Add `width: 100%` to container
- Check parent container constraints

**Animation doesn't loop:**
- Ensure CSS is loaded
- Check for CSS conflicts
- Verify `animation: skeleton-loading` is applied

