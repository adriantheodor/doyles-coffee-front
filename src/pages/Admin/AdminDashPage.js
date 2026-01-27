import { useEffect, useState } from "react";
import AdminOverview from "./components/AdminOverview";
import AdminManager from "./components/AdminManager";
import AdminInventoryPage from "./AdminInventoryPage";
import OrderManager from "./components/OrderManager";
import IssueManager from "./components/IssuesManager";
import InvoiceManager from "./components/InvoiceManager";
import QRCodeGenerator from "./components/QRCodeGenerator";
import AuditLogsManager from "./components/AuditLogsManager";
import QuoteRequestsWidget from "./QuoteRequestsWidget";

import { API_BASE } from "../../utils/api";
import "./AdminDashPage.css";

const AdminDashPage = ({ activeSection, setActiveSection }) => {
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentIssues, setRecentIssues] = useState([]);
  const [metrics, setMetrics] = useState({});

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const orderRes = await fetch(`${API_BASE}api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!orderRes.ok) {
        throw new Error(`Failed to fetch orders: ${orderRes.status}`);
      }
      const orders = await orderRes.json();

      setRecentOrders(
        Array.isArray(orders)
          ? orders
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 5)
          : []
      );

      const issueRes = await fetch(`${API_BASE}api/issues`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!issueRes.ok) {
        throw new Error(`Failed to fetch issues: ${issueRes.status}`);
      }
      const issues = await issueRes.json();

      setRecentIssues(Array.isArray(issues) ? issues.slice(0, 4) : []);

      setMetrics({
        totalOrders: Array.isArray(orders) ? orders.length : 0,
        pendingOrders: Array.isArray(orders) ? orders.filter((o) => o.status !== "Fulfilled").length : 0,
        fulfilledOrders: Array.isArray(orders) ? orders.filter((o) => o.status === "Fulfilled").length : 0,
        openIssues: Array.isArray(issues) ? issues.filter((i) => i.status !== "Resolved").length : 0,
      });
    } catch (err) {
      console.error("Admin dashboard fetch error:", err);
      setRecentOrders([]);
      setRecentIssues([]);
      setMetrics({
        totalOrders: 0,
        pendingOrders: 0,
        fulfilledOrders: 0,
        openIssues: 0,
      });
    } finally {
      // Dashboard data loaded
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return (
          <AdminOverview
            metrics={metrics}
            recentOrders={recentOrders}
            recentIssues={recentIssues}
            setActiveSection={setActiveSection}
          />
        );

      case "inventory":
        return <AdminInventoryPage />;
      case "orders":
        return <OrderManager />;
      case "issues":
        return <IssueManager />;
      case "users":
        return <AdminManager />;
      case "invoices":
        return <InvoiceManager />;
      case "qrcodes":
        return <QRCodeGenerator />;
      case "quotes":
        return <QuoteRequestsWidget />;
      case "audit":
        return <AuditLogsManager />;
      default:
        return (
          <div className="dash-home">
            <h2 className="section-title">Admin Overview</h2>

            <div className="quick-links">
              <button onClick={() => setActiveSection("orders")}>
                📦 Manage Orders
              </button>
              <button onClick={() => setActiveSection("inventory")}>
                🏷 Inventory
              </button>
              <button onClick={() => setActiveSection("invoices")}>
                🧾 Invoices
              </button>
              <button onClick={() => setActiveSection("issues")}>
                ⚠️ Issues
              </button>
              <button onClick={() => setActiveSection("users")}>
                👥 Manage Admins
              </button>
              <button onClick={() => setActiveSection("quotes")}>
                🗂 Quote Requests
              </button>
              <button onClick={() => setActiveSection("qrcodes")}>
                🔳 QR Codes
              </button>
              <button onClick={() => setActiveSection("audit")}>
                📋 Audit Logs
              </button>
            </div>

            <div className="metrics-row">
              <div className="metric-card">
                Total Orders: {metrics.totalOrders}
              </div>
              <div className="metric-card">
                Pending Orders: {metrics.pendingOrders}
              </div>
              <div className="metric-card">
                Fulfilled Orders: {metrics.fulfilledOrders}
              </div>
              <div className="metric-card">
                Open Issues: {metrics.openIssues}
              </div>
            </div>

            <h3 className="sub-title">Recent Orders</h3>
            <table className="recent-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o._id}>
                    <td>{o._id.slice(-6)}</td>
                    <td>{o.customer?.name}</td>
                    <td>{o.status}</td>
                    <td>${o.totalPrice.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
        </table>

        <h3 className="sub-title">Recent Issues</h3>
            <ul className="issue-list">
              {recentIssues.map((issue) => (
                <li key={issue._id}>
                  <strong>{issue.subject}</strong> — {issue.status}
                </li>
              ))}
            </ul>
          </div>
        );
    }
  };

  return (
    <div className="page-container">
      <div className="page-card admin-card">
        <h1 className="page-title">Admin Dashboard</h1>
        {renderSection()}
      </div>
    </div>
  );
};

export default AdminDashPage;
