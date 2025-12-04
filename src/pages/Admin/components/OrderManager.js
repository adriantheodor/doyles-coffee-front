import { useEffect, useState } from "react";
import { API_BASE } from "../../../utils/api";

const OrderManager = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await fetch(`${API_BASE}api/orders`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();
    if (Array.isArray(data)) setOrders(data);
  };

  const completeOrder = async (id) => {
    if (!window.confirm("Mark this order as completed?")) return;

    const res = await fetch(`${API_BASE}api/orders/${id}/complete`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.message || "Failed to complete order");
      return;
    }

    alert("Order completed and inventory updated!");
    fetchOrders();
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
      <h2>Orders</h2>

      <table
        border="1"
        cellPadding="8"
        style={{ width: "100%", marginTop: "15px" }}
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
          {orders.map((o) => (
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
                {o.status !== "Fulfilled" && (
                  <button onClick={() => completeOrder(o._id)}>Complete</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderManager;
