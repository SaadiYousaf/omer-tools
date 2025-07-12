// src/components/common/BrandSlider/BrandSlider.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './BrandSlider.css';
import { dummyProducts } from '../../../data/dummyProducts';

const BrandSlider = () => {
  const [randomBrands, setRandomBrands] = useState([]);

  useEffect(() => {
    const shuffled = [...dummyProducts].sort(() => 0.5 - Math.random());
    setRandomBrands(shuffled.slice(0, 8));
  }, []);

  return (
    <section className="brand-slider-section">
      <div className="container">
        <div className="brand-grid">
          {randomBrands.map((brand) => (
            <Link 
              to={`/brand/${brand.brand}`} 
              key={brand.id} 
              className="brand-item"
            >
              <div 
                className="brand-card"
                style={{ backgroundImage: `url(${brand.image})` }}
              >
                {/* Image is now a background */}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandSlider;