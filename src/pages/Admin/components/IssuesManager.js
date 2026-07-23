import { useEffect, useState } from "react";
import { API_BASE } from "../../../utils/api";

const IssuesManager = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchIssues = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setErrorMsg("Authentication token not found. Please log in again.");
        setIssues([]);
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_BASE}api/issues`, {
        headers: {
          Authorization: `Bearer ${token}`,
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
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Authentication token not found. Please log in again.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}api/issues/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        alert("Failed to update issue status.");
        return;
      }

      fetchIssues();
    } catch (err) {
      console.error("Error updating issue status:", err);
      alert("Error updating issue status.");
    }
  };

  const deleteIssue = async (id) => {
    if (!window.confirm("Delete this issue?")) return;

    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Authentication token not found. Please log in again.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}api/issues/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        alert("Failed to delete issue.");
        return;
      }

      fetchIssues();
    } catch (err) {
      console.error("Error deleting issue:", err);
      alert("Error deleting issue.");
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  if (loading) return <p>Loading issues...</p>;

  return (
    <div className="page-container issues-page">
      <div className="page-card">
        <h2 className="page-title">Issue Reports</h2>

        {errorMsg && (
          <p style={{ color: "red", fontWeight: "bold" }}>{errorMsg}</p>
        )}

        <div className="table-scroll">
          <table border="1" cellPadding="8" className="styled-table">
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
                  <td data-label="Customer">{i.customer?.name || "Unknown"}</td>
                  <td data-label="Title">{i.title}</td>
                  <td data-label="Description">{i.description}</td>
                  <td data-label="Status">{i.status}</td>
                  <td data-label="Admin Notes">{i.adminNotes || "—"}</td>

                  <td data-label="Actions">
                    <div className="action-buttons">
                      <button onClick={() => updateStatus(i._id, "In Progress")}>
                        In Progress
                      </button>
                      <button onClick={() => updateStatus(i._id, "Resolved")}>
                        Resolve
                      </button>
                      <button
                        className="danger"
                        onClick={() => deleteIssue(i._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {issues.length === 0 && !errorMsg && (
            <p className="empty-state">No issues to show.</p>
          )}
        </div>
      </div>

      {/* Scoped to .issues-page so it won't affect other tables/pages
          reusing .page-container / .styled-table elsewhere in the app. */}
      <style>{`
        .issues-page .page-card {
          box-sizing: border-box;
        }

        .issues-page .table-scroll {
          width: 100%;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        .issues-page .styled-table {
          width: 100%;
          border-collapse: collapse;
        }

        .issues-page .styled-table td,
        .issues-page .styled-table th {
          word-break: break-word;
        }

        .issues-page .action-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .issues-page .action-buttons button {
          padding: 8px 12px;
          min-height: 40px;
          border-radius: 6px;
          cursor: pointer;
        }

        .issues-page .action-buttons button.danger {
          background: #e53e3e;
          color: #fff;
          border: none;
        }

        .issues-page .empty-state {
          padding: 16px;
          text-align: center;
          color: #666;
        }

        /* Below this width, the table becomes a stacked list of cards.
           Each <td> shows its own label (from data-label) instead of
           relying on a header row that no longer fits. */
        @media (max-width: 700px) {
          .issues-page .page-card {
            padding: 12px;
          }

          .issues-page .table-scroll {
            overflow-x: visible;
          }

          .issues-page .styled-table thead {
            display: none;
          }

          .issues-page .styled-table,
          .issues-page .styled-table tbody,
          .issues-page .styled-table tr,
          .issues-page .styled-table td {
            display: block;
            width: 100%;
          }

          .issues-page .styled-table tr {
            margin-bottom: 14px;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 8px 10px;
          }

          .issues-page .styled-table td {
            border: none;
            border-bottom: 1px solid #eee;
            padding: 8px 4px;
            text-align: left;
          }

          .issues-page .styled-table td:last-child {
            border-bottom: none;
          }

          .issues-page .styled-table td::before {
            content: attr(data-label);
            display: block;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.03em;
            color: #888;
            margin-bottom: 2px;
          }

          .issues-page .action-buttons {
            margin-top: 4px;
          }

          .issues-page .action-buttons button {
            flex: 1 1 auto;
          }
        }
      `}</style>
    </div>
  );
};

export default IssuesManager;
