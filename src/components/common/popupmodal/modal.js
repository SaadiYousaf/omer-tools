// modal.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./modal.css";

const Modal = ({ show, message, onClose }) => {
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
