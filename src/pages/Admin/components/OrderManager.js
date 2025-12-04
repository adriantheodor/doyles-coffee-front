import { useEffect, useState } from "react";
import { API_BASE } from "../../../utils/api";

const OrderManager = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await fetch(`${API_BASE}api/orders`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const data = await res.json();
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
      <h2>Orders</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Items</th>
            <th>Status</th>
            <th>Total Price</th>
            <th>Notes</th>
            <th>Created</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((o) => (
            <tr key={o._id}>
              <td>{o.customer?.name}</td>
              <td>
                {o.items.map((i) => (
                  <div key={i._id}>
                    {i.product?.name} × {i.quantity}
                  </div>
                ))}
              </td>
              <td>{o.status}</td>
              <td>${o.totalPrice.toFixed(2)}</td>
              <td>{o.notes || "—"}</td>
              <td>{new Date(o.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderManager;
