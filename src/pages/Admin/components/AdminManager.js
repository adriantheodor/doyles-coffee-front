import { useState } from "react";
import { API_BASE } from "../../../utils/api";


const AdminManager = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "loading", message: "Creating admin..." });

    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(`${API_BASE}api/auth/create-admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 🔑 Passing the token is key
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create admin");
      }

      setStatus({
        type: "success",
        message: "New Admin created successfully!",
      });
      setFormData({ name: "", email: "", password: "" });
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    }
  };

  return (
    <div className="section-container">
      <h2 className="section-title">Manage Admins</h2>

      <div
        className="admin-form-card"
        style={{ maxWidth: "500px", margin: "0 auto" }}
      >
        <h3 className="sub-title">Create New Admin User</h3>

        {status.message && (
          <div
            className={`status-msg ${status.type}`}
            style={{
              padding: "10px",
              marginBottom: "15px",
              borderRadius: "4px",
              backgroundColor: status.type === "error" ? "#fee2e2" : "#dcfce7",
              color: status.type === "error" ? "#991b1b" : "#166534",
            }}
          >
            {status.message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
              }}
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
              }}
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
              }}
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: "#2563eb",
              color: "white",
              padding: "10px",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Create Admin
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminManager;