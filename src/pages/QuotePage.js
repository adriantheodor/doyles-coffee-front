
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useToast from "../hooks/useToast";
import QuoteConfirmation from "./QuoteConfirmation";

export default function QuotePage() {
  const navigate = useNavigate();
  const toast = useToast();
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
    try {
      const res = await fetch(`${API_BASE}api/quotes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      
      if (res.ok) {
        const data = await res.json();
        // Navigate to confirmation with quote data
        navigate("/quote-confirmation", { 
          state: { 
            quoteData: form, 
            quoteId: data.id || data._id 
          },
          replace: true
        });
      } else {
        const msg = "There was an issue submitting your request.";
        toast.error(msg);
      }
    } catch (error) {
      const msg = "Error submitting quote: " + error.message;
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mobile-container mobile-stack"
    >
      <h1>Request a Quote</h1>

      {/* 1. Single Input: Company Name (NO GRID WRAPPER NEEDED) */}
      <input
        required
        placeholder="Company Name"
        value={form.companyName}
        onChange={(e) => setForm({ ...form, companyName: e.target.value })}
      />

      {/* 2. Paired Inputs: Contact Name / Email (USES GRID) */}
      <div className="form-row-responsive">
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

      {/* 3. Paired Inputs: Phone / Address (USES GRID) */}
      <div className="form-row-responsive">
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

      {/* 4. Single Input: Approx. Headcount (NO GRID WRAPPER NEEDED) */}
      <input
        placeholder="Approx. Headcount"
        value={form.headcount}
        onChange={(e) => setForm({ ...form, headcount: e.target.value })}
      />

      {/* 5. Services Fieldset (KEEP AS IS, IT'S FULL WIDTH) */}
      <fieldset
        style={{ border: "1px solid #ddd", borderRadius: 8, padding: "1rem" }}
      >
        <legend>Services</legend>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem 0" }}>
          {[
            "Coffee & Tea",
            "Water",
            "Snacks/Pantry",
            "Paper Goods"
          ].map((s) => (
            <label
              key={s}
              style={{
                display: "flex",
                gap: 8,
                width: "50%",
                minWidth: "150px",
              }}
            >
              <input
                type="checkbox"
                checked={form.services.includes(s)}
                onChange={() => toggleService(s)}
              />{" "}
              {s}
            </label>
          ))}
        </div>
      </fieldset>

      {/* 6. Textarea and Button (NO GRID WRAPPER NEEDED) */}
      <textarea
        rows={4}
        placeholder="Notes…"
        value={form.notes}
        onChange={(e) => setForm({ ...form, notes: e.target.value })}
      />
      <button disabled={loading}>
        {loading ? "Submitting…" : "Submit Request"}
      </button>
    </form>
  );
}
