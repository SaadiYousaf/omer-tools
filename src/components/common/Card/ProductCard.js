// src/components/common/Card/ProductCard.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addItemToCart } from '../../../store/cartSlice';
import { FiPlus } from 'react-icons/fi';
import './ProductCard.css';

const ProductCard = ({ product, isFeatured = false }) => {
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);

  if (!product) return null;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(addItemToCart({
      id: product.id,
      name: product.name,
      price: product.discountedPrice || product.price,
      image: product.image || '/images/default-product.jpg',
      quantity: 1
    }));
  };

  // Calculate discount if original price and discounted price exist
  const hasDiscount = product.price && product.discountedPrice && product.discountedPrice < product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
    : 0;
  const discountAmount = hasDiscount 
    ? (product.price - product.discountedPrice).toFixed(2)
    : 0;

  const displayPrice = product.discountedPrice || product.price;

  return (
    <article 
      className="ultra-product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="card-media">
        <div className="image-container">
          <img
            src={product.image || '/images/default-product.jpg'}
            alt={product.name || 'Product image'}
            loading="lazy"
            className="product-image"
            onError={(e) => {
              e.target.src = '/images/default-product.jpg';
            }}
          />
          {isFeatured && hasDiscount && (
            <div className="discount-badge">
              <span className="discount-percentage">{discountPercentage}% OFF</span>
              <span className="discount-amount">Save ₹{discountAmount}</span>
            </div>
          )}
          <div className={`quick-shop ${isHovered ? 'visible' : ''}`}>
            <button className="add-cart-button" onClick={handleAddToCart}>
              <FiPlus className="icon" />
              <span>Quick Add</span>
            </button>
          </div>
        </div>
      </div>

      <div className="card-content">
        <h3 className="product-title">{product.name || 'Product Name'}</h3>
        <div className="price-container">
          {hasDiscount && (
            <span className="original-price">₹{product.price.toFixed(2)}</span>
          )}
          <span className="current-price">₹{displayPrice.toFixed(2)}</span>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;