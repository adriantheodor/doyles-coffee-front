import { useNavigate } from "react-router-dom";
import { useState } from "react";

const CustomerDashPage = ({ activeSection }) => {
  const navigate = useNavigate();
  const [issueText, setIssueText] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleIssueSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.REACT_APP_API_BASE}api/issues`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ description: issueText })
        }
      );

      if (!res.ok) throw new Error("Failed to submit issue.");

      setSuccessMsg("Issue submitted successfully!");
      setIssueText("");
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Customer Dashboard</h1>

      <h3>Your Options</h3>
      <ul>
        <li>
          <button onClick={() => alert("Order placement coming soon!")}>
            Place a New Order
          </button>
        </li>

        <li>
          <button onClick={() => alert("Order history coming soon!")}>
            View Past Orders
          </button>
        </li>

        <li>
          <button onClick={() => navigate("/dashboard?section=issues")}>
            View Submitted Issues
          </button>
        </li>

        <li>
          <button onClick={() => alert("Invoices UI coming soon!")}>
            View Invoices
          </button>
        </li>
      </ul>

      <hr />

      {/* ISSUE REPORTING FORM */}
      <h2>Submit an Issue</h2>

      <form onSubmit={handleIssueSubmit}>
        <textarea
          placeholder="Describe the issue..."
          value={issueText}
          onChange={(e) => setIssueText(e.target.value)}
          required
          style={{ width: "100%", height: "100px" }}
        />

        <button type="submit" style={{ marginTop: "10px" }}>
          Submit Issue
        </button>
      </form>

      {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

      <hr />

      <button onClick={handleLogout} className="logout-btn">
        Log Out
      </button>
    </div>
  );
};

export default CustomerDashPage;
