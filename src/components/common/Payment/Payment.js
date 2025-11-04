// Payment.js
import React, { useState, useEffect, useCallback } from "react";
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
  const [paypalSuccess, setPaypalSuccess] = useState(false);

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
        onSubmit({
          paymentMethodId: ev.paymentMethod.id,
          type: "stripe",
          paymentCompleted: true,
        });
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
      // PayPal Payment Handler

      onSubmit({ paymentMethodId: paymentMethod.id, type: "stripe" });
    } catch {
      setError("Stripe payment failed. Please try again.");
      onError("Stripe payment failed.");
    } finally {
      setLoading(false);
    }
  };
  const handlePayPalSuccess = useCallback(
    async (data, actions) => {
      try {
        setLoading(true);
        const details = await actions.order.capture();

        console.log("💰 PayPal payment successful:", {
          orderID: data.orderID,
          details: details,
        });

        // Prepare PayPal data to send to parent component
        const paypalData = {
          paypalOrderId: data.orderID,
          payerDetails: details,
          type: "paypal",
          status: "completed",
          amount: total,
          timestamp: new Date().toISOString(),
        };

        console.log("📤 Sending PayPal data to parent:", paypalData);

        // Call the onSubmit prop with PayPal data
        onSubmit(paypalData);
        setPaypalSuccess(true);
      } catch (error) {
        console.error("PayPal error:", error);
        setError("PayPal payment failed. Please try again.");
        onError("PayPal payment failed.");
      } finally {
        setLoading(false);
      }
    },
    [onSubmit, onError, total]
  );
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
    "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID, // Sandbox or Live
    currency: "AUD",
    intent: "capture",
    "disable-funding": "card,credit",
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
      {paypalSuccess && (
        <div className="payment-success">
          <span>✅</span>
          <p>PayPal payment completed successfully!</p>
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
              console.log("✅ PayPal onApprove triggered:", data);
              try {
                setLoading(true);
                const details = await actions.order.capture();

                console.log("💰 PayPal payment successful:", {
                  orderID: data.orderID,
                  details: details,
                });

                // Prepare PayPal data to send to parent component
                const paypalData = {
                  paymentMethodId: data.orderID,
                  payerDetails: details,
                  type: "paypal",
                  paymentStatus: "completed",
                  paymentCompleted: true,
                  amount: total,
                  timestamp: new Date().toISOString(),
                };

                console.log("📤 Sending PayPal data to parent:", paypalData);

                // Call the onSubmit prop with PayPal data
                onSubmit(paypalData);
                setPaypalSuccess(true);
              } catch (error) {
                console.error("PayPal error:", error);
                setError("PayPal payment failed. Please try again.");
                onError("PayPal payment failed.");
              } finally {
                setLoading(false);
              }
            }}
            onError={(err) => {
              console.error("PayPal Button Error:", err);
              setError("PayPal payment failed. Please try again.");
              onError("PayPal payment failed.");
            }}
            onCancel={() => {
              setError("PayPal payment was cancelled.");
            }}
          />
        </PayPalScriptProvider>
      </div>
    </div>
  );
};

export default Payment;
