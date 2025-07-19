import React from 'react';
import '../../../pages/Checkout/Checkout.css';
import OrderSummary from '../OrderSummary/OrderSummary';

const Confirmation = ({ shippingData, paymentData, items, total, shippingCost, onConfirm }) => {
  return (
    <div className="checkout-container">
      <div className="confirmation-form">
        <h3>Order Confirmation</h3>
        
        <div className="confirmation-section">
          <h4>Shipping Information</h4>
          <div className="confirmation-details">
            <p>{shippingData.fullName}</p>
            <p>{shippingData.address}</p>
            <p>{shippingData.city}, {shippingData.state} {shippingData.postalCode}</p>
            <p>{shippingData.country}</p>
            <p>{shippingData.email}</p>
          </div>
        </div>
        
        <div className="confirmation-section">
          <h4>Payment Method</h4>
          <div className="confirmation-details">
            {paymentData.method === 'credit' ? (
              <>
                <p>Credit Card ending in {paymentData.card.number.slice(-4)}</p>
                <p>Expires {paymentData.card.expiry}</p>
              </>
            ) : (
              <p>PayPal</p>
            )}
          </div>
        </div>
        
        <div className="confirmation-section">
          <h4>Order Items</h4>
          <div className="confirmation-items">
            {items.map(item => (
              <div key={item.id} className="confirmation-item">
                <div className="item-info">
                  <span className="item-quantity">{item.quantity}x</span>
                  <span className="item-name">{item.name}</span>
                </div>
                <span className="item-price">${item.totalPrice.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="confirmation-total">
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
        
        <div className="confirmation-actions">
          <button 
            onClick={onConfirm}
            className="place-order-btn"
          >
            Place Order
          </button>
          <div className="secure-checkout">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11V11.99z"/>
            </svg>
            <span>Secure Checkout</span>
          </div>
        </div>
      </div>
      
      <OrderSummary 
        showEdit={false}
        total={total} 
      />
    </div>
  );
};

export default Confirmation;