import { useEffect, useState } from "react";
import { API_BASE } from "../../../utils/api";

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

  // MARK ORDER COMPLETE
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

  // SPLIT ORDERS FOR UI
  const activeOrders = orders.filter((o) => o.status !== "Fulfilled");
  const completedOrders = orders.filter((o) => o.status === "Fulfilled");

  return (
    <div className="page-container">
      <div className="page-card">
      <h2 className="page-title">Orders</h2>

      {/* ACTIVE ORDERS */}
      <h3 style={{ marginTop: "20px" }}>Active Orders</h3>

      {activeOrders.length === 0 ? (
        <p>No active orders.</p>
      ) : (
        <table
          border="1"
          cellPadding="8"
          style={{ width: "100%", marginTop: "10px" }}
        >
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
                <td>{o.customer?.name}</td>
                <td>
                  {o.items.map((i) => (
                    <div key={i._id}>
                      {i.product?.name} — Qty: {i.quantity}
                    </div>
                  ))}
                </td>
                <td>${o.totalPrice}</td>
                <td>{o.status}</td>
                <td>{o.notes || "—"}</td>
                <td>
                  <button onClick={() => completeOrder(o._id)}>Complete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* COMPLETED ORDERS */}
      <h3 style={{ marginTop: "40px" }}>Completed Orders</h3>

      {completedOrders.length === 0 ? (
        <p>No completed orders yet.</p>
      ) : (
        <table
          border="1"
          cellPadding="8"
          style={{ width: "100%", marginTop: "10px" }}
        >
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
                <td>{o.customer?.name}</td>
                <td>
                  {o.items.map((i) => (
                    <div key={i._id}>
                      {i.product?.name} — Qty: {i.quantity}
                    </div>
                  ))}
                </td>
                <td>${o.totalPrice}</td>
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
      )}
      </div>
    </div>
  );
};

export default OrderManager;
