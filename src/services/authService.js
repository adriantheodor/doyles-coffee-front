// src/services/authService.js
import api, { API_BASE } from "../utils/api";
import axios from "axios";

/**
 * Centralized Auth Service
 * Mirrors the backend auth routes structure
 */

class AuthService {
  /**
   * Register a new user
   * POST /api/auth/register
   */
  async register(name, email, password) {
    const response = await api.post("api/auth/register", {
      name,
      email,
      password,
    });
    return response.data;
  }

  /**
   * Login user and store access token
   * POST /api/auth/login
   * Returns: { token, user }
   */
  async login(email, password) {
    const response = await api.post(
      "api/auth/login",
      { email, password },
      { withCredentials: true }
    );

    const { token, user } = response.data;

    // Store access token in localStorage
    localStorage.setItem("accessToken", token);

    // Store user data
    localStorage.setItem("user", JSON.stringify(user));

    return { token, user };
  }

  /**
   * Logout user and clear tokens
   * POST /api/auth/logout
   */
  async logout() {
    try {
      await api.post(
        "api/auth/logout",
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear tokens regardless of API response
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    }
  }

  /**
   * Refresh access token using refresh token cookie
   * POST /api/auth/refresh
   * Returns: { token }
   */
  async refreshAccessToken() {
    try {
      const response = await axios.post(
        `${API_BASE}api/auth/refresh`,
        {},
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      const { token } = response.data;

      // Update access token in localStorage
      localStorage.setItem("accessToken", token);

      return token;
    } catch (error) {
      // Clear tokens on refresh failure
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      throw error;
    }
  }

  /**
   * Get current authenticated user
   * GET /api/auth/me
   */
  async getCurrentUser() {
    const response = await api.get("api/auth/me");
    return response.data;
  }

  /**
   * Update user profile information
   * PUT /api/auth/profile
   */
  async updateProfile(profileData) {
    const response = await api.put("api/auth/profile", profileData);
    return response.data;
  }

  /**
   * Change password
   * POST /api/auth/change-password
   */
  async changePassword(currentPassword, newPassword) {
    const response = await api.post("api/auth/change-password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  }

  /**
   * Verify email with token
   * POST /api/auth/verify-email
   */
  async verifyEmail(token) {
    const response = await api.post("api/auth/verify-email", { token });
    return response.data;
  }

  /**
   * Get all users for admin review
   * GET /api/auth/admin/users
   */
  async getAllUsers() {
    try {
      const response = await api.get("api/auth/admin/users");
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return [];
      }
      throw error;
    }
  }

  /**
   * Update a user from the admin panel
   * PUT /api/auth/admin/users/:id
   */
  async updateUserByAdmin(userId, updates) {
    const response = await api.put(`api/auth/admin/users/${userId}`, updates);
    return response.data;
  }

  /**
   * Resend verification email
   * POST /api/auth/resend-verification-email
   */
  async resendVerificationEmail(email) {
    const response = await api.post("api/auth/resend-verification-email", {
      email,
    });
    return response.data;
  }

  /**
   * Get stored access token
   */
  getAccessToken() {
    return localStorage.getItem("accessToken");
  }

  /**
   * Get stored user data
   */
  getStoredUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.getAccessToken() && !!this.getStoredUser();
  }

  /**
   * Check if user has a specific role
   */
  hasRole(role) {
    const user = this.getStoredUser();
    return user?.role === role;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles) {
    const user = this.getStoredUser();
    return user && roles.includes(user.role);
  }

  /**
   * Silent refresh on app load
   */
  async silentRefresh() {
    try {
      const newToken = await this.refreshAccessToken();
      return newToken;
    } catch (error) {
      console.warn("Silent refresh failed:", error.message);
      return null;
    }
  }

  /**
   * Clear all auth data
   */
  clearAuthData() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  }
}

const authService = new AuthService();
export default authService;
