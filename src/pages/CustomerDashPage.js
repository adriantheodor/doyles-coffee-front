import { useEffect, useState } from "react";
import PlaceOrderPage from "./PlaceOrderPage";
import CustomerInvoices from "./InvoicesPage";
import CustomerIssueForm from "./SubmitIssuePage";
import CustomerOrdersHistory from "./CustomerOrdersHistory"; 
import { API_BASE } from "../utils/api";

const CustomerDashPage = ({ activeSection, setActiveSection }) => {
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentIssues, setRecentIssues] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch latest 3 orders + issues
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch orders
        const ordersRes = await fetch(`${API_BASE}api/orders/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const ordersData = await ordersRes.json();
        setRecentOrders(ordersData.slice(0, 3));

        // Fetch issues
        const issuesRes = await fetch(`${API_BASE}api/issues/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const issuesData = await issuesRes.json();
        setRecentIssues(issuesData.slice(0, 3));
      } catch (err) {
        console.error("Customer dash load error", err);
      }
    };

    fetchData();
  }, []);

  // Decide which page to show
  const renderSection = () => {
    switch (activeSection) {
      case "orders":
        return <PlaceOrderPage />;

      case "history":
        return <CustomerOrdersHistory />;

      case "issues":
        return <CustomerIssueForm />;

      case "invoices":
        return <CustomerInvoices />;

      default:
        return renderHome(); // NEW: home screen
    }
  };

  // ----------------------------
  // CUSTOMER HOME DASH SECTION
  // ----------------------------
  const renderHome = () => (
    <div className="customer-home">
      <h2 style={{ color: "var(--brand-green)" }}>
        Welcome back, {user?.name}!
      </h2>

      
      {/* RECENT ORDERS */}
      <div className="section-box">
        <h3>Recent Orders</h3>
        {recentOrders.length === 0 ? (
          <p>No recent orders.</p>
        ) : (
          recentOrders.map((o) => (
            <div key={o._id} className="list-item">
              <strong>Order #{o._id.slice(-6)}</strong> — {o.status}
            </div>
          ))
        )}
      </div>

      {/* RECENT ISSUES */}
      <div className="section-box">
        <h3>Your Recent Issues</h3>
        {recentIssues.length === 0 ? (
          <p>No issues reported.</p>
        ) : (
          recentIssues.map((issue) => (
            <div key={issue._id} className="list-item">
              Issue #{issue._id.slice(-6)} — {issue.status}
            </div>
          ))
        )}
      </div>

      {/* ACCOUNT SUMMARY */}
      <div className="section-box">
        <h3>Your Account Info</h3>
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
      </div>
    </div>
  );

  return (
    <div className="page-container">
      <div className="page-card">
        <h1 className="page-title">Customer Dashboard</h1>
        {renderSection()}
      </div>
    </div>
  );
};

export default CustomerDashPage;

