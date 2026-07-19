import React, { useEffect, useState } from "react";
import { API_BASE } from "../../../utils/api";
import "./OnDemandOrdersManager.css";

const OnDemandOrdersManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOnDemandOrders = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`${API_BASE}api/on-demand-orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to load on-demand orders (${response.status})`);
        }

        const data = await response.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch on-demand orders:", err);
        setError(err.message || "Unable to load on-demand orders.");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOnDemandOrders();
  }, []);

  const formatDate = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
  };

  return (
    <div className="on-demand-orders-manager">
      <div className="section-heading">
        <div>
          <h2 className="section-title">On-Demand Orders</h2>
          <p className="section-subtitle">
            Review requests submitted through the delivery form and monitor the fee flag.
          </p>
        </div>
      </div>

      {loading && <p className="status-message">Loading on-demand orders…</p>}
      {error && <p className="status-message error">{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <div className="empty-state">
          <p>No on-demand orders have been submitted yet.</p>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="table-wrapper">
          <table className="styled-table on-demand-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Jugs</th>
                <th>Requested Date</th>
                <th>Status</th>
                <th>Fee</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id || order.id}>
                  <td>{order.companyName || "—"}</td>
                  <td>{order.jugCount ?? "—"}</td>
                  <td>{formatDate(order.deliveryDate || order.requestedDate)}</td>
                  <td>{order.status || "pending"}</td>
                  <td>
                    {order.deliveryFeeAmount != null
                      ? `$${Number(order.deliveryFeeAmount).toFixed(2)}`
                      : "—"}
                  </td>
                  <td>{order.notes || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OnDemandOrdersManager;
