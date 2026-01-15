// src/AUTH_SYSTEM.md
# Centralized Auth System Documentation

## Overview

The frontend now has a completely centralized authentication system that mirrors your backend auth routes. This provides a clean, maintainable architecture for handling all authentication operations.

## Architecture

### Core Components

1. **AuthService** (`src/services/authService.js`)
   - Centralized service for all auth API calls
   - Manages localStorage for tokens and user data
   - Handles token refresh logic
   - Provides utility methods like `isAuthenticated()`, `hasRole()`, etc.

2. **AuthContext** (`src/context/AuthContext.js`)
   - React Context that manages global auth state
   - Provides methods: `login()`, `logout()`, `register()`, `changePassword()`, etc.
   - Handles silent token refresh on app load
   - Exposes `user`, `loading`, `error`, and `isAuthenticated` state

3. **useAuth Hook** (`src/hooks/useAuth.js`)
   - Custom React hook for easy access to auth context
   - Use this in any component to access auth state and methods

4. **RoleBasedRoute** (`src/components/RoleBasedRoute.js`)
   - Protected route component that enforces role-based access
   - Automatically redirects unauthenticated users to login
   - Supports multiple allowed roles

## API Mapping

Backend routes are wrapped by the AuthService:

| Backend Route | Service Method | Description |
|---|---|---|
| POST /api/auth/register | `authService.register(name, email, password)` | Register new user |
| POST /api/auth/login | `authService.login(email, password)` | Login user |
| POST /api/auth/logout | `authService.logout()` | Logout user |
| POST /api/auth/refresh | `authService.refreshAccessToken()` | Refresh access token |
| GET /api/auth/me | `authService.getCurrentUser()` | Get current user |
| POST /api/auth/change-password | `authService.changePassword(current, new)` | Change password |
| POST /api/auth/verify-email | `authService.verifyEmail(token)` | Verify email |

## Usage

### In App.js
```javascript
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <AppWrapper />
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}
```

### In Components

#### Get Current User
```javascript
import useAuth from '../hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return <div>Welcome, {user.name}!</div>;
}
```

#### Login
```javascript
const { login } = useAuth();

const handleLogin = async () => {
  try {
    const { user, token } = await login(email, password);
    // Automatically redirected by useEffect in LoginPage
  } catch (err) {
    console.error('Login failed:', err.message);
  }
};
```

#### Logout
```javascript
const { logout } = useAuth();

const handleLogout = async () => {
  await logout();
  navigate('/login');
};
```

#### Check Roles
```javascript
const { hasRole, hasAnyRole } = useAuth();

if (hasRole('admin')) {
  // Show admin panel
}

if (hasAnyRole(['admin', 'manager'])) {
  // Show admin or manager panel
}
```

#### Change Password
```javascript
const { changePassword } = useAuth();

try {
  await changePassword(currentPassword, newPassword);
  alert('Password changed successfully!');
} catch (err) {
  alert('Failed to change password');
}
```

### Protected Routes

```javascript
<Route
  path="/admin"
  element={
    <RoleBasedRoute allowedRoles={["admin"]}>
      <AdminDashPage />
    </RoleBasedRoute>
  }
/>
```

## State Management

### Auth Context State
- `user` - Current authenticated user object (or null)
- `loading` - Boolean indicating auth initialization
- `error` - Error message if auth operation fails
- `isAuthenticated` - Boolean indicating if user is authenticated

### Storage
- Access token stored in `localStorage.accessToken`
- User data stored in `localStorage.user`
- Refresh token stored in httpOnly cookie (managed by browser)

## Token Management

### Access Token
- Short-lived JWT (default 20 minutes)
- Stored in localStorage
- Automatically attached to all API requests via axios interceptor
- Automatically refreshed when expired (in api.js interceptor)

### Refresh Token
- Long-lived token (default 14 days)
- Stored in httpOnly cookie (secure)
- Used to obtain new access tokens
- Rotated on each refresh for security

## Silent Refresh

When the app loads, the AuthContext automatically:
1. Checks for stored user and access token
2. Attempts a silent refresh to get a new access token
3. Updates state with user data
4. Handles refresh failure gracefully

```javascript
// This happens automatically in AuthContext useEffect
const newToken = await authService.silentRefresh();
```

## Error Handling

All auth methods throw errors that can be caught:

```javascript
try {
  await login(email, password);
} catch (err) {
  const message = err.response?.data?.message || 'An error occurred';
  setError(message);
}
```

The `error` state in AuthContext also captures errors:

```javascript
const { error, clearError } = useAuth();

useEffect(() => {
  if (error) {
    // Handle error
    setTimeout(clearError, 5000); // Clear after 5 seconds
  }
}, [error]);
```

## Security Considerations

1. **httpOnly Cookies**: Refresh tokens are stored in httpOnly cookies to prevent XSS attacks
2. **CSRF Protection**: Cookies are set with `sameSite: 'none'` and `secure: true`
3. **Token Rotation**: Refresh tokens are rotated on each refresh
4. **Access Token Expiry**: Access tokens expire quickly (20m default)
5. **Domain-specific Cookies**: Cookies are set to `.doylesbreakroomservices.com` domain

## Initialization Flow

1. App mounts → AuthProvider initializes
2. AuthContext checks localStorage for existing user/token
3. If found, attempts silent refresh
4. Sets loading to false
5. Components render with auth state

## Component Migration

### Before (Scattered Auth)
- Multiple components directly calling API
- localStorage access scattered throughout
- Inconsistent error handling
- Prop drilling for user state

### After (Centralized)
- Single AuthService for all API calls
- Single source of truth in AuthContext
- Consistent error handling and loading states
- Easy access via useAuth hook

## Best Practices

1. **Always use useAuth hook** instead of direct localStorage access
2. **Wrap sensitive components** with RoleBasedRoute
3. **Handle loading states** in your UI
4. **Catch and display errors** to users
5. **Clear errors** after user action
6. **Use hasRole/hasAnyRole** for conditional rendering

## Future Enhancements

- Add session timeout warning
- Add biometric authentication
- Add social login (Google, GitHub)
- Add two-factor authentication
- Add account recovery flows
