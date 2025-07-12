import React from 'react';
import { Link } from 'react-router-dom';
import './CategorySlider.css';

const CategorySlider = ({ categories }) => {
  return (
    <div className="category-slider">
      {categories.map(category => (
        <Link 
          to={`/category/${category.slug}`} 
          key={category.id} 
          className="category-card"
        >
          <div className="category-image">
            {}
            <div className="placeholder-image">{category.name.charAt(0)}</div>
          </div>
          <h3>{category.name}</h3>
        </Link>
      ))}
    </div>
  );
};

export default CategorySlider;