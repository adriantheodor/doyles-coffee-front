// client/src/components/admin/QuoteRequestsWidget.jsx
import { useEffect, useState } from "react";
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000/";

export default function QuoteRequestsWidget() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scheduleForm, setScheduleForm] = useState(null);

  // Fetch all quote requests
  const fetchRequests = async () => {
    setLoading(true);
    const res = await fetch(`${API_BASE}api/quotes`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    if (res.ok) {
      const data = await res.json();
      setRequests(data);
    }
    setLoading(false);
  };

  const markCompleted = async (id) => {
    const res = await fetch(`${API_BASE}api/quotes/${id}/complete`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      fetchRequests();
    } else {
      alert("Could not mark quote as completed.");
    }
  };

  const deleteRequest = async (id) => {
    if (!window.confirm("Are you sure you want to delete this quote request?"))
      return;

    const res = await fetch(`${API_BASE}api/quotes/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    if (res.ok) {
      fetchRequests();
    } else {
      alert("Failed to delete request.");
    }
  };

  // Schedule a meeting and trigger backend email notifications
  const confirmSchedule = async () => {
    if (!scheduleForm?.scheduledDate) {
      return alert("Please select a date and time.");
    }

    const res = await fetch(
      `${API_BASE}api/quotes/${scheduleForm._id}/schedule`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          dateTime: scheduleForm.scheduledDate,
          notes: scheduleForm.adminNotes || "",
        }),
      }
    );

    if (res.ok) {
      alert("Meeting scheduled and emails sent!");
      setScheduleForm(null);
      fetchRequests();
    } else {
      alert("Failed to schedule meeting.");
    }
  };

  // Simple status updates (contacted/closed)
  const updateStatus = async (id, status) => {
    const res = await fetch(`${API_BASE}api/quotes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ status }),
    });
    if (res.ok) fetchRequests();
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) return <p>Loading quote requests…</p>;

  return (
    <section
      style={{ border: "1px solid #ddd", borderRadius: 8, padding: "1rem" }}
    >
      <h2>Quote Requests</h2>
      {requests.length === 0 && <p>No requests yet.</p>}

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {requests.map((r) => (
          <li
            key={r._id}
            style={{
              marginBottom: "1rem",
              padding: "0.5rem",
              borderBottom: "1px solid #eee",
            }}
          >
            <strong>{r.companyName}</strong> — {r.contactName} ({r.email}) (
            {r.phone})<p>Services: {r.services.join(", ")}</p>
            <p>
              Status: <em>{r.status}</em>
            </p>
            {r.status === "scheduled" && r.meetingDate && (
              <p>📅 Scheduled: {new Date(r.meetingDate).toLocaleString()}</p>
            )}
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button onClick={() => updateStatus(r._id, "contacted")}>
                Mark Contacted
              </button>

              <button onClick={() => setScheduleForm(r)}>
                Schedule Meeting
              </button>

              <button onClick={() => updateStatus(r._id, "closed")}>
                Mark Closed
              </button>

              <button
                style={{ backgroundColor: "#4caf50", color: "white" }}
                onClick={() => markCompleted(r._id)}
              >
                Mark Completed
              </button>

              <button
                style={{ backgroundColor: "#c0392b", color: "white" }}
                onClick={() => deleteRequest(r._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Scheduling Form */}
      {scheduleForm && (
        <div
          style={{
            marginTop: "1rem",
            borderTop: "1px solid #ccc",
            paddingTop: "1rem",
          }}
        >
          <h3>Schedule Quote for {scheduleForm.contactName}</h3>
          <label>
            Date/Time:{" "}
            <input
              type="datetime-local"
              onChange={(e) =>
                setScheduleForm({
                  ...scheduleForm,
                  scheduledDate: e.target.value,
                })
              }
            />
          </label>
          <br />
          <br />
          <label>
            Notes:{" "}
            <textarea
              rows={3}
              placeholder="Optional notes for this meeting"
              onChange={(e) =>
                setScheduleForm({ ...scheduleForm, adminNotes: e.target.value })
              }
            />
          </label>
          <div style={{ marginTop: "0.5rem" }}>
            <button onClick={confirmSchedule}>Confirm Schedule</button>
            <button onClick={() => setScheduleForm(null)}>Cancel</button>
          </div>
        </div>
      )}
    </section>
  );
}
