// src/QUICK_AUTH_REFERENCE.md
# Quick Auth Reference

## Import useAuth Hook

```javascript
import useAuth from '../hooks/useAuth';

function MyComponent() {
  const { user, login, logout, isAuthenticated, hasRole } = useAuth();
}
```

## Common Patterns

### Display User Info
```javascript
const { user } = useAuth();
return <div>{user?.name} ({user?.role})</div>;
```

### Check if Logged In
```javascript
const { isAuthenticated } = useAuth();
if (isAuthenticated) {
  return <Dashboard />;
}
return <LoginPrompt />;
```

### Check User Role
```javascript
const { hasRole, hasAnyRole } = useAuth();

if (hasRole('admin')) return <AdminPanel />;
if (hasAnyRole(['admin', 'manager'])) return <ManagePanel />;
```

### Login Form
```javascript
const { login, error, clearError } = useAuth();

const handleSubmit = async (email, password) => {
  try {
    await login(email, password);
    // Redirect happens automatically
  } catch (err) {
    setError(err.message);
  }
};
```

### Logout
```javascript
const { logout } = useAuth();

const handleLogout = async () => {
  await logout();
  navigate('/login');
};
```

### Change Password
```javascript
const { changePassword } = useAuth();

const handleChangePassword = async (current, newPass) => {
  try {
    await changePassword(current, newPass);
    setMessage('Password updated successfully!');
  } catch (err) {
    setError('Failed to change password');
  }
};
```

### Protected Route
```javascript
<Route
  path="/admin"
  element={
    <RoleBasedRoute allowedRoles={["admin"]}>
      <AdminPage />
    </RoleBasedRoute>
  }
/>
```

### Handle Loading State
```javascript
const { loading } = useAuth();

if (loading) {
  return <LoadingSpinner />;
}
```

## AuthContext Methods

| Method | Params | Returns | Description |
|---|---|---|---|
| `login` | email, password | { token, user } | Login user |
| `logout` | - | void | Logout user |
| `register` | name, email, password | void | Register new user |
| `changePassword` | currentPassword, newPassword | { message } | Change password |
| `verifyEmail` | token | { message } | Verify email |
| `refreshToken` | - | token | Get new access token |
| `getCurrentUser` | - | user | Fetch current user from server |
| `clearError` | - | void | Clear error state |

## AuthContext State

| Property | Type | Description |
|---|---|---|
| `user` | object \| null | Current user data |
| `loading` | boolean | Auth initializing |
| `error` | string \| null | Error message |
| `isAuthenticated` | boolean | User logged in |

## AuthService Methods

Direct service calls (rarely needed, use context instead):

```javascript
import authService from '../services/authService';

authService.register(name, email, password);
authService.login(email, password);
authService.logout();
authService.changePassword(current, new);
authService.verifyEmail(token);
authService.refreshAccessToken();
authService.getCurrentUser();
authService.isAuthenticated();
authService.hasRole(role);
authService.hasAnyRole(roles);
authService.getAccessToken();
authService.getStoredUser();
authService.clearAuthData();
```

## Error Handling

```javascript
const { error } = useAuth();

useEffect(() => {
  if (error) {
    console.error('Auth error:', error);
    // Show error to user
  }
}, [error]);
```

## Common Errors

| Error | Cause | Solution |
|---|---|---|
| "useAuth must be used within AuthProvider" | useAuth called outside AuthProvider | Ensure AuthProvider wraps your app |
| "Invalid credentials" | Wrong email/password | Check credentials |
| "User already exists" | Email already registered | Use different email |
| "Token expired" | Access token expired | System auto-refreshes, try again |
| "Refresh token expired" | Refresh token expired | User must login again |

## File Structure

```
src/
├── services/
│   └── authService.js          # API calls & token management
├── context/
│   └── AuthContext.js          # Global auth state
├── hooks/
│   └── useAuth.js              # Custom hook
├── components/
│   └── RoleBasedRoute.js        # Protected routes
├── pages/
│   ├── LoginPage.js            # Updated to use useAuth
│   └── RegisterPage.js         # Updated to use useAuth
├── utils/
│   └── api.js                  # Axios config & interceptors
└── AUTH_SYSTEM.md              # Full documentation
```

## Next Steps

1. Update other pages to use useAuth instead of direct API calls
2. Add error boundary for auth errors
3. Implement remember-me functionality
4. Add session timeout warning
5. Test with backend auth routes
