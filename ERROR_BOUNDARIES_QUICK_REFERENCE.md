# Error Boundaries - Quick Reference

## Installation & Setup

Already set up! Just use as needed.

## Component Imports

```jsx
// Main error boundary (app-level)
import ErrorBoundary from './components/ErrorBoundary';

// Specialized boundaries
import {
  LocalErrorBoundary,
  AsyncErrorBoundary,
  FormErrorBoundary,
} from './components/SpecializedErrorBoundaries';
```

## Quick Usage Patterns

### 1. App-Level (Already Done)

```jsx
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### 2. Component-Level

```jsx
<LocalErrorBoundary>
  <FeatureComponent />
</LocalErrorBoundary>
```

**When to use:**
- Dashboard widgets
- Card components
- Feature sections
- Non-critical UI elements

### 3. Async/Data Fetching

```jsx
<AsyncErrorBoundary onRetry={fetchData}>
  <DataDisplay />
</AsyncErrorBoundary>
```

**When to use:**
- API calls
- Data fetching
- Server operations
- Network-dependent features

### 4. Forms

```jsx
<FormErrorBoundary>
  <MyForm />
</FormErrorBoundary>
```

**When to use:**
- Form submission
- Validation errors
- Field-level errors
- User input processing

## Props Reference

### ErrorBoundary

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | required | Components to wrap |
| `onError` | Function | null | Callback on error: `(error, errorInfo, errorId)` |
| `fallback` | Function | null | Custom error UI: `(error, errorInfo, resetError)` |

### LocalErrorBoundary

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | required | Components to wrap |
| `onError` | Function | null | Error callback: `(error, errorInfo)` |

### AsyncErrorBoundary

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | required | Components to wrap |
| `onError` | Function | null | Error callback: `(error, errorInfo)` |
| `onRetry` | Function | null | Retry logic: `async () => {...}` |

### FormErrorBoundary

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | required | Components to wrap |
| `onError` | Function | null | Error callback: `(error, errorInfo, fieldErrors)` |

## Error ID Format

```
ERROR_1642345678901_a1b2c3d4e5
     └─ timestamp ─┘ └─ random ─┘
```

Used for support tracking and debugging.

## Color Scheme

| Component | Color | Hex |
|-----------|-------|-----|
| Primary button | Green | #4caf50 |
| Secondary button | Blue border | #ddd |
| Form error | Red | #d32f2f |
| Local warning | Yellow | #ffc107 |
| Details panel | Dark | #1e1e1e |

## Common Scenarios

### Handle API Error

```jsx
const fetchData = async () => {
  try {
    const res = await fetch('/api/data');
    if (!res.ok) throw new Error('API Error');
    return res.json();
  } catch (error) {
    throw new Error(`Failed to fetch: ${error.message}`);
  }
};

<AsyncErrorBoundary onRetry={fetchData}>
  <DataList />
</AsyncErrorBoundary>
```

### Multiple Components with Isolation

```jsx
<div>
  <LocalErrorBoundary>
    <Widget1 />
  </LocalErrorBoundary>
  
  <LocalErrorBoundary>
    <Widget2 />
  </LocalErrorBoundary>
  
  <LocalErrorBoundary>
    <Widget3 />
  </LocalErrorBoundary>
</div>
```

### Custom Error Handler

```jsx
<ErrorBoundary
  onError={(error, errorInfo, errorId) => {
    // Log to service
    console.error('Error logged:', errorId);
    
    // Send to Sentry
    Sentry.captureException(error, { tags: { errorId } });
    
    // Send to analytics
    analytics.trackError(errorId, error.message);
  }}
>
  <App />
</ErrorBoundary>
```

### Custom Error UI

```jsx
<ErrorBoundary
  fallback={(error, errorInfo, resetError) => (
    <div className="custom-error">
      <h1>Oops! 🎯</h1>
      <p>{error?.message}</p>
      <button onClick={resetError}>Try Again</button>
    </div>
  )}
>
  <App />
</ErrorBoundary>
```

## Testing Error Boundaries

### Create Test Component

```jsx
const TestErrorComponent = () => {
  throw new Error('Test error message');
};

// In app
<LocalErrorBoundary>
  <TestErrorComponent />
</LocalErrorBoundary>
```

### Console Output

Development: Error logged to console with full stack trace
Production: Error ID logged only

## Browser DevTools

Error boundaries work with:
- React DevTools
- Chrome DevTools
- Firefox DevTools
- Browser console

In development, you'll see:
```
❌ Error caught by ErrorBoundary:
Error ID: ERROR_1642345678901_a1b2c3d4e5
Error: [error message]
Component Stack: [stack trace]
```

## Limitations

Error boundaries do NOT catch:
- Event handler errors → Use try/catch
- Promises → Use .catch() or try/await
- Server-side rendering
- Errors in the boundary itself
- setTimeout/setInterval errors

## Keyboard Navigation

| Key | Action |
|-----|--------|
| Tab | Navigate buttons |
| Enter | Click focused button |
| Space | Toggle details (when focused) |

## Accessibility

- ✅ WCAG AA compliant
- ✅ Full keyboard navigation
- ✅ Screen reader friendly
- ✅ High contrast mode support
- ✅ Reduced motion support
- ✅ Focus indicators (2px green)

## Performance

- Minimal overhead (< 1KB gzipped per boundary)
- No impact during normal operation
- Instant error boundary activation
- No re-renders on unmount

## Integration Checklist

- [ ] ErrorBoundary wraps app (done in App.js)
- [ ] Specialized boundaries added to components
- [ ] Error tracking service configured (Sentry/LogRocket)
- [ ] Custom error messages added
- [ ] Tested on mobile devices
- [ ] Dark mode verified
- [ ] Keyboard navigation tested

## Files

| File | Purpose | Size |
|------|---------|------|
| `ErrorBoundary.js` | Main component | 120 lines |
| `ErrorBoundary.css` | Styling | 650+ lines |
| `SpecializedErrorBoundaries.js` | Specialized types | 200 lines |

## Support

For issues:
1. Check browser console for error details
2. Note the Error ID
3. Check component stack
4. Review the ERROR_BOUNDARIES_COMPLETE.md guide

## Links

- Full documentation: `ERROR_BOUNDARIES_COMPLETE.md`
- Component source: `src/components/ErrorBoundary.js`
- Styles source: `src/components/ErrorBoundary.css`
- Specialized types: `src/components/SpecializedErrorBoundaries.js`
