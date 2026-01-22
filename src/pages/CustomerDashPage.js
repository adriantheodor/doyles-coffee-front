import { useEffect, useState } from "react";
import useToast from "../hooks/useToast";
import EmptyState from "../components/EmptyState";
import PlaceOrderPage from "./PlaceOrderPage";
import CustomerInvoices from "./InvoicesPage";
import CustomerIssueForm from "./SubmitIssuePage";
import CustomerOrdersHistory from "./CustomerOrdersHistory"; 
import { API_BASE } from "../utils/api";

const CustomerDashPage = ({ activeSection, setActiveSection }) => {
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentIssues, setRecentIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));
  const toast = useToast();

  // Fetch latest 3 orders + issues
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("accessToken");

        // Fetch orders
        const ordersRes = await fetch(`${API_BASE}api/orders/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!ordersRes.ok) {
          throw new Error(`Failed to fetch orders: ${ordersRes.status}`);
        }
        const ordersData = await ordersRes.json();
        setRecentOrders(Array.isArray(ordersData) ? ordersData.slice(0, 3) : []);

        // Fetch issues
        const issuesRes = await fetch(`${API_BASE}api/issues/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!issuesRes.ok) {
          throw new Error(`Failed to fetch issues: ${issuesRes.status}`);
        }
        const issuesData = await issuesRes.json();
        setRecentIssues(Array.isArray(issuesData) ? issuesData.slice(0, 3) : []);
      } catch (err) {
        console.error("Customer dash load error", err);
        toast.error("Failed to load dashboard data");
        setRecentOrders([]);
        setRecentIssues([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Render home screen
  const renderHome = () => {
    if (isLoading) {
      return (
        <div className="customer-home">
          <div className="welcome-header">
            <h2>Welcome back, {user?.name}!</h2>
            <p className="welcome-subtitle">Loading your dashboard...</p>
          </div>
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p style={{ fontSize: "16px", color: "#666" }}>⏳ Loading your dashboard...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="customer-home">
        {/* WELCOME HEADER */}
        <div className="welcome-header">
          <h2>Welcome back, {user?.name}!</h2>
          <p className="welcome-subtitle">Manage your orders, invoices, and account</p>
        </div>

        {/* QUICK ACTIONS */}
        <div className="quick-actions-section">
          <h3>Quick Actions</h3>
          <div className="quick-actions-grid">
            <button 
              className="quick-action-btn"
              onClick={() => setActiveSection("orders")}
              title="Place a new order"
            >
              <span className="action-icon">📦</span>
              <span className="action-text">Place Order</span>
            </button>
            <button 
              className="quick-action-btn"
              onClick={() => setActiveSection("history")}
              title="View your order history"
            >
              <span className="action-icon">📋</span>
              <span className="action-text">Order History</span>
            </button>
            <button 
              className="quick-action-btn"
              onClick={() => setActiveSection("invoices")}
              title="View your invoices"
            >
              <span className="action-icon">💰</span>
              <span className="action-text">Invoices</span>
            </button>
            <button 
              className="quick-action-btn"
              onClick={() => setActiveSection("issues")}
              title="Report an issue"
            >
              <span className="action-icon">⚠️</span>
              <span className="action-text">Report Issue</span>
            </button>
          </div>
        </div>

        {/* OVERVIEW CARDS */}
        <div className="overview-cards">
          <div className="overview-card">
            <h4>Recent Orders</h4>
            <div className="card-content">
              {recentOrders.length === 0 ? (
                <EmptyState
                  icon="📦"
                  title="No Orders Yet"
                  description="Place your first order to get started"
                  actionLabel="Place Order"
                  onAction={() => setActiveSection("orders")}
                  className="compact minimal"
                />
              ) : (
                <>
                  {recentOrders.map((o) => (
                    <div key={o._id} className="list-item">
                      <span className="order-id">Order #{o._id.slice(-6)}</span>
                      <span className="order-status" data-status={o.status}>{o.status}</span>
                    </div>
                  ))}
                  <button 
                    className="view-more-btn"
                    onClick={() => setActiveSection("history")}
                  >
                    View All Orders →
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="overview-card">
            <h4>Recent Issues</h4>
            <div className="card-content">
              {recentIssues.length === 0 ? (
                <EmptyState
                  icon="✅"
                  title="No Issues"
                  description="Great! You haven't reported any issues"
                  className="compact minimal"
                />
              ) : (
                <>
                  {recentIssues.map((issue) => (
                    <div key={issue._id} className="list-item">
                      <span className="issue-id">Issue #{issue._id.slice(-6)}</span>
                      <span className="issue-status" data-status={issue.status}>{issue.status}</span>
                    </div>
                  ))}
                  <button 
                    className="view-more-btn"
                    onClick={() => setActiveSection("issues")}
                  >
                    View All Issues →
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ACCOUNT SUMMARY */}
        <div className="section-box account-summary">
          <h3>Account Information</h3>
          <div className="account-info-grid">
            <div className="account-info-item">
              <span className="info-label">Name</span>
              <span className="info-value">{user?.name}</span>
            </div>
            <div className="account-info-item">
              <span className="info-label">Email</span>
              <span className="info-value">{user?.email}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
        return renderHome();
    }
  };

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

