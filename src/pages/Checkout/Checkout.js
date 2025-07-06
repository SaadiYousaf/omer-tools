import React from 'react';
import './Checkout.css';

const Checkout = () => {
  return (
    <div className="checkout-page">
      <h2>Checkout</h2>
      <div className="checkout-container">
        <div className="checkout-form">
          <h3>Shipping Information</h3>
          <form>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" required />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input type="text" required />
            </div>
            <div className="form-group">
              <label>City</label>
              <input type="text" required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>State</label>
                <input type="text" required />
              </div>
              <div className="form-group">
                <label>Postal Code</label>
                <input type="text" required />
              </div>
            </div>
          </form>
        </div>
        <div className="checkout-summary">
          <h3>Order Summary</h3>
          <div className="summary-item">
            <span>Subtotal</span>
            <span>$199.99</span>
          </div>
          <div className="summary-item">
            <span>Shipping</span>
            <span>$10.00</span>
          </div>
          <div className="summary-item total">
            <span>Total</span>
            <span>$209.99</span>
          </div>
          <button className="place-order-btn">Place Order</button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;