// src/pages/Membership/MembershipPage.js
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './MembershipPage.css';


const MembershipPage = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name:`${user.name}`,
    email: `${user.email}`,
    password: `${user.password}`,
    confirmPassword: `${user.password}`,
    plan: 'basic'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        navigate('/welcome'); // Redirect to welcome page after submission
      }, 1500);
    }
  };

  return (
    <div className="membership-page">
      <div className="container">
        <h1>Become a Member</h1>
        
        <div className="membership-benefits">
          {/* Benefits cards remain the same */}
        </div>

        <div className="registration-form">
          <h2>Create Your Account</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? 'error' : ''}
              />
              {errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword}</span>
              )}
            </div>

            <div className="form-group">
              <label>Membership Plan</label>
              <div className="plan-options">
                <label>
                  <input
                    type="radio"
                    name="plan"
                    value="basic"
                    checked={formData.plan === 'basic'}
                    onChange={handleChange}
                  />
                  Basic ($9.99/month)
                </label>
                <label>
                  <input
                    type="radio"
                    name="plan"
                    value="premium"
                    checked={formData.plan === 'premium'}
                    onChange={handleChange}
                  />
                  Premium ($19.99/month)
                </label>
              </div>
            </div>

            <button 
              type="submit" 
              className="join-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Join Now'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MembershipPage;