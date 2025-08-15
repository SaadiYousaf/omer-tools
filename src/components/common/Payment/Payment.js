import React, { useState } from 'react';
import '../../../pages/Checkout/Checkout.css';
import OrderSummary from '../OrderSummary/OrderSummary';
import { v4 as uuidv4 } from 'uuid';

const Payment = ({ 
  onSubmit, 
  onBack, 
  total, 
  orderItems = [], 
  userId, 
  userEmail
}) => {
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [sessionId] = useState(uuidv4());

  const handleChange = (e) => {
    setCardData({
      ...cardData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    try {
      // Create the base payment data object
      const paymentData = {
        paymentMethod: paymentMethod === 'credit' ? 'CreditCard' : paymentMethod,
        amount: total,
        currency: 'USD',
        userId: userId,
        userEmail: userEmail,
        orderItems: orderItems.map(item => ({
          productId: item.id,
          productName: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        sessionId: sessionId
      };

      // Add cardData only for credit card payments
      if (paymentMethod === 'credit') {
        paymentData.cardData = {
          number: cardData.number,
          name: cardData.name,
          expiry: cardData.expiry,
          cvv: cardData.cvv
        };
      }

      const response = await fetch('http://localhost:5117/api/payment/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        // Handle different error formats
        let errorMessage = 'Payment failed';
        
        // Format 1: Array of errors (data.errors)
        if (Array.isArray(data.errors)) {
          errorMessage = data.errors.join(', ');
        } 
        // Format 2: Single error message (data.message)
        else if (data.message) {
          errorMessage = data.message;
        }
        // Format 3: Custom error structure (data.Errors)
        else if (data.Errors) {
          // If it's an array of error messages
          if (Array.isArray(data.Errors)) {
            errorMessage = data.Errors.join(', ');
          } 
          // If it's a single string error
          else if (typeof data.Errors === 'string') {
            errorMessage = data.Errors;
          }
        }
        
        throw new Error(errorMessage);
      }

      if (data.success) {
        onSubmit({
          method: paymentData.paymentMethod,
          transactionId: data.transactionId,
          orderId: data.orderId
        });
      } else {
        setError(data.message || 'Payment failed');
      }
    } catch (err) {
      setError(err.message || 'Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  // Stripe test cards with different outcomes
  const fillTestCard = (type) => {
    switch(type) {
      case 'success':
        setCardData({
          number: '4242424242424242',
          name: 'Test User',
          expiry: '12/30',
          cvv: '123'
        });
        break;
      case 'insufficient':
        setCardData({
          number: '4000000000009995',
          name: 'Test User',
          expiry: '12/30',
          cvv: '123'
        });
        break;
      case 'failed':
        setCardData({
          number: '4000000000000002',
          name: 'Test User',
          expiry: '12/30',
          cvv: '123'
        });
        break;
      default:
        break;
    }
  };

  return (
    <div className="checkout-container">
      <div className="checkout-form">
        <h3>Payment Method</h3>
        
        <div className="test-cards">
          <h4>Test Cards:</h4>
          <div className="test-card-buttons">
            <button type="button" onClick={() => fillTestCard('success')}>
              Successful Payment
            </button>
            <button type="button" onClick={() => fillTestCard('insufficient')}>
              Insufficient Funds
            </button>
            <button type="button" onClick={() => fillTestCard('failed')}>
              Failed Payment
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Payment Method</label>
            <div className="payment-options">
              <label>
                <input
                  type="radio"
                  value="credit"
                  checked={paymentMethod === 'credit'}
                  onChange={() => setPaymentMethod('credit')}
                />
                Credit Card
              </label>
              <label>
                <input
                  type="radio"
                  value="paypal"
                  checked={paymentMethod === 'paypal'}
                  onChange={() => setPaymentMethod('paypal')}
                />
                PayPal
              </label>
            </div>
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

          {error && <div className="payment-error">{error}</div>}

          <div className="payment-actions">
            <button 
              type="button" 
              className="back-btn" 
              onClick={onBack}
              disabled={isProcessing}
            >
              Back
            </button>
            <button 
              type="submit" 
              className="continue-btn"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Pay Now'}
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