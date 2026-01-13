import { useEffect, useState } from "react";
import { api, API_BASE } from "../utils/api";

const PlaceOrderPage = () => {
  const [products, setProducts] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");

  // Load inventory for customers
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("api/products");
        if (Array.isArray(res.data)) {
          setProducts(res.data);
        } else {
          console.error("Error loading products:", res.data);
          setProducts([]);
        }
      } catch (err) {
        console.error("Failed to load products:", err);
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  const handleAddItem = (productId) => {
    setOrderItems([...orderItems, { product: productId, quantity: 1 }]);
  };

  const handleSubmitOrder = async () => {
    // Validate order items before submission
    if (orderItems.length === 0) {
      setMessage("Please add at least one item to your order.");
      return;
    }

    // Validate that all items have valid products
    const invalidItems = orderItems.filter(
      (item) => !products.find((p) => p._id === item.product)
    );
    if (invalidItems.length > 0) {
      setMessage("Some items in your order are no longer available. Please remove them.");
      return;
    }

    try {
      const res = await api.post("api/orders", {
        items: orderItems,
        notes,
      });

      if (res.status === 200 || res.status === 201) {
        setMessage("Order submitted successfully!");
        setOrderItems([]);
        setNotes("");
      } else {
        setMessage("Failed to submit order.");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to submit order.");
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
        {orderItems.length === 0 ? (
          <p>No items added yet. Select products from above.</p>
        ) : (
          orderItems.map((item, idx) => {
            const product = products.find((p) => p._id === item.product);
            return (
              <div key={idx} style={{ marginBottom: "10px", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}>
                <div>
                  <strong>Product:</strong> {product?.name || "Unknown Product (removed from inventory)"}
                </div>
                <div>
                  <label>
                    Quantity:
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => {
                        const newItems = [...orderItems];
                        newItems[idx].quantity = Math.max(1, Number(e.target.value));
                        setOrderItems(newItems);
                      }}
                      style={{ marginLeft: "8px", width: "60px" }}
                    />
                  </label>
                </div>
                <button
                  onClick={() => {
                    const newItems = orderItems.filter((_, i) => i !== idx);
                    setOrderItems(newItems);
                  }}
                  style={{ marginTop: "8px", padding: "4px 8px" }}
                >
                  Remove
                </button>
              </div>
            );
          })
        )}

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
