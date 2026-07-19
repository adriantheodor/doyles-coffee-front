import React, { useMemo, useState } from "react";
import useToast from "../hooks/useToast";
import pic17 from "../assets/pic17.jpeg";
import { API_BASE } from "../utils/api";
import "./DeliveryRequestPage.css";

const initialForm = {
  companyName: "",
  jugCount: "",
  deliveryDate: "",
  notes: "",
};

const toInputDateValue = (date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function DeliveryRequestPage() {
  const [form, setForm] = useState(initialForm);
  const [dateError, setDateError] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const minDeliveryDate = useMemo(() => {
    const minDate = new Date();
    minDate.setHours(minDate.getHours() + 48);
    return toInputDateValue(minDate);
  }, []);

  const validateDeliveryDate = (value) => {
    if (!value) {
      return "";
    }

    const selectedDate = new Date(`${value}T12:00:00`);
    const earliestAllowed = new Date();
    earliestAllowed.setHours(earliestAllowed.getHours() + 48);

    if (selectedDate < earliestAllowed) {
      return "Requested delivery date must be at least 48 hours out.";
    }

    if (selectedDate.getDay() === 0 || selectedDate.getDay() === 6) {
      return "Requested delivery date must fall on a weekday.";
    }

    return "";
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (name === "deliveryDate") {
      setDateError(validateDeliveryDate(value));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validateDeliveryDate(form.deliveryDate);

    if (validationError) {
      setDateError(validationError);
      toast.error(validationError);
      return;
    }

    if (!form.companyName.trim()) {
      const message = "Please enter a company name or account identifier.";
      setSubmitMessage(message);
      toast.warning(message);
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const response = await fetch(`${API_BASE}api/on-demand-orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName: form.companyName.trim(),
          jugCount: form.jugCount ? Number(form.jugCount) : undefined,
          deliveryDate: form.deliveryDate,
          notes: form.notes.trim(),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorMessage = data.message || "Unable to submit your request right now.";
        setSubmitMessage(errorMessage);
        toast.error(errorMessage);
        return;
      }

      const successMessage = "Request received. We’ll review your delivery request and follow up shortly.";
      setSubmitMessage(successMessage);
      toast.success(successMessage);
      setForm(initialForm);
      setDateError("");
    } catch (error) {
      const message = error.message || "Unable to submit your request right now.";
      setSubmitMessage(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container delivery-request-page">
      <div className="page-card delivery-request-card">
        <div className="delivery-request-hero">
          <div className="delivery-request-header">
            <p className="eyebrow">Jug delivery request</p>
            <h1 className="page-title">Request Jug Delivery</h1>
            <p className="subtitle">
              Share the delivery details and we’ll prepare the right service for your account.
            </p>
          </div>
          <div className="delivery-request-visual" aria-hidden="true">
            <img src={pic17} alt="" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="delivery-request-form">
          <label className="form-field" htmlFor="companyName">
            <span>Company name / account identifier</span>
            <input
              id="companyName"
              name="companyName"
              type="text"
              value={form.companyName}
              onChange={handleChange}
              placeholder="Acme Office"
              required
            />
          </label>

          <label className="form-field" htmlFor="jugCount">
            <span>Number of jugs requested</span>
            <input
              id="jugCount"
              name="jugCount"
              type="number"
              value={form.jugCount}
              onChange={handleChange}
              placeholder="e.g. 12"
            />
          </label>

          <label className="form-field" htmlFor="deliveryDate">
            <span>Requested delivery date</span>
            <input
              id="deliveryDate"
              name="deliveryDate"
              type="date"
              min={minDeliveryDate}
              value={form.deliveryDate}
              onChange={handleChange}
            />
            {dateError && <small className="field-error">{dateError}</small>}
          </label>

          <label className="form-field full-width" htmlFor="notes">
            <span>Optional notes</span>
            <textarea
              id="notes"
              name="notes"
              rows="4"
              value={form.notes}
              onChange={handleChange}
              placeholder="Let us know if there are access instructions, preferred drop-off location, or other details."
            />
          </label>

          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? "Submitting…" : "$6.99 flat delivery fee + your standard per-bottle rate"}
          </button>

          <p className="delivery-notice">
            On-demand delivery notice: The $6.99 fee applies only to on-demand requests submitted through this page. Your regular scheduled deliveries remain fee-free, unless a different arrangement has been made in advance. On-demand requests require at least 48 hours’ notice and are fulfilled during normal business hours, Monday through Friday.
          </p>

          {submitMessage && <p className="submit-message">{submitMessage}</p>}
        </form>
      </div>
    </div>
  );
}
