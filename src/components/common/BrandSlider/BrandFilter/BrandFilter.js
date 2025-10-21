import React, { useState } from 'react';
import BrandCard from '../BrandCard/BrandCard';
import './BrandFilter.css';

const BrandFilter = ({ brands }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBrands = brands.filter(brand => 
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="brand-filter">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search brands..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="brands-grid">
        {filteredBrands.map(brand => (
          <BrandCard key={brand.id} brand={brand} />
        ))}
      </div>
    </div>
  );
};

export default BrandFilter;