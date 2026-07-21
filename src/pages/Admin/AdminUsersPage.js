import React, { useEffect, useState } from "react";
import authService from "../../services/authService";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await authService.getAllUsers();
        const userList = Array.isArray(response) ? response : response?.users || [];
        setUsers(userList);
      } catch (err) {
        const message = err.response?.status === 404
          ? "This backend does not expose an admin users endpoint yet."
          : err.response?.data?.message || err.message || "Failed to load users";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const safeValue = (value) => (value === null || value === undefined ? "—" : value);

  return (
    <div className="page-container py-4">
      <div className="page-card">
        <h1 className="page-title">Admin Users</h1>
        <p className="page-subtitle">View registered users without exposing passwords.</p>

        {loading && <p>Loading users...</p>}
        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && (
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Verified</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">No users found.</td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id || user._id || user.email}>
                      <td>{safeValue(user.name)}</td>
                      <td>{safeValue(user.email)}</td>
                      <td>{safeValue(user.role)}</td>
                      <td>{safeValue(user.isActive ? "Active" : "Inactive")}</td>
                      <td>{user.isVerified ? "Yes" : "No"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
