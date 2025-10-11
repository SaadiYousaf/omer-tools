import React, { useState, useEffect } from "react";
import {
  useStripe,
  useElements,
  CardElement,
  PaymentRequestButtonElement,
} from "@stripe/react-stripe-js";
import "./Payment.css";

const Payment = ({ onSubmit, onBack, total, onError }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cardName, setCardName] = useState("");
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [canMakePayment, setCanMakePayment] = useState(false);

  // Clear card input on mount
  useEffect(() => {
    if (elements) {
      const cardElement = elements.getElement(CardElement);
      if (cardElement) cardElement.clear();
    }
    setError("");
    setLoading(false);
  }, [elements]);

  // Initialize Apple Pay / Payment Request
  useEffect(() => {
    if (!stripe) return;

    const pr = stripe.paymentRequest({
      country: "AU", // Australia
      currency: "aud", // Australian dollars
      total: {
        label: "Total",
        amount: Math.round(total * 100), // convert dollars to cents
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    pr.canMakePayment().then((result) => {
      if (result) setCanMakePayment(true);
    });

    pr.on("paymentmethod", async (ev) => {
      try {
        // You can optionally process payment here with backend
        onSubmit({ paymentMethodId: ev.paymentMethod.id });
        ev.complete("success");
      } catch (err) {
        ev.complete("fail");
        onError("Apple Pay payment failed.");
      }
    });

    setPaymentRequest(pr);
  }, [stripe, total, onSubmit, onError]);

  // Handle Card Payment
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError("");

    try {
      const cardElement = elements.getElement(CardElement);
      const { error: stripeError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
          billing_details: { name: cardName },
        });

      if (stripeError) {
        setError(stripeError.message);
        onError(stripeError.message);
        setLoading(false);
        return;
      }

      const paymentData = {
        paymentMethodId: paymentMethod.id,
        cardData: {
          Name: paymentMethod.billing_details.name,
          Last4: paymentMethod.card.last4,
          Brand: paymentMethod.card.brand,
        },
      };

      onSubmit(paymentData);
    } catch {
      setError("Payment processing failed. Please try again.");
      onError("Payment processing failed.");
    } finally {
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": { color: "#aab7c4" },
      },
      invalid: { color: "#fa755a" },
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

        {/* Apple Pay / Payment Request Button */}
        {canMakePayment && paymentRequest && (
          <div className="apple-pay-section">
            <PaymentRequestButtonElement options={{ paymentRequest }} />
            <p style={{ textAlign: "center" }}>Or pay with card</p>
          </div>
        )}

        {/* Card Payment Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name on Card</label>
            <input
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="form-group">
            <label>Card Details</label>
            <div className="stripe-card-element">
              <CardElement options={cardElementOptions} />
            </div>
          </div>

          <div className="payment-actions">
            <button
              type="button"
              onClick={onBack}
              className="back-btn"
              disabled={loading}
            >
              Back to Shipping
            </button>
            <button
              type="submit"
              className="pay-btn"
              disabled={!stripe || loading}
            >
              {loading ? "Processing..." : `Pay $${total.toFixed(2)}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Payment;
