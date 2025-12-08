import { useEffect, useState } from "react";
import { API_BASE } from "../../../utils/api";

const IssuesManager = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchIssues = async () => {
    try {
      const res = await fetch(`${API_BASE}api/issues`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      // 🔍 Debug log
      console.log("ADMIN ISSUES RESPONSE:", data);

      if (!res.ok) {
        setErrorMsg(data.message || "Failed to load issues.");
        setIssues([]); // prevent .map error
      } else if (!Array.isArray(data)) {
        // ❌ Not an array → backend error or wrong format
        setErrorMsg("Server returned invalid data format (expected array).");
        setIssues([]);
      } else {
        // ✅ Valid array
        setIssues(data);
        setErrorMsg("");
      }
    } catch (err) {
      console.error("Error loading issues", err);
      setErrorMsg("Error connecting to server.");
      setIssues([]);
    }

    setLoading(false);
  };

  const updateStatus = async (id, status) => {
    await fetch(`${API_BASE}api/issues/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ status }),
    });

    fetchIssues();
  };

  const deleteIssue = async (id) => {
    if (!window.confirm("Delete this issue?")) return;

    await fetch(`${API_BASE}api/issues/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    fetchIssues();
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  if (loading) return <p>Loading issues...</p>;

  return (
    <div className="page-container">
      <div className="page-card">
      <h2 className="page-title">Issue Reports</h2>

      {errorMsg && (
        <p style={{ color: "red", fontWeight: "bold" }}>{errorMsg}</p>
      )}

      <table
        border="1"
        cellPadding="8"
        className="styled-table"
      >
        <thead>
          <tr>
            <th>Customer</th>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Admin Notes</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {issues.map((i) => (
            <tr key={i._id}>
              <td>{i.user?.name || "Unknown"}</td>
              <td>{i.title}</td>
              <td>{i.description}</td>
              <td>{i.status}</td>
              <td>{i.adminNotes || "—"}</td>

              <td>
                <button onClick={() => updateStatus(i._id, "In Progress")}>
                  In Progress
                </button>
                <button onClick={() => updateStatus(i._id, "Resolved")}>
                  Resolve
                </button>
                <button onClick={() => deleteIssue(i._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default IssuesManager;