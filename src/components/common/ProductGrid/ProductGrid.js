// src/components/common/ProductGrid/ProductGrid.js
import React from 'react';
import ProductCard from '../Card/ProductCard';
import './ProductGrid.css';

const ProductGrid = ({ products }) => {
  return (
    <div className="product-grid">
      {products.map(product => (
        <ProductCard 
          key={product.id} 
          id={product.id}
          name={product.name}
          price={product.price}
          image={product.image}
        />
      ))}
    </div>
  );
};

export default ProductGrid;