import React from 'react';
import { Link } from 'react-router-dom';
import './BrandCard.css';

const BrandCard = ({ brand }) => {
  return (
    <Link 
      to={`/brand/${brand.id}`} 
      className="brand-card"
    >
      <img src={brand.logoUrl} alt={brand.name} />
      <h3>{brand.name}</h3>
    </Link>
  );
};

export default BrandCard;