import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useToast from "../hooks/useToast";
import EmptyState from "../components/EmptyState";
import { API_BASE } from "../utils/api";
import "./OrderTrackingPage.css";

const OrderTrackingPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          const msg = "Authentication required. Please log in.";
          setError(msg);
          toast.error(msg);
          navigate("/login");
          return;
        }

        const res = await fetch(
          `${API_BASE}api/orders/${orderId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) {
          throw new Error("Order not found");
        }

        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error("Error fetching order:", err);
        const errorMsg = err.message || "Failed to load order details";
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId, navigate]);

  if (loading) {
    return (
      <div className="page-container mobile-container">
        <div className="page-card">
          <p className="loading">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="page-container mobile-container">
        <EmptyState
          icon="❌"
          title="Order Not Found"
          description={error || "The order you're looking for doesn't exist or couldn't be loaded."}
          actionLabel="Back to Orders"
          onAction={() => navigate("/orders")}
        />
      </div>
    );
  }

  const statusTimeline = [
    { status: "Pending", label: "Pending", completed: ["Pending", "Processing", "Completed", "Fulfilled"].includes(order.status) },
    { status: "Processing", label: "Processing", completed: ["Processing", "Completed", "Fulfilled"].includes(order.status) },
    { status: "Completed", label: "Completed", completed: ["Completed", "Fulfilled"].includes(order.status) },
    { status: "Fulfilled", label: "Delivered", completed: order.status === "Fulfilled" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Fulfilled":
        return "#4CAF50";
      case "Processing":
        return "#2196F3";
      case "Pending":
        return "#FF9800";
      default:
        return "#999";
    }
  };

  return (
    <div className="page-container mobile-container">
      <div className="page-card">
        <div className="tracking-header">
          <h1>Order Tracking</h1>
          <span className="order-id">Order #{order._id.slice(-6)}</span>
        </div>

        {/* Status Timeline */}
        <div className="status-timeline">
          <h3>Order Status</h3>
          <div className="timeline">
            {statusTimeline.map((item, idx) => (
              <div key={idx} className="timeline-item">
                <div
                  className={`timeline-dot ${item.completed ? "completed" : ""}`}
                  style={{
                    background: item.completed ? getStatusColor(item.status) : "#ddd",
                  }}
                >
                  {item.completed && "✓"}
                </div>
                <div className="timeline-label">
                  <span className="timeline-status">{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Status */}
        <div className="current-status" style={{ borderColor: getStatusColor(order.status) }}>
          <h3>Current Status</h3>
          <div className="status-badge" style={{ background: getStatusColor(order.status) }}>
            {order.status}
          </div>
          <p className="status-description">
            {order.status === "Pending" && "Your order is waiting to be processed."}
            {order.status === "Processing" && "Your order is being prepared."}
            {order.status === "Completed" && "Your order is ready for pickup or delivery."}
            {order.status === "Fulfilled" && "Your order has been delivered!"}
          </p>
        </div>

        {/* Order Details */}
        <div className="order-details-section">
          <h3>Order Details</h3>
          <div className="details-grid">
            <div className="detail">
              <span className="detail-label">Order Date</span>
              <span className="detail-value">
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="detail">
              <span className="detail-label">Total Amount</span>
              <span className="detail-value total">
                ${order.totalPrice.toFixed(2)}
              </span>
            </div>
            <div className="detail">
              <span className="detail-label">Items</span>
              <span className="detail-value">{order.items.length}</span>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="items-section">
          <h3>Order Items</h3>
          <div className="items-table">
            <div className="table-header">
              <span>Product</span>
              <span>Qty</span>
              <span>Price</span>
              <span>Subtotal</span>
            </div>
            {order.items.map((item, idx) => (
              <div key={idx} className="table-row">
                <span className="product-name">{item.product?.name || "Product"}</span>
                <span className="qty">{item.quantity}</span>
                <span className="price">
                  ${(item.product?.price || 0).toFixed(2)}
                </span>
                <span className="subtotal">
                  ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Notes */}
        {order.notes && (
          <div className="notes-section">
            <h3>Order Notes</h3>
            <p>{order.notes}</p>
          </div>
        )}

        {/* Invoice Link */}
        {order.status === "Fulfilled" && (
          <div className="invoice-section">
            <a
              href={`${API_BASE}api/invoices/order/${order._id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="invoice-link"
            >
              📄 View Invoice PDF
            </a>
          </div>
        )}

        {/* Action Buttons */}
        <div className="action-buttons">
          <button onClick={() => navigate("/orders")} className="btn-back">
            Back to Orders
          </button>
          <button onClick={() => navigate("/place-order")} className="btn-new-order">
            Place New Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
