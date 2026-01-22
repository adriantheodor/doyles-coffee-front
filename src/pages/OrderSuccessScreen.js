import React from "react";
import { useNavigate } from "react-router-dom";
import "./OrderSuccessScreen.css";

const OrderSuccessScreen = ({ orderId, totalPrice, itemCount }) => {
  const navigate = useNavigate();

  return (
    <div className="success-screen mobile-container">
      <div className="success-container">
        <div className="success-icon">✓</div>
        
        <h1>Order Submitted Successfully!</h1>
        
        <div className="order-details-box">
          <div className="detail-item">
            <span className="detail-label">Order ID</span>
            <span className="detail-value">#{orderId}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Items</span>
            <span className="detail-value">{itemCount}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Total Amount</span>
            <span className="detail-value total">${totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <div className="success-message">
          <p>Your order has been received and will be processed shortly.</p>
          <p>You can track the status of your order from your dashboard.</p>
        </div>

        <div className="action-buttons mobile-stack">
          <button 
            className="mobile-fullwidth-button"
            onClick={() => navigate("/dashboard")}
          >
            View Order Status
          </button>
          <button 
            className="mobile-fullwidth-button"
            onClick={() => navigate("/place-order")}
          >
            Place Another Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessScreen;
