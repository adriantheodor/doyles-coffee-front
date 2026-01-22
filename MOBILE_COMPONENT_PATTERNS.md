# Mobile Component Patterns

Ready-to-use component patterns following contemporary mobile UX best practices.

## 1. Mobile Form Pattern

**Use Case:** Collecting user input on mobile

```jsx
function MobileForm() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      
      if (!res.ok) throw new Error('Login failed');
      
      toast.success('Logged in successfully!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="mobile-container safe-area-inset-bottom">
      <h1>Sign In</h1>
      
      <form onSubmit={handleSubmit} className="mobile-stack">
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
        
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required
        />
        
        <button type="submit" className="mobile-fullwidth-button">
          Sign In
        </button>
      </form>
    </div>
  );
}
```

**Key Features:**
- ✅ Touch-friendly 48px inputs
- ✅ Full-width button
- ✅ Vertical stack
- ✅ Safe area respected
- ✅ Toast feedback

---

## 2. Mobile Card Grid

**Use Case:** Displaying products, articles, or items in grid

```jsx
function MobileCardGrid() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  return (
    <div className="mobile-container">
      <h1>Products</h1>
      
      {loading ? (
        <div className="mobile-grid">
          {[1,2,3].map(i => (
            <div key={i} className="loading-skeleton" style={{height: '200px'}} />
          ))}
        </div>
      ) : (
        <div className="mobile-grid">
          {items.map(item => (
            <div key={item.id} className="card">
              <img src={item.image} alt={item.name} />
              <h3>{item.name}</h3>
              <p>${item.price}</p>
              <button className="mobile-fullwidth-button">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

**CSS:**
```css
.card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
}

.card img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.card h3 {
  padding: 12px;
  margin: 0;
}

.card button {
  margin: 12px;
  margin-top: auto;
}
```

**Responsive:**
- 1 column on mobile
- 2 columns on tablet (640px+)
- 3 columns on desktop (1024px+)

---

## 3. Bottom Sheet Modal

**Use Case:** Modals, filters, share menus

```jsx
function BottomSheetModal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="bottom-sheet-overlay"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div className="bottom-sheet">
        <div className="bottom-sheet-handle" />
        
        <div style={{ padding: '16px 16px 24px' }}>
          {children}
        </div>
      </div>
    </>
  );
}

