import React, { useState,useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Payment from '../../components/common/Payment/Payment';
import Confirmation from '../../components/common/Confirmation/Confirmation';
import ScrollToTop from "../../components/common/Scroll/ScrollToTop";
import './Checkout.css';

const Checkout = () => {
  const [step, setStep] = useState(1);
  const [shippingData, setShippingData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const { items, totalAmount } = useSelector(state => state.cart);
  const navigate = useNavigate();
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

  const calculateShipping = () => {
    return totalAmount > 100 ? 0 : 10;
  };

  const shippingCost = calculateShipping();
  const total = totalAmount + shippingCost;

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleShippingSubmit = (data) => {
    setShippingData(data);
    nextStep();
  };

  const handlePaymentSubmit = (data) => {
    setPaymentData(data);
    nextStep();
  };

  const handlePlaceOrder = () => {
    // In a real app, you would process the order here
    console.log('Order placed:', { shippingData, paymentData, items });
    nextStep();
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <ShippingForm 
            onSubmit={handleShippingSubmit} 
            shippingCost={shippingCost}
            total={total}
          />
        );
      case 2:
        return (
          <Payment 
            onSubmit={handlePaymentSubmit} 
            onBack={prevStep}
            total={total}
          />
        );
      case 3:
        return (
          <Confirmation 
            shippingData={shippingData} 
            paymentData={paymentData}
            items={items}
            total={total}
            shippingCost={shippingCost}
            onConfirm={handlePlaceOrder}
          />
        );
      case 4:
        return <OrderSuccess />;
      default:
        return <ShippingForm onSubmit={handleShippingSubmit} />;
    }
  };

  return (
    <div className="checkout-page">
         <ScrollToTop />
      <div className="checkout-header">
        <h2>Checkout</h2>
        <div className="checkout-steps">
          <span className={step >= 1 ? 'active' : ''}>Shipping</span>
          <span className={step >= 2 ? 'active' : ''}>Payment</span>
          <span className={step >= 3 ? 'active' : ''}>Confirmation</span>
          <span className={step >= 4 ? 'active' : ''}>Complete</span>
        </div>
      </div>
      {renderStep()}
    </div>
  );
};

const ShippingForm = ({ onSubmit, shippingCost, total }) => {
  const { items, totalAmount } = useSelector(state => state.cart);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="checkout-container">
      <div className="checkout-form">
        <h3>Shipping Information</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              name="fullName" 
              value={formData.fullName}
              onChange={handleChange}
              required 
              placeholder="John Doe" 
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email}
              onChange={handleChange}
              required 
              placeholder="john@example.com" 
            />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input 
              type="text" 
              name="address" 
              value={formData.address}
              onChange={handleChange}
              required 
              placeholder="123 Main St" 
            />
          </div>
          <div className="form-group">
            <label>City</label>
            <input 
              type="text" 
              name="city" 
              value={formData.city}
              onChange={handleChange}
              required 
              placeholder="New York" 
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>State/Province</label>
              <input 
                type="text" 
                name="state" 
                value={formData.state}
                onChange={handleChange}
                required 
                placeholder="NY" 
              />
            </div>
            <div className="form-group">
              <label>Postal Code</label>
              <input 
                type="text" 
                name="postalCode" 
                value={formData.postalCode}
                onChange={handleChange}
                required 
                placeholder="10001" 
              />
            </div>
          </div>
          <div className="form-group">
            <label>Country</label>
            <select 
              name="country" 
              value={formData.country}
              onChange={handleChange}
              required
            >
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="UK">United Kingdom</option>
              <option value="AU">Australia</option>
            </select>
          </div>
          <button type="submit" className="continue-btn">
            Continue to Payment
          </button>
        </form>
      </div>
      
      <OrderSummary 
        items={items} 
        totalAmount={totalAmount} 
        shippingCost={shippingCost} 
        total={total} 
      />
    </div>
  );
};

const OrderSummary = ({ items, totalAmount, shippingCost, total }) => (
  <div className="checkout-summary">
    <h3>Order Summary</h3>
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
        <span>${totalAmount.toFixed(2)}</span>
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
);

const OrderSuccess = () => {
  const navigate = useNavigate();
  
  return (
    <div className="order-success">
      <div className="success-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      </div>
      <h3>Order Confirmed!</h3>
      <p>Thank you for your purchase. Your order has been received and is being processed.</p>
      <p>We've sent a confirmation email with your order details.</p>
      <button 
        onClick={() => navigate('/')}
        className="back-to-shop-btn"
      >
        Back to Shop
      </button>
    </div>
  );
};

export default Checkout;