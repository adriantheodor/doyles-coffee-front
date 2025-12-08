import { useNavigate } from "react-router-dom";

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

      <h3>Your Options</h3>
      <ul>
        <li>
          <button onClick={() => navigate("/place-order")}>
            Place a New Order
          </button>
        </li>

        <li>
          <button onClick={() => alert("Order history coming soon!")}>
            View Past Orders
          </button>
        </li>

        <li>
          <button onClick={() => navigate("/submit-issue")}>
            Report an Issue
          </button>
        </li>

        <li>
          <button onClick={() => navigate("/invoices")}>View Invoices</button>
        </li>
      </ul>

      <hr />

      <button onClick={handleLogout}>Log Out</button>
      </div>
    </div>
  );
};

export default CustomerDashPage;