// Usage
function FilterDialog() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>
        Filters
      </button>
      
      <BottomSheetModal isOpen={open} onClose={() => setOpen(false)}>
        <h2>Filter Options</h2>
        <label>
          <input type="checkbox" /> In Stock Only
        </label>
        <label>
          <input type="checkbox" /> On Sale
        </label>
        <button 
          className="mobile-fullwidth-button"
          onClick={() => setOpen(false)}
        >
          Apply Filters
        </button>
      </BottomSheetModal>
    </>
  );
}
```

**CSS:**
```css
.bottom-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-radius: 16px 16px 0 0;
  max-height: 85vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  animation: slide-up 0.3s ease-out;
  padding-bottom: max(16px, env(safe-area-inset-bottom));
}
```

---

## 4. Mobile Tab Navigation

**Use Case:** Bottom tab bar for primary navigation

```jsx
function MobileTabNav() {
  const [active, setActive] = useState('home');
  const location = useLocation();

  const tabs = [
    { id: 'home', label: 'Home', icon: '🏠', path: '/home' },
    { id: 'orders', label: 'Orders', icon: '📦', path: '/orders' },
    { id: 'invoices', label: 'Invoices', icon: '📄', path: '/invoices' },
    { id: 'account', label: 'Account', icon: '👤', path: '/account' },
  ];

  return (
    <>
      {/* Main content with bottom padding */}
      <div className="has-mobile-tab-bar">
        {/* Routes render here */}
      </div>

      {/* Bottom tab bar - only on mobile */}
      <nav className="mobile-tab-bar mobile-only">
        {tabs.map(tab => (
          <Link
            key={tab.id}
            to={tab.path}
            className={`mobile-tab-item ${location.pathname === tab.path ? 'active' : ''}`}
          >
            <span className="mobile-tab-icon">{tab.icon}</span>
            <span>{tab.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
```

**CSS:**
```css
.mobile-tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #e5e7eb;
  display: flex;
  z-index: 100;
}

.mobile-tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-height: 56px;
  color: #6b7280;
  text-decoration: none;
  border: none;
  background: none;
  cursor: pointer;
}

.mobile-tab-item.active {
  color: var(--brand-green);
}

@media (min-width: 768px) {
  .mobile-tab-bar {
    display: none;
  }
}
```

---

## 5. Mobile List with Actions

**Use Case:** Orders, invoices, history lists

```jsx
function MobileListWithActions() {
  const [items, setItems] = useState([]);
  const toast = useToast();

  const handleDelete = (id) => {
    const item = items.find(i => i.id === id);
    setItems(items.filter(i => i.id !== id));
    
    toast.addToast({
      message: `${item.name} deleted`,
      type: 'success',
      duration: 5000,
      action: () => {
        setItems([...items, item]);
        toast.info('Item restored');
      },
      actionLabel: 'Undo',
    });
  };

  return (
    <div className="mobile-container">
      <h1>My Orders</h1>
      
      <div className="skeleton-list">
        {items.map(item => (
          <div key={item.id} className="skeleton-list-item">
            {/* Avatar */}
            <div className="skeleton-list-avatar" 
                 style={{background: item.color}}>
              {item.initials}
            </div>
            
            {/* Content */}
            <div className="skeleton-list-content">
              <div className="skeleton-list-title">
                {item.name}
              </div>
              <div className="skeleton-list-subtitle">
                {item.date}
              </div>
            </div>
            
            {/* Actions */}
            <div style={{display: 'flex', gap: '8px'}}>
              <button 
                className="touch-target"
                title="View details"
              >
                →
              </button>
              <button 
                className="touch-target"
                onClick={() => handleDelete(item.id)}
                title="Delete"
              >
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 6. Mobile Dropdown Menu

**Use Case:** User menu, sort options, filters

```jsx
function MobileDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{position: 'relative'}}>
      <button 
        onClick={() => setOpen(!open)}
        className="touch-target"
      >
        ⋮
      </button>

      {open && (
        <>
          {/* Overlay to close */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 50,
            }}
            onClick={() => setOpen(false)}
          />
          
          {/* Menu */}
          <div style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            zIndex: 51,
            minWidth: '150px',
            overflow: 'hidden',
          }}>
            <button className="mobile-fullwidth-button">Edit</button>
            <button className="mobile-fullwidth-button">Share</button>
            <button className="mobile-fullwidth-button">Delete</button>
          </div>
        </>
      )}
    </div>
  );
}
```

---

## 7. Mobile Search Input

**Use Case:** Searching products, orders, invoices

```jsx
function MobileSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = (value) => {
    setQuery(value);
    if (value.length > 2) {
      // Perform search
      performSearch(value).then(setResults);
    }
  };

  return (
    <div className="mobile-container">
      <input
        type="search"
        placeholder="Search..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        style={{
          borderRadius: '20px',
          padding: '8px 16px',
          width: '100%',
        }}
      />

      {results.length > 0 && (
        <div style={{
          marginTop: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
          {results.map(result => (
            <div 
              key={result.id}
              style={{
                padding: '12px',
                background: '#f9fafb',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              {result.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## 8. Mobile Loading State

**Use Case:** Show loading while fetching data

```jsx
function MobileLoadingPattern() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/data')
      .then(r => r.json())
      .then(d => {
        setData(d);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="mobile-container">
        <div style={{marginTop: '24px'}}>
          <div className="loading-skeleton" 
               style={{height: '20px', marginBottom: '12px'}} />
          <div className="loading-skeleton" 
               style={{height: '20px', marginBottom: '12px'}} />
          <div className="loading-skeleton" 
               style={{height: '20px', width: '70%'}} />
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-container">
      {/* Render data */}
    </div>
  );
}
```

---

## 9. Mobile Data Table

**Use Case:** Display table data on mobile

```jsx
function MobileDataTable({ columns, data }) {
  return (
    <div className="table-responsive">
      <div className="mobile-table">
        {data.map(row => (
          <div key={row.id} className="mobile-table-row">
            {columns.map(col => (
              <div key={col.key}>
                <div className="mobile-table-label">{col.label}</div>
                <div>{row[col.key]}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// Usage
<MobileDataTable
  columns={[
    { key: 'date', label: 'Date' },
    { key: 'amount', label: 'Amount' },
    { key: 'status', label: 'Status' },
  ]}
  data={invoices}
/>
```

---

## 10. Mobile Error State

**Use Case:** Show errors gracefully

```jsx
function MobileErrorState({ error, onRetry }) {
  return (
    <div className="mobile-container" 
         style={{
           display: 'flex',
           flexDirection: 'column',
           alignItems: 'center',
           justifyContent: 'center',
           minHeight: '300px',
           textAlign: 'center',
           gap: '16px',
         }}>
      <div style={{fontSize: '48px'}}>⚠️</div>
      <h2>Something went wrong</h2>
      <p style={{color: '#6b7280', marginBottom: '16px'}}>
        {error || 'An error occurred while loading'}
      </p>
      <button 
        className="mobile-fullwidth-button"
        onClick={onRetry}
      >
        Try Again
      </button>
    </div>
  );
}
```

---

## 11. Mobile Empty State

**Use Case:** Show when no data

```jsx
function MobileEmptyState({ action, message }) {
  return (
    <div className="mobile-container"
         style={{
           display: 'flex',
           flexDirection: 'column',
           alignItems: 'center',
           justifyContent: 'center',
           minHeight: '300px',
           textAlign: 'center',
           gap: '16px',
         }}>
      <div style={{fontSize: '48px'}}>📭</div>
      <h2>No items yet</h2>
      <p style={{color: '#6b7280'}}>
        {message || 'Get started by creating your first item'}
      </p>
      <button 
        className="mobile-fullwidth-button"
        onClick={action}
      >
        Create First Item
      </button>
    </div>
  );
}
```

---

## Accessibility Checklist for Components

- [ ] Min 48px touch targets
- [ ] Sufficient color contrast (WCAG AA)
- [ ] Focus indicators visible
- [ ] ARIA labels on interactive elements
- [ ] Keyboard navigation works
- [ ] Respects `prefers-reduced-motion`
- [ ] Form validation messages clear
- [ ] Error states distinguishable

---

## Performance Tips

1. **Image optimization:** Use webp with jpg fallback
2. **Code splitting:** Lazy load routes
3. **Memoization:** Use React.memo for card components
4. **Virtual lists:** Use windowing for long lists
5. **Debouncing:** Debounce search/resize events

