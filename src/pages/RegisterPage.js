// src/pages/RegisterPage.js
import React, { useState } from "react";
import { api } from "../utils/api";
// Note: axios is not directly used, so it can be removed if not needed elsewhere.
// import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
// 1. Import the same CSS file as LoginPage.js
import "./LoginPage.css";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer", // Default role
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // on submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setSuccess(""); // Clear previous success messages
    try {
      await api.post("api/auth/register", formData);
      setSuccess("Registration successful! Redirecting to login...");
      // navigate to login after a short delay to let the user see the message
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    // 2. Add the main container class
    <div className="login-page">
      {/* 3. Add the card container class */}
      <div className="login-card">
        <h1>Create Account</h1>
        <p className="subtitle">Register to get started</p>

        {/* 4. Use the styled error/success messages */}
        {error && <div className="error-msg">{error}</div>}
        {success && <div className="success-msg">{success}</div>}

        <form onSubmit={handleSubmit}>
          {/* Form Group: Full Name */}
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
            />
          </div>

          {/* Form Group: Email */}
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
            />
          </div>

          {/* Form Group: Password */}
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
            />
          </div>

          {/* Form Group: Role Selection (styled as form group) */}
          <div className="form-group">
            <label htmlFor="role" className="form-label">
              Account Type
            </label>
          </div>

          {/* 5. Use the styled button class */}
          <button type="submit" className="login-btn">
            Register Account
          </button>
        </form>

        {/* 6. Use the styled link box */}
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
