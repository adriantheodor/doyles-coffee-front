import React, { useState } from "react";
import { API_BASE } from "../utils/api";

const SubmitIssuePage = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  const [message, setMessage] = useState("");

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
      setMessage("Issue submitted successfully!");
      setForm({ title: "", description: "" });
    } else {
      setMessage("Failed to submit issue.");
    }
  };

  return (
    <div className="page-container">
      <div className="page-card">
        <h1 className="page-title">Submit an Issue</h1>
        {message && <p>{message}</p>}

        <form onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <br />

          <textarea
            name="description"
            placeholder="Describe the issue"
            value={form.description}
            onChange={handleChange}
            required
          />

          <br />

          <button type="submit">Submit Issue</button>
        </form>
      </div>
    </div>
  );
};

export default SubmitIssuePage;
