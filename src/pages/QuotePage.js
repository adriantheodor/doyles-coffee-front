// client/src/pages/QuoteRequestPage.jsx
import { useState } from "react";

export default function QuotePage() {
  const [form, setForm] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    address: "",
    headcount: "",
    services: [],
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleService = (val) => {
    setForm((f) => ({
      ...f,
      services: f.services.includes(val)
        ? f.services.filter((s) => s !== val)
        : [...f.services, val],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";
    const res = await fetch(`${API_BASE}api/quotes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) setSubmitted(true);
    else alert("There was an issue submitting your request.");
  };

  if (submitted) {
    return (
      <div style={{ padding: "2rem" }}>
        <h2>Thanks! 🎉</h2>
        <p>We’ll reach out to schedule your quote.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: 720,
        margin: "2rem auto",
        display: "grid",
        gap: "1rem",
      }}
    >
      <h1>Request a Quote</h1>
      <input
        required
        placeholder="Company Name"
        value={form.companyName}
        onChange={(e) => setForm({ ...form, companyName: e.target.value })}
      />
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
      >
        <input
          required
          placeholder="Contact Name"
          value={form.contactName}
          onChange={(e) => setForm({ ...form, contactName: e.target.value })}
        />
        <input
          required
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
      >
        <input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <input
          placeholder="Office Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
      </div>
      <input
        placeholder="Approx. Headcount"
        value={form.headcount}
        onChange={(e) => setForm({ ...form, headcount: e.target.value })}
      />

      <fieldset
        style={{ border: "1px solid #ddd", borderRadius: 8, padding: "1rem" }}
      >
        <legend>Interested Services</legend>
        {[
          "Coffee & Tea",
          "Water",
          "Snacks/Pantry",
          "Paper Goods",
          "Equipment Lease",
          "Maintenance Only",
        ].map((s) => (
          <label
            key={s}
            style={{ display: "inline-flex", gap: 8, marginRight: 16 }}
          >
            <input
              type="checkbox"
              checked={form.services.includes(s)}
              onChange={() => toggleService(s)}
            />{" "}
            {s}
          </label>
        ))}
      </fieldset>

      <textarea
        rows={4}
        placeholder="Notes or current pain points…"
        value={form.notes}
        onChange={(e) => setForm({ ...form, notes: e.target.value })}
      />

      <button disabled={loading}>
        {loading ? "Submitting…" : "Submit Request"}
      </button>
    </form>
  );
}
