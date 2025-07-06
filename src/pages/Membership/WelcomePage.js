// src/pages/Membership/WelcomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './WelcomePage.css';
import { useSelector, useDispatch } from 'react-redux';
const WelcomePage = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  return (
    <div className="welcome-page">
      <div className="container">
        <h1>Hi {user.name}</h1>
        <div className="welcome-card">
          <h1>Welcome to Omer Tools!</h1>
          <p>Your membership account has been created successfully.</p>
          <p>You now have access to exclusive deals and benefits.</p>
          <Link to="/" className="cta-button">
            Start Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;