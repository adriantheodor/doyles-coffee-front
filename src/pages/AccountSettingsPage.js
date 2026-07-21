import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import "./AccountSettingsPage.css";

const AccountSettingsPage = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    companyName: "",
    address: "",
  });

  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    if (user) {
      const initialData = {
        name: user.name || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber ?? user.phone ?? "",
        companyName: user.companyName ?? user.company ?? "",
        address: user.address ?? "",
      };
      setFormData(initialData);
      setOriginalData(initialData);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setMessage("");
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
    setMessage("");
  };

  const hasChanges = () => {
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  };

  const handleSaveClick = () => {
    if (!hasChanges()) {
      setMessage("No changes to save.");
      setMessageType("info");
      return;
    }

    // Validate form
    if (!formData.name || !formData.email) {
      setMessage("Name and email are required.");
      setMessageType("error");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage("Please enter a valid email address.");
      setMessageType("error");
      return;
    }

    setShowConfirmation(true);
  };

  const handleConfirmSave = async () => {
    setIsLoading(true);
    setMessage("");
    setShowConfirmation(false);

    try {
      const result = await updateProfile({
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        companyName: formData.companyName,
        address: formData.address,
      });

      const updatedUser = result.user || result;
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setOriginalData({
        name: updatedUser.name || formData.name,
        email: updatedUser.email || formData.email,
        phoneNumber: updatedUser.phoneNumber ?? formData.phoneNumber,
        companyName: updatedUser.companyName ?? formData.companyName,
        address: updatedUser.address ?? formData.address,
      });
      setFormData((prev) => ({
        ...prev,
        name: updatedUser.name || prev.name,
        email: updatedUser.email || prev.email,
        phoneNumber: updatedUser.phoneNumber ?? prev.phoneNumber,
        companyName: updatedUser.companyName ?? prev.companyName,
        address: updatedUser.address ?? prev.address,
      }));

      setMessage("Profile updated successfully!");
      setMessageType("success");
      setIsEditing(false);

      // Auto-clear success message after 3 seconds
      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to update profile. Please try again.";
      setMessage(errorMsg);
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="page-container">
        <div className="page-card">
          <p className="error-message">Please log in to access account settings.</p>
          <button onClick={() => navigate("/login")}>Go to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-card account-settings-card">
        <div className="settings-header">
          <h1 className="page-title">Account Settings</h1>
          <span className="user-badge">{user.role}</span>
        </div>

        {message && (
          <div className={`alert alert-${messageType}`}>
            {message}
          </div>
        )}

        {showConfirmation && (
          <div className="confirmation-overlay">
            <div className="confirmation-dialog">
              <h3>Confirm Changes</h3>
              <p>Are you sure you want to update your profile information?</p>
              <div className="confirmation-details">
                {formData.name !== originalData.name && (
                  <div className="detail-change">
                    <span>Name:</span>
                    <span className="old-value">{originalData.name}</span>
                    <span className="arrow">→</span>
                    <span className="new-value">{formData.name}</span>
                  </div>
                )}
                {formData.email !== originalData.email && (
                  <div className="detail-change">
                    <span>Email:</span>
                    <span className="old-value">{originalData.email}</span>
                    <span className="arrow">→</span>
                    <span className="new-value">{formData.email}</span>
                  </div>
                )}
                {formData.phoneNumber !== originalData.phoneNumber && (
                  <div className="detail-change">
                    <span>Phone:</span>
                    <span className="old-value">{originalData.phoneNumber || "—"}</span>
                    <span className="arrow">→</span>
                    <span className="new-value">{formData.phoneNumber || "—"}</span>
                  </div>
                )}
                {formData.companyName !== originalData.companyName && (
                  <div className="detail-change">
                    <span>Company:</span>
                    <span className="old-value">{originalData.companyName || "—"}</span>
                    <span className="arrow">→</span>
                    <span className="new-value">{formData.companyName || "—"}</span>
                  </div>
                )}
                {formData.address !== originalData.address && (
                  <div className="detail-change">
                    <span>Address:</span>
                    <span className="old-value">{originalData.address || "—"}</span>
                    <span className="arrow">→</span>
                    <span className="new-value">{formData.address || "—"}</span>
                  </div>
                )}
              </div>
              <div className="confirmation-actions">
                <button
                  className="btn-cancel-confirm"
                  onClick={() => setShowConfirmation(false)}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  className="btn-confirm-save"
                  onClick={handleConfirmSave}
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Confirm & Save"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="settings-section">
          <div className="section-header">
            <h2>Personal Information</h2>
            {!isEditing && (
              <button className="btn-edit" onClick={handleEdit}>
                ✎ Edit
              </button>
            )}
          </div>

          <form className="settings-form">
            <div className="form-group">
              <label htmlFor="name">
                Full Name <span className="required">*</span>
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Your full name"
                className={isEditing ? "" : "disabled-input"}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                disabled
                placeholder="your.email@example.com"
                className="disabled-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                id="phoneNumber"
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="(555) 123-4567"
                className={isEditing ? "" : "disabled-input"}
              />
            </div>

            <div className="form-group">
              <label htmlFor="companyName">Company Name</label>
              <input
                id="companyName"
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Your company name"
                className={isEditing ? "" : "disabled-input"}
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Street address, city, state, zip"
                rows={3}
                className={isEditing ? "" : "disabled-input"}
              />
            </div>

            {isEditing && (
              <div className="form-actions">
                <button
                  type="button"
                  className="btn-save"
                  onClick={handleSaveClick}
                  disabled={isLoading || !hasChanges()}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            )}
          </form>
        </div>

        <div className="settings-section">
          <div className="section-header">
            <h2>Account Security</h2>
          </div>
          <div className="security-options">
            <div className="security-item">
              <div>
                <h3>Password</h3>
                <p>Change your password to keep your account secure</p>
              </div>
              <button
                className="btn-secondary"
                onClick={() => navigate("/change-password")}
              >
                Change Password
              </button>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <div className="section-header">
            <h2>Account Information</h2>
          </div>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Account Type</span>
              <span className="info-value">{user.role === "admin" ? "Administrator" : "Customer"}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Member Since</span>
              <span className="info-value">
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "Unknown"}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Email Verified</span>
              <span className={`info-value ${user.emailVerified ? "verified" : "unverified"}`}>
                {user.emailVerified ? "✓ Yes" : "✗ No"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettingsPage;
