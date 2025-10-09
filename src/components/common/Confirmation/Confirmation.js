// components/common/Confirmation/Confirmation.js
import React from 'react';
import './Confirmation.css';

const Confirmation = ({ 
  shippingData, 
  paymentData, 
  items, 
  total, 
  shippingCost, 
  onConfirm, 
  onBack,
  loading,
  error 
}) => {
 const handleRetry = () => {
    // This will call the parent's handlePlaceOrder function again
    // without reloading the page or losing authentication
    onBack();;
  };


  return (
    <div className="confirmation-container">
      <div className="confirmation-content">
        <h3>Order Confirmation</h3>
        
        {error && (
          <div className="confirmation-error">
            <span>⚠️</span>
            <p>{error}</p>
            <button onClick={handleRetry} className="retry-btn" disabled={loading}>
              {loading ? 'Processing...' : 'Use Different Payment Method'}
            </button>
             <p className="retry-note">
                Please use a different card or payment method to complete your order.
            </p>
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
  {paymentData?.cardData ? (
    <div className="payment-details">
      <p><strong>Card Number:</strong> **** **** **** {paymentData.cardData.Last4 || '****'}</p>
      <p><strong>Name on Card:</strong> {paymentData.cardData.Name || 'Not provided'}</p>
      <p><strong>Card Type:</strong> {paymentData.cardData.Brand || 'Card'}</p>
    </div>
  ) : (
    <p>Payment information not available</p>
  )}
  {error && (
              <div className="payment-help">
                <p><strong>Payment Issue Detected:</strong> {error}</p>
                <p>You can click "Try Again" to retry with the same card, 
                or go back to use a different payment method.</p>
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
          {!error && (
          <div className="confirmation-actions">
            <button 
              onClick={onBack} 
              className="back-btn"
              disabled={loading}
            >
              Back to Payment
            </button>
            <button 
              onClick={onConfirm} 
              className="confirm-order-btn"
              disabled={loading || !paymentData}
            >
              {loading ? 'Processing...' : 'Confirm Order'}
            </button>
          </div>
        )}
        
        
        
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