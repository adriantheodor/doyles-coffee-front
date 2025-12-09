import { useNavigate } from "react-router-dom";
import "./CustomerDashPage.css"; // <-- You will make this (styles below)

const CustomerDashPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="page-container">
      <div className="page-card">
        <h1 className="page-title">Customer Dashboard</h1>

        <div className="dash-section">
          <h2 className="dash-subtitle">Your Options</h2>

          <div className="dash-button-list">
            <button
              className="dash-btn"
              onClick={() => navigate("/place-order")}
            >
              🛒 Place a New Order
            </button>

            <button
              className="dash-btn"
              onClick={() => alert("Order history coming soon!")}
            >
              📦 View Past Orders
            </button>

            <button
              className="dash-btn"
              onClick={() => navigate("/submit-issue")}
            >
              ⚠️ Report an Issue
            </button>

            <button className="dash-btn" onClick={() => navigate("/invoices")}>
              🧾 View Invoices
            </button>
          </div>
        </div>

        <hr className="dash-divider" />

        <button className="logout-btn" onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </div>
  );
};

export default CustomerDashPage;
