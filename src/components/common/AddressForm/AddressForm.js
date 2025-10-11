// src/components/AddressForm.js
import React, { useState, useEffect } from 'react';
//import './AddressForm.css';

const AddressForm = ({ address, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    addressType: 'Home',
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    phoneNumber: '',
    isDefault: false
  });

  useEffect(() => {
    if (address) {
      setFormData({
        addressType: address.addressType || 'Home',
        fullName: address.fullName || '',
        addressLine1: address.addressLine1 || '',
        addressLine2: address.addressLine2 || '',
        city: address.city || '',
        state: address.state || '',
        postalCode: address.postalCode || '',
        country: address.country || 'United States',
        phoneNumber: address.phoneNumber || '',
        isDefault: address.isDefault || false
      });
    }
  }, [address]);

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
    <div className="address-form-container">
      <h2>{address ? 'Edit Address' : 'Add New Address'}</h2>
      
      <form onSubmit={handleSubmit} className="address-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="addressType">Address Type</label>
            <select
              id="addressType"
              name="addressType"
              value={formData.addressType}
              onChange={handleChange}
              required
            >
              <option value="Home">Home</option>
              <option value="Work">Work</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="addressLine1">Address Line 1</label>
          <input
            type="text"
            id="addressLine1"
            name="addressLine1"
            value={formData.addressLine1}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="addressLine2">Address Line 2 (Optional)</label>
          <input
            type="text"
            id="addressLine2"
            name="addressLine2"
            value={formData.addressLine2}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="state">State</label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="postalCode">Postal Code</label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="country">Country</label>
          <select
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
          >
            <option value="United States">United States</option>
            <option value="Canada">Canada</option>
            <option value="United Kingdom">United Kingdom</option>
            {/* Add more countries as needed */}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number (Optional)</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleChange}
            />
            Set as default address
          </label>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {address ? 'Update Address' : 'Add Address'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressForm;