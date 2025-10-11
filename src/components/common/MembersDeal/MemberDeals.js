// src/components/common/MemberDeals/MemberDeals.js
import React from 'react';
import { Link } from 'react-router-dom';
import './MemberDeals.css';

const MemberDeals = () => {
  return (
    <section className="member-deals">
      <div className="deals-background"></div>
      <div className="container">
        <div className="deals-content">
          <h2>Exclusive Deals For Our Members</h2>
          <p className="deals-subtitle">Unlock premium discounts and early access to sales</p>
          <Link to="/membership" className="cta-button pulse">
            Become A Member
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MemberDeals;