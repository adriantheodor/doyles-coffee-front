# Auth Integration Guide for Other Components

## For Components That Need User Data

### Before (Old Way)
```javascript
const storedUser = localStorage.getItem('user');
const user = storedUser ? JSON.parse(storedUser) : null;
```

### After (New Way)
```javascript
import useAuth from '../hooks/useAuth';

function MyComponent() {
  const { user } = useAuth();
  // user is already parsed and reactive
}
```

## For Components Making Auth API Calls

### Before (Old Way)
```javascript
import { api } from '../utils/api';

const handleAction = async () => {
  const res = await api.post('api/auth/some-endpoint', data);
};
```

### After (New Way)
```javascript
import useAuth from '../hooks/useAuth';

function MyComponent() {
  const { changePassword, verifyEmail } = useAuth();
  
  const handleChangePassword = async () => {
    await changePassword(oldPass, newPass);
  };
}
```

## Common Pages That Might Need Updating

### HomePage.js
If it shows user info or has auth-related features:
```javascript
import useAuth from '../hooks/useAuth';

function HomePage() {
  const { isAuthenticated, user, login } = useAuth();
  
  if (isAuthenticated) {
    return <Dashboard user={user} />;
  }
  return <LandingPage onLogin={login} />;
}
```

### CustomerDashPage.js
Remove prop-based user state:
```javascript
// REMOVE THIS PROP
// const [user, setUser] = useState(...)

// USE THIS INSTEAD
const { user } = useAuth();
```

### AdminDashPage.js
Replace manual role checks:
```javascript
import useAuth from '../hooks/useAuth';

function AdminDashPage() {
  const { hasRole } = useAuth();
  
  if (!hasRole('admin')) {
    return <Navigate to="/" />;
  }
  
  return <AdminContent />;
}
```

### InvoicesPage.js, PlaceOrderPage.js, etc.
Any protected component:
```javascript
import useAuth from '../hooks/useAuth';

function ProtectedPage() {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <PageContent user={user} />;
}
```

## Pattern: Loading State in Protected Components

```javascript
import useAuth from '../hooks/useAuth';

function MyComponent() {
  const { loading, isAuthenticated, user } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <Content user={user} />;
}
```

## Pattern: Error Handling

```javascript
import useAuth from '../hooks/useAuth';

function MyComponent() {
  const { error, clearError } = useAuth();
  
  useEffect(() => {
    if (error) {
      showErrorNotification(error);
      const timer = setTimeout(clearError, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);
  
  return <Content />;
}
```

## Pattern: Conditional Rendering Based on Role

```javascript
import useAuth from '../hooks/useAuth';

function Dashboard() {
  const { user, hasRole, hasAnyRole } = useAuth();
  
  return (
    <div>
      {hasRole('admin') && <AdminPanel />}
      {hasRole('customer') && <CustomerPanel />}
      {hasAnyRole(['admin', 'manager']) && <ManagementTools />}
    </div>
  );
}
```

## Pattern: Redirect After Auth Action

```javascript
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const handleLogin = async (email, password) => {
    try {
      const { user } = await login(email, password);
      // Navigate based on role
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };
  
  return <LoginUI onSubmit={handleLogin} />;
}
```

## Removing Prop Drilling

### Before
```javascript
function App() {
  const [user, setUser] = useState(null);
  
  return (
    <Navbar user={user} setUser={setUser} />
    <Component user={user} setUser={setUser} />
    <SubComponent user={user} />
  );
}
```

### After
```javascript
function App() {
  // No user state needed!
  
  return (
    <Navbar />
    <Component />
    <SubComponent />
  );
}

// In each component that needs user:
function Navbar() {
  const { user, logout } = useAuth();
  // No props needed!
}
```

## Handling Async Operations

```javascript
import useAuth from '../hooks/useAuth';

function MyComponent() {
  const { changePassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleChangePassword = async (oldPass, newPass) => {
    setIsLoading(true);
    setError('');
    
    try {
      await changePassword(oldPass, newPass);
      setSuccess('Password changed!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed');
    } finally {
      setIsLoading(false);
    }
  };
  
  return <Form onSubmit={handleChangePassword} isLoading={isLoading} />;
}
```

## Testing Auth State

In DevTools Console:
```javascript
// Get current auth state (React DevTools → Hooks → AuthContext)
// Or manually:
console.log(localStorage.getItem('accessToken'));
console.log(localStorage.getItem('user'));

// Check cookies:
// DevTools → Application → Cookies → [your domain] → refreshToken
```

## API Calls with Auth

All API calls automatically include the access token via interceptor in `src/utils/api.js`:

```javascript
// This automatically adds Authorization: Bearer <token>
import { api } from '../utils/api';

const res = await api.get('api/some-protected-endpoint');
```

## Checklist for Updating a Page

- [ ] Import `useAuth` at top
- [ ] Remove manual localStorage access
- [ ] Remove `user` and `setUser` props
- [ ] Get auth state from `useAuth()`
- [ ] Add loading state handling if needed
- [ ] Replace direct API calls with context methods
- [ ] Add error handling
- [ ] Test with backend
- [ ] Remove any `onLogin` prop callbacks

## Common Mistakes to Avoid

❌ **Wrong:** Accessing localStorage directly
```javascript
const user = JSON.parse(localStorage.getItem('user'));
```

✅ **Right:** Using useAuth hook
```javascript
const { user } = useAuth();
```

❌ **Wrong:** Passing user as prop through multiple levels
```javascript
<Navbar user={user} setUser={setUser} />
<Component user={user} setUser={setUser} />
```

✅ **Right:** Each component uses useAuth
```javascript
function Navbar() { const { user, logout } = useAuth(); }
function Component() { const { user } = useAuth(); }
```

❌ **Wrong:** Manual token management
```javascript
localStorage.setItem('accessToken', token);
localStorage.removeItem('accessToken');
```

✅ **Right:** Let authService handle it
```javascript
// Automatic in login/logout/refresh
const { login, logout } = useAuth();
```

## Performance Tips

1. **Use loading states** - Don't show stale UI while auth is loading
2. **Memoize callbacks** - Use `useCallback` for handlers passed to useAuth
3. **Split components** - Separate auth-dependent and independent code
4. **Use Error Boundary** - Wrap app with error boundary for auth errors

## Questions?

Reference files:
- `src/services/authService.js` - All available methods
- `src/context/AuthContext.js` - All state/methods provided
- `src/pages/LoginPage.js` - Example of full auth flow
- `AUTH_SYSTEM.md` - Full documentation
