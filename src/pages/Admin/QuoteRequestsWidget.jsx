// client/src/components/admin/QuoteRequestsWidget.jsx
import { useEffect, useState } from "react";
import { api } from "../../utils/api";

export default function QuoteRequestsWidget() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scheduleForm, setScheduleForm] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get("api/quotes", {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });
      setRequests(res.data);
    } catch (err) {
      console.error("Failed to fetch requests:", err);
    }
    setLoading(false);
  };

  const markCompleted = async (id) => {
    try {
      await api.put(
        `api/quotes/${id}/complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      fetchRequests(); // refresh list
    } catch (err) {
      console.error("Error marking completed:", err);
      alert("Could not mark quote as completed.");
    }
  };

  const deleteRequest = async (id) => {
    if (!window.confirm("Are you sure you want to delete this quote request?"))
      return;

    try {
      await api.delete(`api/quotes/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });

      fetchRequests();
    } catch (err) {
      alert("Failed to delete request.");
    }
  };

  // Schedule a meeting and trigger backend email notifications
  const confirmSchedule = async () => {
    if (!scheduleForm?.scheduledDate) {
      return alert("Please select a date and time.");
    }

    try {
      await api.put(
        `api/quotes/${scheduleForm._id}/schedule`,
        {
          dateTime: scheduleForm.scheduledDate,
          notes: scheduleForm.adminNotes || "",
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        }
      );

      alert("Meeting scheduled and emails sent!");
      setScheduleForm(null);
      fetchRequests();
    } catch (err) {
      alert("Failed to schedule meeting.");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(
        `api/quotes/${id}`,
        { status },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        }
      );
      fetchRequests();
    } catch (err) {
      console.error("Error updating status:", err);
    }
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
        {requests.map((r) => {
          const createdAt = new Date(r.timestamp || r.createdAt);
          const createdLabel = Number.isNaN(createdAt.getTime())
            ? "Unknown"
            : createdAt.toLocaleString([], {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              });

          return (
            <li
              key={r._id}
              style={{
                marginBottom: "1rem",
                padding: "0rem",
                borderBottom: "1px solid #eee",
              }}
            >
              <strong>{r.companyName}</strong> — {r.contactName} ({r.email}) (
              {r.phone})
              <p style={{ fontSize: "0.9rem", color: "#0b0b0b" }}>
                Created: {createdLabel}
              </p>
              <p style={{ fontSize: "0.9rem", color: "#0b0b0b" }}>
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
          );
        })}
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
