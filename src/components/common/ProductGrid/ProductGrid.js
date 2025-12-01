// src/components/common/ProductGrid/ProductGrid.js
import React from 'react';
import ProductCard from '../Card/ProductCard';
import './ProductGrid.css';
import { nameUrlUtils } from '../../Utils/nameUrlUtils';

const ProductGrid = ({ products }) => {
  return (
    <div className="product-grid">
      {products.map(product => (
        <ProductCard 
          key={product.id} 
          product={product}
            linkTo={`/product/${nameUrlUtils.convertNameToUrl(product.canonicalUrl)}`}
        />
      ))}
    </div>
  );
};

export default ProductGrid;