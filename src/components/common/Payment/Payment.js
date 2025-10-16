// Payment.js
import React, { useState, useEffect } from "react";
import {
  useStripe,
  useElements,
  CardElement,
  PaymentRequestButtonElement,
  Elements,
} from "@stripe/react-stripe-js";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import "./Payment.css";

const Payment = ({ onSubmit, onBack, total, onError }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cardName, setCardName] = useState("");
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [canMakePayment, setCanMakePayment] = useState(false);

  // Stripe Card / Apple Pay setup
  useEffect(() => {
    if (!stripe) return;

    const pr = stripe.paymentRequest({
      country: "AU",
      currency: "aud",
      total: { label: "Total", amount: Math.round(total * 100) },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    pr.canMakePayment().then((result) => {
      if (result) setCanMakePayment(true);
    });

    pr.on("paymentmethod", async (ev) => {
      try {
        onSubmit({ paymentMethodId: ev.paymentMethod.id, type: "stripe" });
        ev.complete("success");
      } catch (err) {
        ev.complete("fail");
        onError("Apple Pay payment failed.");
      }
    });

    setPaymentRequest(pr);
  }, [stripe, total, onSubmit, onError]);

  // Stripe Card Payment
  const handleStripeSubmit = async (e) => {
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

      onSubmit({ paymentMethodId: paymentMethod.id, type: "stripe" });
    } catch {
      setError("Stripe payment failed. Please try again.");
      onError("Stripe payment failed.");
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

  // PayPal Options
  const initialPayPalOptions = {
   "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID,
  currency: "AUD",
  intent: "capture",
  "disable-funding": "card", // disables debit/credit card option
  };

  return (
    <div className="payment-container">
      <h3>Payment Information</h3>

      {error && (
        <div className="payment-error">
          <span>⚠️</span>
          <p>{error}</p>
        </div>
      )}

      {/* Stripe: Apple Pay / Payment Request Button */}
      {canMakePayment && paymentRequest && (
        <div className="apple-pay-section">
          <PaymentRequestButtonElement options={{ paymentRequest }} />
          <p style={{ textAlign: "center" }}>Or pay with card</p>
        </div>
      )}

      {/* Stripe Card Payment Form */}
      <form onSubmit={handleStripeSubmit} className="stripe-payment-form">
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

      {/* PayPal Button */}
      <div className="paypal-section">
        <PayPalScriptProvider options={initialPayPalOptions}>
          <PayPalButtons
            style={{ layout: "vertical" }}
            createOrder={(data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    amount: { value: total.toFixed(2) },
                  },
                ],
              });
            }}
            onApprove={async (data, actions) => {
              const details = await actions.order.capture();
              const name = details.payer.name.given_name;
              alert(`PayPal transaction completed by ${name}`);
              onSubmit({
                paypalOrderId: data.orderID,
                payerDetails: details,
                type: "paypal",
              });
            }}
            onError={(err) => onError("PayPal payment failed")}
          />
        </PayPalScriptProvider>
      </div>
    </div>
  );
};

export default Payment;
