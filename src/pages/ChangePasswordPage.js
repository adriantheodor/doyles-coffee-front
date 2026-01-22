import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import useToast from "../hooks/useToast";

const ChangePasswordPage = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'
  const [isLoading, setIsLoading] = useState(false);
  const { changePassword } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      const result = await changePassword(currentPassword, newPassword);
      const msg = result.message || "Password changed successfully!";
      setMessage(msg);
      setMessageType("success");
      toast.success(msg);
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "An error occurred. Please try again.";
      setMessage(errorMsg);
      setMessageType("error");
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mobile-container">
      <h2 className="mb-4">Change Password</h2>
      <form onSubmit={handleSubmit} className="mobile-stack" style={{ maxWidth: "500px" }}>
        {message && (
          <div
            className={`alert ${
              messageType === "success" ? "alert-success" : "alert-danger"
            }`}
            role="alert"
          >
            {message}
          </div>
        )}

        <div className="form-group">
          <label className="form-label" htmlFor="current-pwd">Current Password</label>
          <input
            id="current-pwd"
            type="password"
            className="form-input"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            disabled={isLoading}
            aria-label="Current password"
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="new-pwd">New Password</label>
          <input
            id="new-pwd"
            type="password"
            className="form-input"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            disabled={isLoading}
            aria-label="New password"
          />
        </div>
        <button
          type="submit"
          className="mobile-fullwidth-button"
          disabled={isLoading}
          aria-busy={isLoading}
        >
          {isLoading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordPage;
