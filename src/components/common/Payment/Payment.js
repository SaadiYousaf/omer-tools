import React, { useState,useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import './Payment.css';

const Payment = ({ onSubmit, onBack, total, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    if (elements) {
      // Clear any existing card data
      const cardElement = elements.getElement(CardElement);
      if (cardElement) {
        cardElement.clear();
      }
    }
    setError('');
    setLoading(false);
  }, [elements]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create payment method using Stripe Elements
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      if (stripeError) {
        setError(stripeError.message);
        onError(stripeError.message);
        setLoading(false);
        return;
      }

      // Send payment method ID to your backend
      const paymentData = {
        paymentMethodId: paymentMethod.id,
        cardData: {
          // Optional: Also send card details for backup processing
          Name: paymentMethod.billing_details.name,
          Last4: paymentMethod.card.last4,
          Brand: paymentMethod.card.brand
        }
      };

      // Call parent onSubmit with real Stripe data
      onSubmit(paymentData);
      
    } catch (error) {
      setError('Payment processing failed. Please try again.');
      onError('Payment processing failed.');
    } finally {
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
    },
  };

  return (
    <div className="payment-container">
      <div className="payment-form">
        <h3>Payment Information</h3>
        
        {error && (
          <div className="payment-error">
            <span>⚠️</span>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Card Information</label>
            <div className="stripe-card-element">
              <CardElement options={cardElementOptions} />
            </div>
          </div>

          <div className="payment-actions">
            <button type="button" onClick={onBack} className="back-btn" disabled={loading}>
              Back to Shipping
            </button>
            <button type="submit" className="pay-btn" disabled={!stripe || loading}>
              {loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Payment;