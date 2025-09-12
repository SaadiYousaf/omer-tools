import React from 'react';
import { Link } from 'react-router-dom';
import './BrandCard.css';

const BASE_URL = process.env.REACT_APP_BASE_IMG_URL;
const BrandCard = ({ brand }) => {
  return (
    <Link 
      to={`/brand/${brand.id}`} 
      className="brand-card"
    >
      <div className='brand-image'>
         <img src={`${brand.imageUrl}`} alt={brand.name} />
      </div>
      <h3>{brand.name}</h3>
    </Link>
  );
};

export default BrandCard;