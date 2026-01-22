import React, { useState } from "react";
import useToast from "../hooks/useToast";
import { API_BASE } from "../utils/api";

const SubmitIssuePage = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  const [message, setMessage] = useState("");
  const toast = useToast();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API_BASE}api/issues`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // ★ REQUIRED
      },
      body: JSON.stringify({
        title: form.title,
        description: form.description,
      }),
    });

    if (res.ok) {
      const msg = "Issue submitted successfully!";
      setMessage(msg);
      toast.success(msg);
      setForm({ title: "", description: "" });
    } else {
      const msg = "Failed to submit issue.";
      setMessage(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="page-container mobile-container">
      <div className="page-card">
        <h1 className="page-title">Submit an Issue</h1>
        {message && <p className="message-box" role="alert">{message}</p>}

        <form onSubmit={handleSubmit} className="mobile-stack">
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            className="form-input"
            required
          />

          <textarea
            name="description"
            placeholder="Describe the issue"
            value={form.description}
            onChange={handleChange}
            className="form-input"
            required
          />

          <button type="submit" className="mobile-fullwidth-button">Submit Issue</button>
        </form>
      </div>
    </div>
  );
};

export default SubmitIssuePage;
