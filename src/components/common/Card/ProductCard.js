
import React from "react";
import { Link } from 'react-router-dom';
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  if (!product) return null;

  const hasDiscount = product.price && product.discountedPrice && 
                     product.discountedPrice < product.price;

  const discountPercentage = hasDiscount
    ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
    : 0;

  return (
    <article className="apple-watch-card">
      <Link to={`/product/${product.id}`} className="product-link">
        {hasDiscount && (
          <div className="discount-badge">Save {discountPercentage}%</div>
        )}

        <div className="card-media">
          <img
            src={product.image || "/images/default-product.jpg"}
            alt={product.name || "Apple Watch"}
            loading="lazy"
            className="product-image"
            onError={(e) => {
              e.target.src = "/images/default-product.jpg";
            }}
          />
        </div>

        <div className="card-content">
          {product.badge && (
            <div className="product-badge">{product.badge}</div>
          )}
          <h3 className="product-title">{product.name}</h3>
          <p className="product-subtitle">{product.subtitle}</p>
          
          <div className="price-container">
            {hasDiscount ? (
              <>
                <span className="original-price">${product.price.toFixed(2)}</span>
                <span className="current-price">${product.discountedPrice.toFixed(2)}</span>
              </>
            ) : (
              <span className="current-price">${product.price?.toFixed(2) || "0.00"}</span>
            )}
          </div>
          
          {product.colors && (
            <div className="color-options">
              {product.colors.slice(0, 3).map((color, index) => (
                <span 
                  key={index} 
                  className="color-option" 
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
              {product.colors.length > 3 && (
                <span className="more-colors">{product.colors.length - 3}+ colors</span>
              )}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
};

export default ProductCard;