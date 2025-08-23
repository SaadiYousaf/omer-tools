import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Payment from '../../components/common/Payment/Payment';
import Confirmation from '../../components/common/Confirmation/Confirmation';
import ScrollToTop from "../../components/common/Scroll/ScrollToTop";
import axios from 'axios';
import './Checkout.css';

const Checkout = () => {
  const [step, setStep] = useState(1);
  const [shippingData, setShippingData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [paymentError, setPaymentError] = useState(null);
  const [orderError, setOrderError] = useState(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const { items, totalAmount } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.auth);
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
    setPaymentError(null);
    nextStep();
  };

  const handlePaymentError = (error) => {
    setPaymentError(error);
  };

 // In your Checkout.js component
 const handlePlaceOrder = async () => {
  setOrderLoading(true);
  setOrderError(null);
  
  try {
    const token = localStorage.getItem('token');
    
    // Format order data to match backend expectations
    const orderData = {
      sessionId: `session_${Date.now()}`,
      userEmail: shippingData.email,
      orderItems: items.map(item => ({
        productId: item.id.toString(),
        productName: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
        imageUrl: item.image || ''
      })),
      paymentMethod: 'credit_card',
      paymentMethodId: 'pm_card_visa',
      cardData: paymentData ? {
        Number: paymentData.cardNumber.replace(/\s/g, ''),
        Expiry: paymentData.expiryDate,
        Cvc: paymentData.cvv,
        Name: paymentData.cardName
      } : null,
      shippingAddress: {
        fullName: shippingData.fullName,
        addressLine1: shippingData.address,
        addressLine2: '',
        city: shippingData.city,
        state: shippingData.state,
        postalCode: shippingData.postalCode,
        country: shippingData.country
      }
    };

    console.log('Sending order data:', JSON.stringify(orderData, null, 2));

    // Send order to backend
    const response = await axios.post('http://localhost:5117/api/orders', orderData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Order response:', response.data);

    if (response.data.status === "succeeded") {
      console.log('Order created:', response.data);
      nextStep();
      
      // Clear cart after successful order
      // You might want to dispatch an action to clear the cart here
    } else {
      throw new Error(response.data.message || 'Failed to create order');
    }
  } catch (error) {
    console.error('Order creation error:', error);
    if (error.response?.data) {
      console.error('Backend error details:', error.response.data);
      
      // Log validation errors if they exist
      if (error.response.data.errors) {
        console.error('Validation errors:', error.response.data.errors);
      }
      
      setOrderError(error.response.data.title || error.response.data.message || 'Failed to place order. Please try again.');
    } else if (error.request) {
      console.error('Request error:', error.request);
      setOrderError('Network error. Please check your connection and try again.');
    } else {
      setOrderError('Failed to place order. Please try again.');
    }
  } finally {
    setOrderLoading(false);
  }
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
            onError={handlePaymentError}
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
            loading={orderLoading}
            error={orderError}
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
      
      {paymentError && (
        <div className="global-payment-error">
          <span>⚠️</span>
          <p>{paymentError}</p>
        </div>
      )}
      
      {renderStep()}
    </div>
  );
};

// The ShippingForm, OrderSummary, and OrderSuccess components remain the same
// ... (they should be included in your file)
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

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length === 0) {
      onSubmit(formData);
    } else {
      setErrors(formErrors);
    }
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
              className={errors.fullName ? 'error' : ''}
              placeholder="John Doe" 
            />
            {errors.fullName && <span className="error-text">{errors.fullName}</span>}
          </div>
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="john@example.com" 
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label>Address</label>
            <input 
              type="text" 
              name="address" 
              value={formData.address}
              onChange={handleChange}
              className={errors.address ? 'error' : ''}
              placeholder="123 Main St" 
            />
            {errors.address && <span className="error-text">{errors.address}</span>}
          </div>
          <div className="form-group">
            <label>City</label>
            <input 
              type="text" 
              name="city" 
              value={formData.city}
              onChange={handleChange}
              className={errors.city ? 'error' : ''}
              placeholder="New York" 
            />
            {errors.city && <span className="error-text">{errors.city}</span>}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>State/Province</label>
              <input 
                type="text" 
                name="state" 
                value={formData.state}
                onChange={handleChange}
                className={errors.state ? 'error' : ''}
                placeholder="NY" 
              />
              {errors.state && <span className="error-text">{errors.state}</span>}
            </div>
            <div className="form-group">
              <label>Postal Code</label>
              <input 
                type="text" 
                name="postalCode" 
                value={formData.postalCode}
                onChange={handleChange}
                className={errors.postalCode ? 'error' : ''}
                placeholder="10001" 
              />
              {errors.postalCode && <span className="error-text">{errors.postalCode}</span>}
            </div>
          </div>
          <div className="form-group">
            <label>Country</label>
            <select 
              name="country" 
              value={formData.country}
              onChange={handleChange}
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