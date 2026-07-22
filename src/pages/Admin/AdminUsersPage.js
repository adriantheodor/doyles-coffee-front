import React, { useEffect, useState } from "react";
import authService from "../../services/authService";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

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

  const startEditing = (user) => {
    setEditingId(user.id || user._id || user.email);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      address: user.address || "",
      companyName: user.companyName || "",
      role: user.role || "customer",
      isActive: user.isActive !== false,
      isVerified: Boolean(user.isVerified),
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setFormData({});
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async (userId) => {
    try {
      setSaving(true);
      setError("");
      const updatedUser = await authService.updateUserByAdmin(userId, formData);
      setUsers((prev) =>
        prev.map((user) => {
          const currentId = user.id || user._id || user.email;
          return currentId === userId ? { ...user, ...updatedUser } : user;
        })
      );
      cancelEditing();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container py-4">
      <div className="page-card">
        <h1 className="page-title">Users</h1>
        <p className="page-subtitle">View and manage registered users.</p>

        {loading && <p>Loading users...</p>}
        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && (
          <>
            <div className="d-none d-md-block table-responsive">
              <table className="table table-striped align-middle mb-0">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                    <th>Address</th>
                    <th>Company</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Verified</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="text-center">No users found.</td>
                    </tr>
                  ) : (
                    users.map((user) => {
                      const userId = user.id || user._id || user.email;
                      const isEditing = editingId === userId;

                      return (
                        <tr key={userId}>
                          <td>
                            {isEditing ? (
                              <input
                                className="form-control"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                              />
                            ) : (
                              safeValue(user.name)
                            )}
                          </td>
                          <td>
                            {isEditing ? (
                              <input
                                className="form-control"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                              />
                            ) : (
                              safeValue(user.email)
                            )}
                          </td>
                          <td>
                            {isEditing ? (
                              <input
                                className="form-control"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                              />
                            ) : (
                              safeValue(user.phoneNumber)
                            )}
                          </td>
                          <td>
                            {isEditing ? (
                              <input
                                className="form-control"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                              />
                            ) : (
                              safeValue(user.address)
                            )}
                          </td>
                          <td>
                            {isEditing ? (
                              <input
                                className="form-control"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleInputChange}
                              />
                            ) : (
                              safeValue(user.companyName)
                            )}
                          </td>
                          <td>
                            {isEditing ? (
                              <select
                                className="form-select"
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                              >
                                <option value="customer">Customer</option>
                                <option value="admin">Admin</option>
                              </select>
                            ) : (
                              safeValue(user.role)
                            )}
                          </td>
                          <td>
                            {isEditing ? (
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="isActive"
                                  checked={formData.isActive}
                                  onChange={handleInputChange}
                                />
                                <label className="form-check-label">Active</label>
                              </div>
                            ) : (
                              safeValue(user.isActive ? "Active" : "Inactive")
                            )}
                          </td>
                          <td>
                            {isEditing ? (
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="isVerified"
                                  checked={formData.isVerified}
                                  onChange={handleInputChange}
                                />
                                <label className="form-check-label">Verified</label>
                              </div>
                            ) : (
                              user.isVerified ? "Yes" : "No"
                            )}
                          </td>
                          <td>
                            {isEditing ? (
                              <div className="d-flex gap-2">
                                <button
                                  className="btn btn-sm btn-success"
                                  onClick={() => handleSave(userId)}
                                  disabled={saving}
                                >
                                  {saving ? "Saving..." : "Save"}
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-secondary"
                                  onClick={cancelEditing}
                                  disabled={saving}
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => startEditing(user)}
                              >
                                Edit
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="d-md-none">
              {users.length === 0 ? (
                <div className="text-center py-3">No users found.</div>
              ) : (
                users.map((user) => {
                  const userId = user.id || user._id || user.email;
                  const isEditing = editingId === userId;

                  return (
                    <div key={userId} className="card mb-3">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <strong>{safeValue(user.name)}</strong>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => startEditing(user)}
                          >
                            {isEditing ? "Editing" : "Edit"}
                          </button>
                        </div>

                        {isEditing ? (
                          <div className="d-grid gap-2">
                            <input className="form-control" name="name" value={formData.name} onChange={handleInputChange} />
                            <input className="form-control" name="email" value={formData.email} onChange={handleInputChange} />
                            <input className="form-control" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} />
                            <input className="form-control" name="address" value={formData.address} onChange={handleInputChange} />
                            <input className="form-control" name="companyName" value={formData.companyName} onChange={handleInputChange} />
                            <select className="form-select" name="role" value={formData.role} onChange={handleInputChange}>
                              <option value="customer">Customer</option>
                              <option value="admin">Admin</option>
                            </select>
                            <div className="form-check">
                              <input className="form-check-input" type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} />
                              <label className="form-check-label">Active</label>
                            </div>
                            <div className="form-check">
                              <input className="form-check-input" type="checkbox" name="isVerified" checked={formData.isVerified} onChange={handleInputChange} />
                              <label className="form-check-label">Verified</label>
                            </div>
                            <div className="d-flex gap-2">
                              <button className="btn btn-sm btn-success" onClick={() => handleSave(userId)} disabled={saving}>
                                {saving ? "Saving..." : "Save"}
                              </button>
                              <button className="btn btn-sm btn-outline-secondary" onClick={cancelEditing} disabled={saving}>
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="small text-muted">
                            <div><strong>Email:</strong> {safeValue(user.email)}</div>
                            <div><strong>Phone:</strong> {safeValue(user.phoneNumber)}</div>
                            <div><strong>Address:</strong> {safeValue(user.address)}</div>
                            <div><strong>Company:</strong> {safeValue(user.companyName)}</div>
                            <div><strong>Role:</strong> {safeValue(user.role)}</div>
                            <div><strong>Status:</strong> {safeValue(user.isActive ? "Active" : "Inactive")}</div>
                            <div><strong>Verified:</strong> {user.isVerified ? "Yes" : "No"}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
