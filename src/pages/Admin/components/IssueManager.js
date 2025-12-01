import React, { useEffect, useState } from "react";
import { API_BASE } from "../../../utils/api";

const IssueManager = () => {
  const [issues, setIssues] = useState([]);

  const loadIssues = async () => {
    const res = await fetch(`${API_BASE}api/issues`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();
    setIssues(data);
  };

  const resolveIssue = async (id) => {
    await fetch(`${API_BASE}api/issues/${id}/resolve`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    loadIssues();
  };

  const deleteIssue = async (id) => {
    if (!window.confirm("Delete this issue?")) return;

    await fetch(`${API_BASE}api/issues/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    loadIssues();
  };

  useEffect(() => {
    loadIssues();
  }, []);

  return (
    <div>
      <h2>Issue Reports</h2>

      <table border="1" cellPadding={10} style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Email</th>
            <th>Subject</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {issues.map((i) => (
            <tr key={i._id}>
              <td>{i.customerName}</td>
              <td>{i.customerEmail}</td>
              <td>{i.subject}</td>
              <td>{i.description}</td>
              <td>{i.status}</td>
              <td>
                {i.status === "open" && (
                  <button onClick={() => resolveIssue(i._id)}>Resolve</button>
                )}
                <button onClick={() => deleteIssue(i._id)} style={{ marginLeft: "8px" }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IssueManager;