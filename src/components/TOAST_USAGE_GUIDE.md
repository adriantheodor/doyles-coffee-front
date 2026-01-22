# Toast Notifications Guide

## Overview
The Toast notification system provides elegant, non-intrusive notifications for user feedback. It includes four notification types (success, error, warning, info), auto-dismiss functionality, and optional action buttons.

## Quick Start

### Basic Usage
```jsx
import useToast from './hooks/useToast';

function MyComponent() {
  const toast = useToast();

  return (
    <button onClick={() => toast.success('Operation successful!')}>
      Show Toast
    </button>
  );
}
```

## Toast Types

### 1. Success Toast
```jsx
const toast = useToast();

// Simple success
toast.success('Operation completed!');

// Custom duration (in ms)
toast.success('Saved successfully!', 3000);

// Persistent (no auto-dismiss)
toast.success('Profile updated', 0);
```

**Use Cases:**
- Form submission success
- File upload complete
- Account changes saved
- Action completed

### 2. Error Toast
```jsx
const toast = useToast();

// Simple error
toast.error('Something went wrong');

// Custom duration (default: 5000ms)
toast.error('Failed to load data', 5000);
```

**Use Cases:**
- API request failure
- Form validation errors
- Permission denied
- Network errors

### 3. Warning Toast
```jsx
const toast = useToast();

// Simple warning
toast.warning('Are you sure?');

// Custom duration
toast.warning('Changes will be lost', 4000);
```

**Use Cases:**
- Confirm destructive action
- Data loss warning
- Authentication expiring
- Disk space low

### 4. Info Toast
```jsx
const toast = useToast();

// Simple info
toast.info('Just letting you know');

// Custom duration
toast.info('New features available', 6000);
```

**Use Cases:**
- General notifications
- Tips and hints
- Status updates
- Changelog announcements

## Advanced Usage

### Toast with Action Button
```jsx
const toast = useToast();

const undoAction = () => {
  console.log('Undo clicked!');
  // Implement undo logic
};

// Add action button
toast.addToast({
  message: 'Item deleted',
  type: 'success',
  duration: 4000,
  action: undoAction,
  actionLabel: 'Undo',
});
```

### Persistent Toast (No Auto-Dismiss)
```jsx
const toast = useToast();

// Stays until user closes it
toast.persistent('Please review this important message', 'warning');
```

### Custom Toast Configuration
```jsx
const toast = useToast();

toast.addToast({
  message: 'Custom configured toast',
  type: 'info',
  duration: 3000,
  action: () => console.log('Action clicked'),
  actionLabel: 'Learn More',
});
```

## Real-World Examples

### Example 1: Form Submission
```jsx
import useToast from '../hooks/useToast';

function MyForm() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Submission failed');

      toast.success('Form submitted successfully!');
      // Reset form
    } catch (error) {
      toast.error(error.message || 'Failed to submit form');
    } finally {
      setIsLoading(false);
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Example 2: Delete with Undo
```jsx
import useToast from '../hooks/useToast';

function ItemList() {
  const toast = useToast();
  const [items, setItems] = useState([...]);

  const handleDelete = (id) => {
    const item = items.find(i => i.id === id);
    const newItems = items.filter(i => i.id !== id);
    
    setItems(newItems);

    toast.addToast({
      message: `"${item.name}" deleted`,
      type: 'success',
      duration: 5000,
      action: () => {
        setItems([...items]); // Restore
        toast.info('Item restored');
      },
      actionLabel: 'Undo',
    });
  };

  return <div>{/* Render items */}</div>;
}
```

### Example 3: API Error Handling
```jsx
import useToast from '../hooks/useToast';

function DataComponent() {
  const toast = useToast();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/data');
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message);
        }
        setData(await res.json());
      } catch (error) {
        console.error('Failed to load:', error);
        toast.error(
          error.message || 'Failed to load data. Please try again.'
        );
      }
    };

    fetchData();
  }, [toast]);

  return <div>{/* Render data */}</div>;
}
```

### Example 4: Async Operation with Loading
```jsx
import useToast from '../hooks/useToast';

