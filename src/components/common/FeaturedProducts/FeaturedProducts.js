// src/components/common/FeaturedProducts/FeaturedProducts.js
import React from 'react';
import { useSelector } from 'react-redux';
import ProductCard from '../Card/ProductCard';
import './FeaturedProducts.css';

const FeaturedProducts = () => {
  // Add proper null checks and ensure items is an array
  const products = useSelector(state => 
    Array.isArray(state.products?.items) 
      ? state.products.items.slice(0, 4) 
      : []
  );
  
  return (
    <div className="featured-products">
      <h2>Featured Products</h2>
      <div className="products-grid">
        {products.length > 0 ? (
          products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div>No featured products available</div>
        )}
      </div>
    </div>
  );
};

export default FeaturedProducts;