// src/pages/ClearanceSale.js
import React from 'react';
import FeaturedProducts from '../../components/common/FeaturedProducts/FeaturedProducts';
import './ClearanceSale.css';

const ClearanceSale = () => {
    
  return (
    <div className="clearance-sale-page">
      <section className="clearance-hero">
        <div className="hero-content">
          <h1>Clearance Sale</h1>
          <p>Huge discounts on selected items. Limited time offer!</p>
        </div>
      </section>

      <section className="clearance-products">
        <div className="container">
          <FeaturedProducts />
        </div>
      </section>
    </div>
  );
};

export default ClearanceSale;