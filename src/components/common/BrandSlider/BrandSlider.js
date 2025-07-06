// src/components/common/BrandSlider/BrandSlider.js
import React from 'react';
import { Link } from 'react-router-dom';
import './BrandSlider.css';
import { dummyProducts } from '../../../data/dummyProducts';
// import brand1 from "./brands/brand1.PNG";
// import brand2 from "./brands/brand2.PNG";
// import brand3 from "./brands/brand3.PNG";
// import brand4 from "./brands/brand4.PNG";
// import brand5 from "./brands/brand5.PNG";

// export const brands = [
//   { id: 1, name: 'Milwaukee', logo: brand1, slug: 'milwaukee', tagline: 'HIGH PERFORMANCE POWER TOOLS' },
//   { id: 2, name: 'DEWALT', logo: brand2, slug: 'dewalt', tagline: 'PROFESSIONAL POWER TOOL SOLUTIONS' },
//   { id: 3, name: 'HIKOKI', logo: brand3, slug: 'hikoki', tagline: 'INNOVATIVE POWER TOOLS' },
//   { id: 4, name: 'Traktia', logo: brand4, slug: 'traktia', tagline: 'INDUSTRIAL GRADE EQUIPMENT' },
//   { id: 5, name: 'metabo', logo: brand5, slug: 'metabo', tagline: 'GERMAN ENGINEERING' },
//   { id: 6, name: 'BUCKAROO', logo: brand1, slug: 'buckaroo', tagline: 'WORKWEAR & SAFETY' },
//   { id: 7, name: 'Leica', logo: brand2, slug: 'leica', tagline: 'PRECISION MEASUREMENT' },
//   { id: 8, name: 'ESL1971', logo: brand3, slug: 'esl1971', tagline: 'PROFESSIONAL GEOSYSTEMS' }
// ];

const BrandSlider = () => {
  return (
    <section className="brand-slider-section">
      <div className="container">
        <h2 className="section-title">Shop By Brand</h2>
        <div className="brand-slider">
            
          {dummyProducts.map((brand) => (
            <Link 
              to={`/brand/${brand.brand}`} 
              key={brand.id} 
              className="brand-slide"
            >
              <div className="brand-card">
                <img 
                  src={brand.image} 
                  alt={brand.name} 
                  className="brand-logo"
                  loading="lazy"
                />
                <p className="brand-tagline">{brand.brand}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandSlider;