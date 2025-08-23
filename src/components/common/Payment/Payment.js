// components/common/Payment/Payment.js
import React, { useState } from 'react';
import './Payment.css';

const Payment = ({ onSubmit, onBack, total }) => {
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setPaymentData({
      ...paymentData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!paymentData.cardNumber || paymentData.cardNumber.replace(/\s/g, '').length !== 16) {
      return 'Please enter a valid 16-digit card number';
    }
    if (!paymentData.cardName) {
      return 'Please enter the name on your card';
    }
    if (!paymentData.expiryDate || !/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)) {
      return 'Please enter a valid expiry date (MM/YY)';
    }
    if (!paymentData.cvv || paymentData.cvv.length !== 3) {
      return 'Please enter a valid 3-digit CVV';
    }
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setError('');
    // Simulate payment processing
    const isSuccess = Math.random() > 0.3; // 70% success rate for demo
    
    if (isSuccess) {
      onSubmit(paymentData);
    } else {
      setError('Payment failed. Please try again or use a different card.');
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-form">
        <h3>Payment Information</h3>
        {error && (
          <div className="payment-error">
            <span>⚠️</span>
            <p>{error}</p>
            <button onClick={() => setError('')}>Try Again</button>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Card Number</label>
            <input
              type="text"
              name="cardNumber"
              value={paymentData.cardNumber}
              onChange={handleChange}
              placeholder="1234 5678 9012 3456"
              maxLength="19"
            />
          </div>
          <div className="form-group">
            <label>Name on Card</label>
            <input
              type="text"
              name="cardName"
              value={paymentData.cardName}
              onChange={handleChange}
              placeholder="John Doe"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Expiry Date</label>
              <input
                type="text"
                name="expiryDate"
                value={paymentData.expiryDate}
                onChange={handleChange}
                placeholder="MM/YY"
                maxLength="5"
              />
            </div>
            <div className="form-group">
              <label>CVV</label>
              <input
                type="text"
                name="cvv"
                value={paymentData.cvv}
                onChange={handleChange}
                placeholder="123"
                maxLength="3"
              />
            </div>
          </div>
          <div className="payment-actions">
            <button type="button" onClick={onBack} className="back-btn">
              Back to Shipping
            </button>
            <button type="submit" className="pay-btn">
              Pay ${total.toFixed(2)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Payment;