import { useEffect, useState } from "react";
import { api } from "../utils/api";
import OrderConfirmationModal from "./OrderConfirmationModal";
import OrderSuccessScreen from "./OrderSuccessScreen";
import "./PlaceOrderPage.css";

const PlaceOrderPage = () => {
  const [products, setProducts] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

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

    // Show confirmation modal
    setShowConfirmation(true);
  };

  const handleConfirmOrder = async () => {
    setIsSubmitting(true);
    setMessage("");

    try {
      const res = await api.post("api/orders", {
        items: orderItems,
        notes,
      });

      if (res.status === 200 || res.status === 201) {
        // Show success screen
        setOrderSuccess({
          orderId: res.data._id || res.data.orderId,
          totalPrice: res.data.totalPrice || 0,
          itemCount: orderItems.length,
        });
        
        // Reset form
        setOrderItems([]);
        setNotes("");
        setShowConfirmation(false);
      } else {
        setMessage("Failed to submit order. Please try again.");
        setIsSubmitting(false);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to submit order. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleCancelConfirmation = () => {
    if (!isSubmitting) {
      setShowConfirmation(false);
    }
  };

  return (
    <>
      {/* Show success screen if order was submitted */}
      {orderSuccess && (
        <OrderSuccessScreen
          orderId={orderSuccess.orderId}
          totalPrice={orderSuccess.totalPrice}
          itemCount={orderSuccess.itemCount}
        />
      )}

      {/* Show confirmation modal if needed */}
      {showConfirmation && (
        <OrderConfirmationModal
          order={{
            items: orderItems.map((item) => ({
              product: products.find((p) => p._id === item.product),
              productPrice: products.find((p) => p._id === item.product)?.price || 0,
              quantity: item.quantity,
            })),
            notes,
          }}
          onConfirm={handleConfirmOrder}
          onCancel={handleCancelConfirmation}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Main order form */}
      <div className="page-container">
        <div className="page-card">
          <h2 className="page-title">Place an Order</h2>

          {message && (
            <div className={`alert ${message.includes("failed") ? "alert-error" : "alert-info"}`}>
              {message}
            </div>
          )}

          <div className="form-section">
            <h3>Available Products</h3>
            {Array.isArray(products) && products.length > 0 ? (
              <div className="products-grid">
                {products.map((p) => (
                  <div key={p._id} className="product-card">
                    <div className="product-info">
                      <strong className="product-name">{p.name}</strong>
                      <span className="product-price">${p.price?.toFixed(2) || "0.00"}</span>
                      <span className="product-stock">Stock: {p.stock || 0}</span>
                    </div>
                    <button
                      className="btn-add"
                      onClick={() => handleAddItem(p._id)}
                      disabled={p.stock === 0}
                    >
                      Add to Order
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-state">No products available.</p>
            )}
          </div>

          <div className="form-section">
            <h3>Your Order ({orderItems.length} items)</h3>
            {orderItems.length === 0 ? (
              <p className="empty-state">No items added yet. Select products from above.</p>
            ) : (
              <div className="order-items">
                {orderItems.map((item, idx) => {
                  const product = products.find((p) => p._id === item.product);
                  const subtotal = (product?.price || 0) * item.quantity;
                  return (
                    <div key={idx} className="order-item-card">
                      <div className="item-header">
                        <strong>{product?.name || "Unknown Product"}</strong>
                        <button
                          className="btn-remove"
                          onClick={() => {
                            const newItems = orderItems.filter((_, i) => i !== idx);
                            setOrderItems(newItems);
                          }}
                        >
                          Remove
                        </button>
                      </div>
                      <div className="item-details">
                        <div className="detail">
                          <span>Unit Price:</span>
                          <span>${(product?.price || 0).toFixed(2)}</span>
                        </div>
                        <div className="detail">
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
                            />
                          </label>
                        </div>
                        <div className="detail subtotal">
                          <span>Subtotal:</span>
                          <span>${subtotal.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {orderItems.length > 0 && (
            <div className="form-section">
              <div className="order-summary">
                <div className="summary-total">
                  <span>Total Amount:</span>
                  <span className="amount">
                    ${orderItems
                      .reduce((sum, item) => {
                        const product = products.find((p) => p._id === item.product);
                        return sum + (product?.price || 0) * item.quantity;
                      }, 0)
                      .toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="form-section">
            <label>
              <span>Order Notes (Optional)</span>
              <textarea
                placeholder="Add any special instructions or notes for your order..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </label>
          </div>

          <div className="form-actions">
            <button
              className="btn-submit"
              onClick={handleSubmitOrder}
              disabled={orderItems.length === 0 || isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Review & Submit Order"}
            </button>
            <button
              className="btn-cancel-form"
              onClick={() => {
                setOrderItems([]);
                setNotes("");
                setMessage("");
              }}
            >
              Clear Order
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaceOrderPage;
