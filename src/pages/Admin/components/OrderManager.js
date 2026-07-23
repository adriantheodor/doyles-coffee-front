import { useEffect, useState } from "react";
import { API_BASE } from "../../../utils/api";
import "./OrderManager.css";

const OrderManager = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await fetch(`${API_BASE}api/orders`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    const data = await res.json();
    if (Array.isArray(data)) {
      setOrders(data);
    } else {
      console.error("Order fetch error:", data);
      setOrders([]);
    }
  };

  const completeOrder = async (id) => {
    if (!window.confirm("Mark this order as complete?")) return;

    const res = await fetch(`${API_BASE}api/orders/${id}/complete`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    if (res.ok) {
      fetchOrders();
    } else {
      alert("Failed to complete order");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const activeOrders = orders.filter((o) => o.status !== "Fulfilled");
  const completedOrders = orders.filter((o) => o.status === "Fulfilled");

  const formatPrice = (value) => {
    const amount = Number(value);
    return Number.isNaN(amount) ? "0.00" : amount.toFixed(2);
  };

  const renderOrderCard = (o, isActive = false) => (
    <div key={o._id} className="order-card">
      <div className="order-card-header">
        <div>
          <p className="order-card-title">{o.customer?.name || "Unknown Customer"}</p>
          <p className="order-card-subtitle">Order ID: {o._id.slice(-6)}</p>
        </div>
        <div>
          <p className="order-card-subtitle">{o.status}</p>
          <p className="order-card-subtitle">Total: ${formatPrice(o.totalPrice)}</p>
        </div>
      </div>

      <div className="order-card-details">
        <div className="order-card-row">
          <span className="order-card-label">Items</span>
          <div className="order-card-value order-card-items">
            {o.items.map((i) => (
              <div key={i._id}>
                {i.product?.name} — Qty: {i.quantity}
              </div>
            ))}
          </div>
        </div>

        <div className="order-card-row">
          <span className="order-card-label">Notes</span>
          <span className="order-card-value">{o.notes || "—"}</span>
        </div>

        {o.fulfilledAt && (
          <div className="order-card-row">
            <span className="order-card-label">Fulfilled</span>
            <span className="order-card-value">
              {new Date(o.fulfilledAt).toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {isActive && (
        <div className="order-card-actions">
          <button className="btn" onClick={() => completeOrder(o._id)}>
            Complete
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="page-container">
      <div className="page-card order-manager-section">
        <h2 className="page-title">Orders</h2>

        <section>
          <h3>Active Orders</h3>
          {activeOrders.length === 0 ? (
            <p>No active orders.</p>
          ) : (
            <div className="table-responsive">
              <table className="order-manager-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total Price</th>
                    <th>Status</th>
                    <th>Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activeOrders.map((o) => (
                    <tr key={o._id}>
                      <td>{o.customer?.name || "Unknown"}</td>
                      <td>
                        {o.items.map((i) => (
                          <div key={i._id}>
                            {i.product?.name} — Qty: {i.quantity}
                          </div>
                        ))}
                      </td>
                      <td color="black">${formatPrice(o.totalPrice)}</td>
                      <td>{o.status}</td>
                      <td>{o.notes || "—"}</td>
                      <td>
                        <button className="btn" onClick={() => completeOrder(o._id)}>
                          Complete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="order-manager-mobile-list">
            {activeOrders.map((o) => renderOrderCard(o, true))}
          </div>
        </section>

        <section>
          <h3>Completed Orders</h3>
          {completedOrders.length === 0 ? (
            <p>No completed orders yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="order-manager-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total Price</th>
                    <th>Fulfilled At</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {completedOrders.map((o) => (
                    <tr key={o._id}>
                      <td>{o.customer?.name || "Unknown"}</td>
                      <td>
                        {o.items.map((i) => (
                          <div key={i._id}>
                            {i.product?.name} — Qty: {i.quantity}
                          </div>
                        ))}
                      </td>
                      <td>${formatPrice(o.totalPrice)}</td>
                      <td>
                        {o.fulfilledAt
                          ? new Date(o.fulfilledAt).toLocaleString()
                          : "—"}
                      </td>
                      <td>{o.notes || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="order-manager-mobile-list">
            {completedOrders.map((o) => renderOrderCard(o))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default OrderManager;
