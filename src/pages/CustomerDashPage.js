import { useNavigate } from "react-router-dom";

const CustomerDashPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Customer Dashboard</h1>

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
          <button onClick={() => alert("Invoices UI coming soon!")}>
            View Invoices
          </button>
        </li>
      </ul>

      <hr />

      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
};

export default CustomerDashPage;