function UploadComponent() {
  const toast = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (file) => {
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      toast.success(`${file.name} uploaded successfully!`);
    } catch (error) {
      toast.error(`Failed to upload: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <input
      type="file"
      onChange={(e) => handleUpload(e.target.files[0])}
      disabled={isUploading}
    />
  );
}
```

## API Reference

### useToast Hook
```jsx
const toast = useToast();

// Convenience methods (recommended)
toast.success(message, duration?)
toast.error(message, duration?)
toast.warning(message, duration?)
toast.info(message, duration?)
toast.persistent(message, type?)

// Advanced method
toast.addToast({
  message: string,           // required
  type: 'success' | 'error' | 'warning' | 'info',
  duration: number,          // ms, default varies by type, 0 = no auto-dismiss
  action?: function,         // optional callback
  actionLabel?: string,      // button text (default: 'Undo')
})

// Utilities
toast.removeToast(id)        // Remove specific toast
toast.clearAllToasts()       // Clear all toasts
toast.toasts                 // Array of current toasts
```

### Default Durations
- **success**: 4000ms (4 seconds)
- **error**: 5000ms (5 seconds)
- **warning**: 4000ms (4 seconds)
- **info**: 4000ms (4 seconds)

## Styling & Customization

### Toast Colors

| Type | Background | Border | Icon |
|------|-----------|--------|------|
| Success | Light green (`#f0fdf4`) | Green (`#10b981`) | ✓ |
| Error | Light red (`#fef2f2`) | Red (`#ef4444`) | ✕ |
| Warning | Light yellow (`#fffbeb`) | Amber (`#f59e0b`) | ⚠ |
| Info | Light blue (`#eff6ff`) | Blue (`#3b82f6`) | ⓘ |

### Customizing Appearance
Edit [ToastContainer.css](./ToastContainer.css):

```css
/* Change toast colors */
.toast.toast-success {
  background: #your-color;
  border-left-color: #your-border;
}

/* Customize animation speed */
@keyframes toast-slide-in {
  from {
    animation-duration: 0.5s; /* Change from 0.3s */
  }
}

/* Change max width */
.toast-container {
  max-width: 500px; /* Change from 420px */
}
```

### Dark Mode
Toasts automatically adapt to dark mode. Styles are defined in the CSS file under `@media (prefers-color-scheme: dark)`.

## Positioning

By default, toasts appear in the **bottom-right** corner. To change:

```jsx
<ToastContainer
  toasts={toast.toasts}
  onRemove={toast.removeToast}
  onAction={onAction}
  position="top-right"  // Options: bottom-right, bottom-left, top-right, top-left, top-center, bottom-center
/>
```

## Best Practices

1. **Use appropriate type**
   - ✅ `success` for completed actions
   - ✅ `error` for failures
   - ✅ `warning` for confirmations/cautions
   - ✅ `info` for general notifications

2. **Keep messages concise**
   - ✅ "Saved successfully!"
   - ❌ "Your profile has been updated in our database and all changes have been synchronized across servers"

3. **Use action buttons sparingly**
   - Good for: undo, retry, learn more
   - Bad for: primary actions (use buttons instead)

4. **Respect user preferences**
   - Respects `prefers-reduced-motion` (no animation)
   - Accessible keyboard navigation
   - ARIA labels for screen readers

5. **Avoid toast spam**
   - Don't show multiple toasts for same action
   - Clear similar toasts before showing new ones
   - Use `clearAllToasts()` if needed

6. **Error handling**
   ```jsx
   catch (error) {
     // Extract meaningful message
     const message = error.response?.data?.message 
       || error.message 
       || 'An error occurred';
     toast.error(message);
   }
   ```

## Troubleshooting

**Toast not showing?**
- Check that `ToastProvider` wraps your app in `App.js`
- Verify `ToastContainer` is rendered
- Check z-index conflicts (change in CSS)

**Toast too slow?**
- Reduce animation duration in CSS
- Adjust toast-slide-in/fade-out keyframes

**Can't interact with toast?**
- Ensure `.toast` has `pointer-events: auto` (it does by default)
- Check that no overlays block it

**Toast hidden behind other content?**
- Increase z-index in `.toast-container` (currently 10000)
- Check parent container's `position` property

**Button callback not firing?**
- Ensure action function is passed to `addToast`
- Verify `onAction` prop is passed to `ToastContainer`

