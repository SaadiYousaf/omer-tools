// components/common/Confirmation/Confirmation.js
import React from 'react';
//import './Confirmation.css';

const Confirmation = ({ 
  shippingData, 
  paymentData, 
  items, 
  total, 
  shippingCost, 
  onConfirm, 
  loading,
  error 
}) => {
  return (
    <div className="confirmation-container">
      <div className="confirmation-content">
        <h3>Order Confirmation</h3>
        
        {error && (
          <div className="confirmation-error">
            <span>⚠️</span>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="retry-btn">
              Try Again
            </button>
          </div>
        )}
        
        <div className="confirmation-sections">
          <div className="confirmation-section">
            <h4>Shipping Information</h4>
            {shippingData && (
              <div className="shipping-details">
                <p><strong>Name:</strong> {shippingData.fullName}</p>
                <p><strong>Email:</strong> {shippingData.email}</p>
                <p><strong>Address:</strong> {shippingData.address}</p>
                <p><strong>City:</strong> {shippingData.city}</p>
                <p><strong>State:</strong> {shippingData.state}</p>
                <p><strong>Postal Code:</strong> {shippingData.postalCode}</p>
                <p><strong>Country:</strong> {shippingData.country}</p>
              </div>
            )}
          </div>
          
          <div className="confirmation-section">
            <h4>Payment Information</h4>
            {paymentData && (
              <div className="payment-details">
                <p><strong>Card Number:</strong> **** **** **** {paymentData.cardNumber.slice(-4)}</p>
                <p><strong>Name on Card:</strong> {paymentData.cardName}</p>
                <p><strong>Expiry Date:</strong> {paymentData.expiryDate}</p>
              </div>
            )}
          </div>
          
          <div className="confirmation-section">
            <h4>Order Summary</h4>
            <div className="order-items">
              {items.map(item => (
                <div key={item.id} className="order-item">
                  <div className="item-info">
                    <span className="item-quantity">{item.quantity}x</span>
                    <span className="item-name">{item.name}</span>
                  </div>
                  <span className="item-price">${item.totalPrice.toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="summary-details">
              <div className="summary-item">
                <span>Subtotal</span>
                <span>${(total - shippingCost).toFixed(2)}</span>
              </div>
              <div className="summary-item">
                <span>Shipping</span>
                <span>${shippingCost.toFixed(2)}</span>
              </div>
              <div className="summary-item total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <button 
          onClick={onConfirm} 
          className="confirm-order-btn"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Confirm Order'}
        </button>
        
        {loading && (
          <div className="loading-indicator">
            <p>Processing your order. Please don't close this page.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Confirmation;