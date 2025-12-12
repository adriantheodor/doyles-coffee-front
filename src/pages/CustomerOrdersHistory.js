import { useEffect, useState } from "react";
import { API_BASE } from "../utils/api";
import "./CustomerOrdersHistory.css"; // optional if you want extra custom styling

const CustomerOrdersHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_BASE}api/orders/my`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      });

      const data = await res.json();

      if (Array.isArray(data)) setOrders(data);
      setLoading(false);
    } catch (err) {
      console.error("Customer order history error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p>Loading your orders...</p>;

  const activeOrders = orders.filter((o) => o.status !== "Fulfilled");
  const completedOrders = orders.filter((o) => o.status === "Fulfilled");

  return (
    <div>
      <h2>Your Orders</h2>

      {/* ------------------------------ */}
      {/* ACTIVE / PENDING ORDERS        */}
      {/* ------------------------------ */}
      <h3 style={{ marginTop: "20px" }}>Pending Orders</h3>

      {activeOrders.length === 0 && <p>No pending orders.</p>}

      {activeOrders.map((order) => (
        <div key={order._id} className="order-card">
          <strong>Order #{order._id.slice(-6)}</strong>
          <p>Status: <b>{order.status}</b></p>

          <div>
            <h4>Items:</h4>
            {order.items.map((item) => (
              <div key={item._id}>
                {item.product?.name} — Qty: {item.quantity}
              </div>
            ))}
          </div>

          <p>Total: ${order.totalPrice.toFixed(2)}</p>
        </div>
      ))}

      {/* ------------------------------ */}
      {/* COMPLETED ORDERS               */}
      {/* ------------------------------ */}
      <h3 style={{ marginTop: "30px" }}>Completed Orders</h3>

      {completedOrders.length === 0 && <p>No completed orders yet.</p>}

      {completedOrders.map((order) => (
        <div key={order._id} className="order-card complete">
          <strong>Order #{order._id.slice(-6)}</strong>
          <p>Status: <b>{order.status}</b></p>

          <div>
            <h4>Items:</h4>
            {order.items.map((item) => (
              <div key={item._id}>
                {item.product?.name} — Qty: {item.quantity}
              </div>
            ))}
          </div>

          <p>Total: ${order.totalPrice.toFixed(2)}</p>

          {/* Link invoice if it exists */}
          <a
            href={`${API_BASE}api/invoices/order/${order._id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="invoice-link"
          >
            View Invoice PDF
          </a>
        </div>
      ))}
    </div>
  );
};

export default CustomerOrdersHistory;
