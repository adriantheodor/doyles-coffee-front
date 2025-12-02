import React, { useState } from "react";
import { API_BASE } from "../utils/api";

const SubmitIssuePage = () => {
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    title: "",
    description: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("You must be logged in to submit an issue.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}api/issues`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
        }),
      });

      if (res.ok) {
        setMessage("Issue submitted successfully!");
        setForm({
          customerName: "",
          customerEmail: "",
          title: "",
          description: "",
        });
      } else {
        const errorData = await res.json();
        setMessage(`Failed: ${errorData.message || "Unknown Error"}`);
      }
    } catch (error) {
      console.error(error);
      setMessage("Network error occurred.");
    }
  };

  return (
    <div>
      <h1>Submit an Issue</h1>
      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <input
          name="customerName"
          placeholder="Your Name"
          value={form.customerName}
          onChange={handleChange}
          required
        />
        <br />

        <input
          name="customerEmail"
          placeholder="Your Email"
          type="email"
          value={form.customerEmail}
          onChange={handleChange}
          required
        />
        <br />

        <input
          name="title"
          placeholder="Subject"
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
  );
};

export default SubmitIssuePage;
