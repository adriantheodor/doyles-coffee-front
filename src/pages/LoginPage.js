// src/pages/LoginPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useToast from "../hooks/useToast";
import "./LoginPage.css";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, user, isAuthenticated } = useAuth();
  const toast = useToast();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === "admin" ? "/admin" : "/dashboard");
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(""); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { user: userData } = await login(formData.email, formData.password);
      toast.success("Welcome back!");
      navigate(userData.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Login failed. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="login-page mobile-container">
      <div className="login-card">
        <h1>Welcome Back</h1>
        <p className="subtitle">Please login to your account</p>

        {error && <div className="error-msg" role="alert">{error}</div>}

        <form onSubmit={handleSubmit} className="mobile-stack">
          <div className="form-group">
            <label className="form-label" htmlFor="email-input">Email Address</label>
            <input
              id="email-input"
              className="form-input"
              type="email"
              name="email"
              placeholder="name@example.com"
              onChange={handleChange}
              value={formData.email}
              required
              disabled={isLoading}
              aria-label="Email address"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password-input">Password</label>
            <input
              id="password-input"
              className="form-input"
              type="password"
              name="password"
              placeholder="••••••••"
              onChange={handleChange}
              value={formData.password}
              required
              disabled={isLoading}
              aria-label="Password"
            />
          </div>

          <button type="submit" className="mobile-fullwidth-button" disabled={isLoading} aria-busy={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="register-link-box">
          Don’t have an account?
          <button
            className="register-link-btn"
            onClick={() => navigate("/register")}            disabled={isLoading}          >
            Register here
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
