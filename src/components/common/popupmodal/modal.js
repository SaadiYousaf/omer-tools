// modal.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./modal.css";

const Modal = ({ show, onClose, items, message }) => {
  const navigate = useNavigate();

  if (!show) return null;

  const handleCheckout = () => {
    navigate("/checkout"); // ✅ keeps Redux state intact
  };

  const handleContinue = () => {
    onClose(); // just close the modal
  };

  return (
    <div className="cart-modal-container">
      <div className="cart-modal">
        <p className="cart-modal-message">{message}</p>

        {/* Scrollable cart items preview */}
        {items && items.length > 0 && (
          <div className="modal-cart-items">
            {items.map((item) => (
              <div key={item.id} className="modal-cart-item">
                <img src={item.image} alt={item.name} />
                <div className="modal-item-details">
                  <p className="modal-item-name">{item.name}</p>
                  <p className="modal-item-qty">Qty: {item.quantity}</p>
                  <p className="modal-item-price">
                    ${item.totalPrice.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="cart-modal-buttons">
          <button className="cart-btn checkout-btn" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
          <button className="cart-btn continue-btn" onClick={handleContinue}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
