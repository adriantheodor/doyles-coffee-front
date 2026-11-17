
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useToast from "../hooks/useToast";
import "./QuoteRequestPage.css";

export default function QuotePage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [fieldErrors, setFieldErrors] = useState({});
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

  const fieldLabels = {
    companyName: "Company name",
    contactName: "Contact name",
    email: "Email address",
    phone: "Phone number",
  };

  const validateField = (name, value, validity) => {
    if (name !== "email" && !value.trim()) {
      return `Please enter your ${fieldLabels[name].toLowerCase()}.`;
    }
    if (name === "email") {
      if (!value.trim()) return "Please enter your email address.";
      if (!validity.valid) {
        return "Enter a valid email address (for example, name@example.com).";
      }
    }
    return "";
  };

  const handleFieldChange = (event) => {
    const { name, value, validity } = event.target;
    setForm((current) => ({ ...current, [name]: value }));

    if (fieldErrors[name]) {
      const error = validateField(name, value, validity);
      setFieldErrors((current) => ({ ...current, [name]: error }));
    }
  };

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

    const fields = e.currentTarget.elements;
    const errors = Object.keys(fieldLabels).reduce((result, name) => {
      const error = validateField(name, form[name], fields[name].validity);
      if (error) result[name] = error;
      return result;
    }, {});
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      fields[Object.keys(errors)[0]].focus();
      return;
    }

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
      noValidate
      className="mobile-container mobile-stack quote-request-form"
    >
      <h1>Request a Quote</h1>

      {Object.keys(fieldErrors).length > 0 && (
        <div className="quote-validation-summary" role="alert" aria-live="assertive">
          <h2>Please check your information</h2>
          <p>We need a few corrections before we can send your request:</p>
          <ul>
            {Object.entries(fieldErrors).map(([name, message]) => (
              <li key={name}>
                <a href={`#quote-${name}`}>{fieldLabels[name]}: {message}</a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <label className="quote-field">
        <span className="quote-field-label">
          Company name <span className="quote-required-marker" aria-hidden="true">*</span>
        </span>
        <span className="quote-field-hint">(required)</span>
        <input
          id="quote-companyName"
          name="companyName"
          required
          aria-invalid={Boolean(fieldErrors.companyName)}
          aria-describedby={fieldErrors.companyName ? "quote-companyName-error" : undefined}
          value={form.companyName}
          onChange={handleFieldChange}
        />
        {fieldErrors.companyName && (
          <span id="quote-companyName-error" className="quote-field-error">
            {fieldErrors.companyName}
          </span>
        )}
      </label>

      <div className="form-row-responsive">
        <label className="quote-field">
          <span className="quote-field-label">
            Contact name <span className="quote-required-marker" aria-hidden="true">*</span>
          </span>
          <span className="quote-field-hint">(required)</span>
          <input
            id="quote-contactName"
            name="contactName"
            required
            aria-invalid={Boolean(fieldErrors.contactName)}
            aria-describedby={fieldErrors.contactName ? "quote-contactName-error" : undefined}
            value={form.contactName}
            onChange={handleFieldChange}
          />
          {fieldErrors.contactName && (
            <span id="quote-contactName-error" className="quote-field-error">
              {fieldErrors.contactName}
            </span>
          )}
        </label>
        <label className="quote-field">
          <span className="quote-field-label">
            Email address <span className="quote-required-marker" aria-hidden="true">*</span>
          </span>
          <span className="quote-field-hint">(required)</span>
          <input
            id="quote-email"
            name="email"
            required
            type="email"
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? "quote-email-error" : undefined}
            value={form.email}
            onChange={handleFieldChange}
          />
          {fieldErrors.email && (
            <span id="quote-email-error" className="quote-field-error">
              {fieldErrors.email}
            </span>
          )}
        </label>
      </div>

      <div className="form-row-responsive">
        <label className="quote-field">
          <span className="quote-field-label">
            Phone number <span className="quote-required-marker" aria-hidden="true">*</span>
          </span>
          <span className="quote-field-hint">(required)</span>
          <input
            id="quote-phone"
            name="phone"
            required
            aria-invalid={Boolean(fieldErrors.phone)}
            aria-describedby={fieldErrors.phone ? "quote-phone-error" : undefined}
            value={form.phone}
            onChange={handleFieldChange}
          />
          {fieldErrors.phone && (
            <span id="quote-phone-error" className="quote-field-error">
              {fieldErrors.phone}
            </span>
          )}
        </label>
        <label className="quote-field">
          <span className="quote-field-label">Office address</span>
          <span className="quote-field-hint">(optional)</span>
          <input
            name="address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        </label>
      </div>

      <label className="quote-field">
        <span className="quote-field-label">Approx. headcount</span>
        <span className="quote-field-hint">(optional)</span>
        <input
          name="headcount"
          value={form.headcount}
          onChange={(e) => setForm({ ...form, headcount: e.target.value })}
        />
      </label>

      {/* 5. Services Fieldset (KEEP AS IS, IT'S FULL WIDTH) */}
      <fieldset
        style={{ border: "1px solid #ddd", borderRadius: 8, padding: "1rem" }}
      >
        <legend
        style={{color:"white"}}
        >Services</legend>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem 0", color:"white" }}>
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

      <label className="quote-field">
        <span className="quote-field-label">Notes</span>
        <span className="quote-field-hint">(optional)</span>
        <textarea
          name="notes"
          rows={4}
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
      </label>
      <button disabled={loading}>
        {loading ? "Submitting…" : "Submit Request"}
      </button>
    </form>
  );
}
