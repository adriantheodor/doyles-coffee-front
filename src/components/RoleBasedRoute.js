import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  // Show loading state while auth is initializing
  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#f8f9fa',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            className="spinner-border"
            role="status"
            style={{ color: '#1976d2', marginBottom: '10px' }}
          >
            <span className="sr-only">Loading...</span>
          </div>
          <p style={{ color: '#666' }}>Checking permissions...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated and has required role
  if (!isAuthenticated || !user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RoleBasedRoute;
