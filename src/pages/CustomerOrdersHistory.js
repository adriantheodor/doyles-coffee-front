import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useToast from "../hooks/useToast";
import EmptyState from "../components/EmptyState";
import { API_BASE } from "../utils/api";
import "./CustomerOrdersHistory.css"; // optional if you want extra custom styling

const CustomerOrdersHistory = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

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
      toast.error("Failed to load orders");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <div className="mobile-container"><p className="text-center">Loading your orders...</p></div>;

  const activeOrders = orders.filter((o) => o.status !== "Fulfilled");
  const completedOrders = orders.filter((o) => o.status === "Fulfilled");

  const handleOrderClick = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  return (
    <div className="mobile-container">
      <h2>Your Orders</h2>

      {/* ACTIVE / PENDING ORDERS */}
      <h3 style={{ marginTop: "20px" }}>Pending Orders</h3>

      {activeOrders.length === 0 ? (
        <EmptyState
          icon="📦"
          title="No Pending Orders"
          description="You haven't placed any orders yet. Start now to track your delivery!"
          actionLabel="Place an Order"
          onAction={() => window.location.href = '/place-order'}
        />
      ) : (
        activeOrders.map((order) => (
        <div key={order._id} className="order-card" onClick={() => handleOrderClick(order._id)} style={{ cursor: "pointer" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
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
            <button className="btn-view-details" onClick={(e) => {
              e.stopPropagation();
              handleOrderClick(order._id);
            }}>
              View Details →
            </button>
          </div>
        </div>
      ))}

      {/* COMPLETED ORDERS */}
      <h3 style={{ marginTop: "30px" }}>Completed Orders</h3>

      {completedOrders.length === 0 ? (
        <EmptyState
          icon="✅"
          title="No Completed Orders"
          description="Your completed orders will appear here once they're delivered."
        />
      ) : (
        completedOrders.map((order) => (
        <div key={order._id} className="order-card complete" onClick={() => handleOrderClick(order._id)} style={{ cursor: "pointer" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
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
            <button className="btn-view-details" onClick={(e) => {
              e.stopPropagation();
              handleOrderClick(order._id);
            }}>
              View Details →
            </button>
          </div>
        </div>
      ))}
      )}
    </div>
  );
};

export default CustomerOrdersHistory;
