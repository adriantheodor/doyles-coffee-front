// src/pages/RegisterPage.js
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useToast from "../hooks/useToast";
import "./LoginPage.css";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated, user } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === "admin" ? "/admin" : "/dashboard");
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError(""); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      await register(formData.name, formData.email, formData.password);
      // Store email for potential use on verify page
      localStorage.setItem("userEmail", formData.email);
      const msg = "Registration successful! Redirecting to login...";
      setSuccess(msg);
      toast.success(msg);
      // Navigate to login after a short delay to let the user see the message
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Registration failed. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page mobile-container">
      <div className="login-card">
        <h1>Create Account</h1>
        <p className="subtitle">Register to get started</p>

        {error && <div className="error-msg" role="alert">{error}</div>}
        {success && <div className="success-msg">{success}</div>}

        <form onSubmit={handleSubmit} className="mobile-stack">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Full Name
            </label>
            <input
              id="name"
              className="form-input"
              type="text"
              name="name"
              placeholder="Your Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              id="email"
              className="form-input"
              type="email"
              name="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              className="form-input"
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Register Account"}
          </button>
        </form>

        <div className="register-link-box">
          Already have an account?
          <Link to="/login" className="register-link-btn">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
