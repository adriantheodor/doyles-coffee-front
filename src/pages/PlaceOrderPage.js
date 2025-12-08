import { useEffect, useState } from "react";
import { API_BASE } from "../utils/api";

const PlaceOrderPage = () => {
  const [products, setProducts] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");

  // Load inventory for customers
  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch(`${API_BASE}api/products`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        console.error("Error loading products:", data);
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  const handleAddItem = (productId) => {
    setOrderItems([...orderItems, { product: productId, quantity: 1 }]);
  };

  const handleSubmitOrder = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_BASE}api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        items: orderItems,
        notes,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("Order submitted successfully!");
      setOrderItems([]);
      setNotes("");
    } else {
      setMessage("Failed to submit order.");
    }
  };

  return (
    <div className="page-container">
      <div className="page-card">
        <h2 className="page-title">Place an Order</h2>

        <h3>Available Products</h3>
        {Array.isArray(products) &&
          products.map((p) => (
            <div key={p._id}>
              <strong>{p.name}</strong> — In Stock: {p.stock}
              <button onClick={() => handleAddItem(p._id)}>Add</button>
            </div>
          ))}

        <h3>Your Order</h3>
        {orderItems.map((item, idx) => (
          <div key={idx}>
            Product: {products.find((p) => p._id === item.product)?.name}
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => {
                const newItems = [...orderItems];
                newItems[idx].quantity = Number(e.target.value);
                setOrderItems(newItems);
              }}
            />
          </div>
        ))}

        <textarea
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <button onClick={handleSubmitOrder}>Submit Order</button>

        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default PlaceOrderPage;
