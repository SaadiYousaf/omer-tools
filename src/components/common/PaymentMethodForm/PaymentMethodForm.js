// src/components/PaymentMethodForm.js
import React, { useState, useEffect } from 'react';
import './PaymentMethodForm.css';

const PaymentMethodForm = ({ method, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    paymentType: 'Credit Card',
    provider: 'Visa',
    last4Digits: '',
    expiryMonth: '',
    expiryYear: '',
    paymentMethodId: '',
    isDefault: false
  });

  useEffect(() => {
    if (method) {
      setFormData({
        paymentType: method.paymentType || 'Credit Card',
        provider: method.provider || 'Visa',
        last4Digits: method.last4Digits || '',
        expiryMonth: method.expiryMonth || '',
        expiryYear: method.expiryYear || '',
        paymentMethodId: method.paymentMethodId || '',
        isDefault: method.isDefault || false
      });
    }
  }, [method]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="payment-method-form-container">
      <h2>{method ? 'Edit Payment Method' : 'Add New Payment Method'}</h2>
      
      <form onSubmit={handleSubmit} className="payment-method-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="paymentType">Payment Type</label>
            <select
              id="paymentType"
              name="paymentType"
              value={formData.paymentType}
              onChange={handleChange}
              required
            >
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="PayPal">PayPal</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="provider">Provider</label>
            <select
              id="provider"
              name="provider"
              value={formData.provider}
              onChange={handleChange}
              required
            >
              <option value="Visa">Visa</option>
              <option value="MasterCard">MasterCard</option>
              <option value="American Express">American Express</option>
              <option value="Discover">Discover</option>
              <option value="PayPal">PayPal</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="last4Digits">Last 4 Digits</label>
          <input
            type="text"
            id="last4Digits"
            name="last4Digits"
            value={formData.last4Digits}
            onChange={handleChange}
            required
            maxLength="4"
            pattern="[0-9]{4}"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="expiryMonth">Expiry Month</label>
            <select
              id="expiryMonth"
              name="expiryMonth"
              value={formData.expiryMonth}
              onChange={handleChange}
              required
            >
              <option value="">Month</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <option key={month} value={month.toString().padStart(2, '0')}>
                  {month.toString().padStart(2, '0')}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="expiryYear">Expiry Year</label>
            <select
              id="expiryYear"
              name="expiryYear"
              value={formData.expiryYear}
              onChange={handleChange}
              required
            >
              <option value="">Year</option>
              {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                <option key={year} value={year.toString()}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="paymentMethodId">Payment Method ID (Optional)</label>
          <input
            type="text"
            id="paymentMethodId"
            name="paymentMethodId"
            value={formData.paymentMethodId}
            onChange={handleChange}
          />
          <p className="help-text">For internal reference if needed</p>
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleChange}
            />
            Set as default payment method
          </label>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="add-to-cart-btn">
            {method ? 'Update Payment Method' : 'Add Payment Method'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentMethodForm;