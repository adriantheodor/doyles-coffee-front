import React from "react";
import "./OrderConfirmationModal.css";

const OrderConfirmationModal = ({ order, onConfirm, onCancel, isSubmitting }) => {
  if (!order) return null;

  const totalPrice = order.items.reduce((sum, item) => {
    return sum + (item.product?.price || item.productPrice || 0) * item.quantity;
  }, 0);

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Confirm Your Order</h2>
          <button className="modal-close" onClick={onCancel} disabled={isSubmitting}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="order-summary">
            <h3>Order Summary</h3>
            
            <div className="items-list">
              <div className="items-header">
                <span>Product</span>
                <span>Qty</span>
                <span>Price</span>
                <span>Subtotal</span>
              </div>
              
              {order.items.map((item, idx) => {
                const price = item.product?.price || item.productPrice || 0;
                const subtotal = price * item.quantity;
                return (
                  <div key={idx} className="item-row">
                    <span className="item-name">{item.product?.name || "Product"}</span>
                    <span className="item-qty">{item.quantity}</span>
                    <span className="item-price">${price.toFixed(2)}</span>
                    <span className="item-subtotal">${subtotal.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>

            {order.notes && (
              <div className="order-notes">
                <strong>Notes:</strong>
                <p>{order.notes}</p>
              </div>
            )}

            <div className="order-total">
              <span>Total Amount:</span>
              <span className="total-amount">${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <div className="confirmation-message">
            <p>Please review your order details above. Once confirmed, this order will be submitted to Doyle's Coffee.</p>
          </div>
        </div>

        <div className="modal-footer">
          <button 
            className="btn-cancel" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            className="btn-confirm" 
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Confirm Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationModal;
