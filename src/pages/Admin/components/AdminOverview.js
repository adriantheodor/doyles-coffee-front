const AdminOverview = ({ metrics, recentOrders, recentIssues, setActiveSection }) => {
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
};