// CustomerDashPage.jsx (ORDER FORM SECTION)

import { useState, useEffect } from "react";
import { api, API_BASE } from "../utils/api";

const CustomerOrderForm = () => {
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([{ product: "", quantity: 1 }]);
  const [notes, setNotes] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await api.get("api/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to load products:", err);
        setProducts([]);
      }
    };
    loadProducts();
  }, []);

  const submitOrder = async (e) => {
    e.preventDefault();

    // Compute price from products list
    const totalPrice = items.reduce((sum, i) => {
      const p = products.find((prod) => prod._id === i.product);
      return sum + (p?.price || 0) * i.quantity;
    }, 0);

    try {
      const res = await api.post("api/orders", { items, notes, totalPrice });

      if (res.status === 200 || res.status === 201) {
        setSuccess("Order placed!");
        setItems([{ product: "", quantity: 1 }]);
        setNotes("");
      }
    } catch (err) {
      console.error("Failed to submit order:", err);
      setSuccess("");
    }
  };

  return (
    <div className="page-container">
      <div className="page-card">
        <h2 className="page-title">Place an Order</h2>
        {success && <p style={{ color: "green" }}>{success}</p>}

        <form onSubmit={submitOrder}>
          {items.map((row, idx) => (
            <div key={idx} style={{ marginBottom: "10px" }}>
              <select
                value={row.product}
                onChange={(e) => {
                  const updated = [...items];
                  updated[idx].product = e.target.value;
                  setItems(updated);
                }}
                required
              >
                <option value="">Select Product</option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="1"
                value={row.quantity}
                onChange={(e) => {
                  const updated = [...items];
                  updated[idx].quantity = Number(e.target.value);
                  setItems(updated);
                }}
                required
              />

              <button
                type="button"
                onClick={() => setItems(items.filter((_, i) => i !== idx))}
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => setItems([...items, { product: "", quantity: 1 }])}
          >
            + Add Item
          </button>

          <br />
          <br />

          <textarea
            placeholder="Order Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <button type="submit" style={{ marginTop: "10px" }}>
            Submit Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerOrderForm;
