import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    PhoneNumber: '',
    address: ''
  });
  const [errors, setErrors] = useState({});
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.PhoneNumber) newErrors.PhoneNumber = 'Phone number is required';
    if (!formData.address) newErrors.address = 'Address is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Remove confirmPassword from data sent to server
    const { confirmPassword, ...userData } = formData;
    
    const result = await dispatch(registerUser(userData));
    if (registerUser.fulfilled.match(result)) {
      navigate('/');
    }
  };

  return (
    <div className="register-page-container">
      <div className="register-content-wrapper">
        <div className="register-left-panel">
          <div className="register-promo-content">
            <h2>Join Us Today!</h2>
            <p>Create an account to enjoy exclusive benefits, faster checkout, and personalized shopping experiences.</p>
            <div className="register-benefits">
              <div className="benefit-item">
                <span className="benefit-icon">✓</span>
                <span>Faster checkout</span>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">✓</span>
                <span>Order tracking</span>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">✓</span>
                <span>Exclusive deals and offers</span>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">✓</span>
                <span>Personalized recommendations</span>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">✓</span>
                <span>Wishlist and saved items</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="register-right-panel">
          <div className="register-form-container">
            <div className="register-header">
              <h2>Create Your Account</h2>
              <p>Fill in your details to get started</p>
            </div>
            
            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="register-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                    required
                    className={errors.firstName ? 'error' : ''}
                  />
                  {errors.firstName && <span className="field-error">{errors.firstName}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                    required
                    className={errors.lastName ? 'error' : ''}
                  />
                  {errors.lastName && <span className="field-error">{errors.lastName}</span>}
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  required
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="PhoneNumber">Phone Number</label>
                <input
                  id="PhoneNumber"
                  name="PhoneNumber"
                  type="tel"
                  value={formData.PhoneNumber}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                  className={errors.PhoneNumber ? 'error' : ''}
                />
                {errors.PhoneNumber && <span className="field-error">{errors.PhoneNumber}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your full address"
                  required
                  className={errors.address ? 'error' : ''}
                />
                {errors.address && <span className="field-error">{errors.address}</span>}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    required
                    className={errors.password ? 'error' : ''}
                  />
                  {errors.password && <span className="field-error">{errors.password}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                    className={errors.confirmPassword ? 'error' : ''}
                  />
                  {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
                </div>
              </div>
              
              <div className="terms-agreement">
                <input type="checkbox" id="terms" required />
                <label htmlFor="terms">
                  I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>
                </label>
              </div>
              
              <button type="submit" disabled={loading} className="register-submit-btn">
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
            
            <div className="login-redirect">
              Already have an account? <a href="/login" className="login-link">Sign in here</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;