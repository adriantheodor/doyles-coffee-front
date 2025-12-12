import React, { useState } from "react";
import axios from "axios";

const ChangePasswordPage = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.post(
        "http://localhost:4000/api/auth/change-password",
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message);
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setMessage(
        err.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">Change Password</h2>
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm" style={{ maxWidth: "500px" }}>
        <div className="mb-3">
          <label className="form-label">Current Password</label>
          <input
            type="password"
            className="form-control"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">New Password</label>
          <input
            type="password"
            className="form-control"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-success">Update Password</button>
        {message && <p className="mt-3 text-center text-muted">{message}</p>}
      </form>
    </div>
  );
};

export default ChangePasswordPage;
