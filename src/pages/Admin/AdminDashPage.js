import { useEffect, useState } from "react";
import AdminOverview from "./components/AdminOverview";
import InventoryManager from "./components/InventoryManager";
import OrderManager from "./components/OrderManager";
import IssueManager from "./components/IssuesManager";
import InvoiceManager from "./components/InvoiceManager";
import QRCodeGenerator from "./components/QRCodeGenerator";
import QuoteRequestsWidget from "./QuoteRequestsWidget";

import { API_BASE } from "../../utils/api";
import "./AdminDashPage.css";

const AdminDashPage = ({ activeSection, setActiveSection }) => {
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentIssues, setRecentIssues] = useState([]);
  const [metrics, setMetrics] = useState({});

  const fetchDashboardData = async () => {
    const token = localStorage.getItem("token");

    const orderRes = await fetch(`${API_BASE}api/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const orders = await orderRes.json();

    setRecentOrders(
      orders
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
    );

    const issueRes = await fetch(`${API_BASE}api/issues`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const issues = await issueRes.json();

    setRecentIssues(issues.slice(0, 4));

    setMetrics({
      totalOrders: orders.length,
      pendingOrders: orders.filter((o) => o.status !== "Fulfilled").length,
      fulfilledOrders: orders.filter((o) => o.status === "Fulfilled").length,
      openIssues: issues.filter((i) => i.status !== "Resolved").length,
    });
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <AdminOverview />;
      case "inventory":
        return <InventoryManager />;
      case "orders":
        return <OrderManager />;
      case "issues":
        return <IssueManager />;
      case "invoices":
        return <InvoiceManager />;
      case "qrcodes":
        return <QRCodeGenerator />;
      case "quotes":
        return <QuoteRequestsWidget />;
      default:
        return (
          <div className="dash-home">
            <h2 className="section-title">Admin Overview</h2>

            <div className="quick-links">
              <button onClick={() => setActiveSection("orders")}>📦 Manage Orders</button>
              <button onClick={() => setActiveSection("inventory")}>🏷 Inventory</button>
              <button onClick={() => setActiveSection("invoices")}>🧾 Invoices</button>
              <button onClick={() => setActiveSection("issues")}>⚠️ Issues</button>
              <button onClick={() => setActiveSection("quotes")}>🗂 Quote Requests</button>
              <button onClick={() => setActiveSection("qrcodes")}>🔳 QR Codes</button>
            </div>

            <div className="metrics-row">
              <div className="metric-card">Total Orders: {metrics.totalOrders}</div>
              <div className="metric-card">Pending Orders: {metrics.pendingOrders}</div>
              <div className="metric-card">Fulfilled Orders: {metrics.fulfilledOrders}</div>
              <div className="metric-card">Open Issues: {metrics.openIssues}</div>
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