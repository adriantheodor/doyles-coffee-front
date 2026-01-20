// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useCallback } from "react";
import authService from "../services/authService";

/**
 * Auth Context - Manages global auth state
 * Provides: user, loading, error, login, logout, register, changePassword, etc.
 */
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Initialize auth state on app load
   * - Check for stored user
   * - Attempt silent refresh if token exists
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);

        // Try silent refresh first
        const storedUser = authService.getStoredUser();
        if (storedUser && authService.getAccessToken()) {
          setUser(storedUser);

          // Attempt to refresh token silently
          try {
            await authService.silentRefresh();
          } catch (refreshError) {
            console.warn("Silent refresh failed, user may need to login again");
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
        setError(err.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Register a new user
   */
  const register = useCallback(
    async (name, email, password) => {
      setError(null);
      try {
        await authService.register(name, email, password);
        return { success: true };
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || err.message || "Registration failed";
        setError(errorMessage);
        throw err;
      }
    },
    []
  );

  /**
   * Login user
   */
  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const { token, user: userData } = await authService.login(email, password);
      setUser(userData);
      return { token, user: userData };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Login failed";
      setError(errorMessage);
      setUser(null);
      throw err;
    }
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    setError(null);
    try {
      await authService.logout();
      setUser(null);
    } catch (err) {
      const errorMessage = err.message || "Logout failed";
      setError(errorMessage);
      // Clear state anyway
      setUser(null);
    }
  }, []);

  /**
   * Change password
   */
  const changePassword = useCallback(async (currentPassword, newPassword) => {
    setError(null);
    try {
      const result = await authService.changePassword(currentPassword, newPassword);
      return result;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Change password failed";
      setError(errorMessage);
      throw err;
    }
  }, []);

  /**
   * Update user profile information
   */
  const updateProfile = useCallback(async (profileData) => {
    setError(null);
    try {
      const result = await authService.updateProfile(profileData);
      // Update local user state with new data
      const updatedUser = result.user || result;
      setUser(updatedUser);
      return result;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Update profile failed";
      setError(errorMessage);
      throw err;
    }
  }, []);

  /**
   * Verify email with token
   */
  const verifyEmail = useCallback(async (token) => {
    setError(null);
    try {
      const result = await authService.verifyEmail(token);
      return result;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Email verification failed";
      setError(errorMessage);
      throw err;
    }
  }, []);

  /**
   * Refresh access token
   */
  const refreshToken = useCallback(async () => {
    try {
      const newToken = await authService.refreshAccessToken();
      return newToken;
    } catch (err) {
      console.error("Token refresh failed:", err);
      setUser(null);
      throw err;
    }
  }, []);

  /**
   * Get current user from server
   * Useful for syncing state with server
   */
  const getCurrentUser = useCallback(async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
      return userData;
    } catch (err) {
      console.error("Failed to get current user:", err);
      setUser(null);
      throw err;
    }
  }, []);

  /**
   * Clear auth state and error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = !!user && !!authService.getAccessToken();

  /**
   * Check if user has a specific role
   */
  const hasRole = (role) => user?.role === role;

  /**
   * Check if user has any of the specified roles
   */
  const hasAnyRole = (roles) => user && roles.includes(user.role);

  const value = {
    // State
    user,
    loading,
    error,
    isAuthenticated,

    // Methods
    register,
    login,
    logout,
    changePassword,
    updateProfile,
    verifyEmail,
    refreshToken,
    getCurrentUser,
    clearError,

    // Role checks
    hasRole,
    hasAnyRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
