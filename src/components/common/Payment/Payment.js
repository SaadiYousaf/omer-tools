import React, { useState } from 'react';
import '../../../pages/Checkout/Checkout.css';
import OrderSummary from '../OrderSummary/OrderSummary';

const Payment = ({ onSubmit, onBack, total }) => {
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  const handleChange = (e) => {
    setCardData({
      ...cardData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      method: paymentMethod,
      ...(paymentMethod === 'credit' && { card: cardData })
    });
  };

  return (
    <div className="checkout-container">
      <div className="checkout-form">
        <h3>Payment Method</h3>
        <form onSubmit={handleSubmit}>
          <div className="payment-methods">
            <label className="payment-method">
              <input
                type="radio"
                name="paymentMethod"
                value="credit"
                checked={paymentMethod === 'credit'}
                onChange={() => setPaymentMethod('credit')}
              />
              <div className="payment-method-content">
                <span>Credit Card</span>
                <div className="card-icons">
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/visa/visa-original.svg" alt="Visa" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mastercard/mastercard-original.svg" alt="Mastercard" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg" alt="Apple Pay" />
                </div>
              </div>
            </label>
            
            <label className="payment-method">
              <input
                type="radio"
                name="paymentMethod"
                value="paypal"
                checked={paymentMethod === 'paypal'}
                onChange={() => setPaymentMethod('paypal')}
              />
              <div className="payment-method-content">
                <span>PayPal</span>
                <img 
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/paypal/paypal-original.svg" 
                  alt="PayPal" 
                  className="paypal-icon"
                />
              </div>
            </label>
          </div>

          {paymentMethod === 'credit' && (
            <div className="credit-card-form">
              <div className="form-group">
                <label>Card Number</label>
                <input
                  type="text"
                  name="number"
                  value={cardData.number}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>
              <div className="form-group">
                <label>Cardholder Name</label>
                <input
                  type="text"
                  name="name"
                  value={cardData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input
                    type="text"
                    name="expiry"
                    value={cardData.expiry}
                    onChange={handleChange}
                    placeholder="MM/YY"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    value={cardData.cvv}
                    onChange={handleChange}
                    placeholder="123"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'paypal' && (
            <div className="paypal-notice">
              <p>You will be redirected to PayPal to complete your payment.</p>
            </div>
          )}

          <div className="payment-actions">
            <button type="button" className="back-btn" onClick={onBack}>
              Back to Shipping
            </button>
            <button type="submit" className="continue-btn">
              Review Order
            </button>
          </div>
        </form>
      </div>
      
      <OrderSummary 
        showEdit={false}
        total={total} 
      />
    </div>
  );
};

export default Payment;