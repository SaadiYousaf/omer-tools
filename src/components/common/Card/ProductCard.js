// src/components/common/Card/ProductCard.js
import React from "react";
import { Link } from 'react-router-dom';
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  if (!product) return null;

  const hasDiscount =
    product.price &&
    product.discountedPrice &&
    product.discountedPrice < product.price;

  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.price - product.discountedPrice) / product.price) * 100
      )
    : 0;

  const displayPrice = product.discountedPrice || product.price;

  return (
    <article className="apple-product-card">
      <Link to={`/product/${product.id}`} className="product-link">
        {hasDiscount && (
          <div className="discount-badge">{discountPercentage}% OFF</div>
        )}

        <div className="card-media">
          <img
            src={product.image || "/images/default-product.jpg"}
            alt={product.name || "Product image"}
            loading="lazy"
            className="product-image"
            onError={(e) => {
              e.target.src = "/images/default-product.jpg";
            }}
          />
        </div>

        <div className="card-content">
          <h3 className="product-title">{product.name || "Product Name"}</h3>
          <div className="price-container">
            {hasDiscount && (
              <span className="original-price">
                ${product.price.toFixed(2)}
              </span>
            )}
            <span className="current-price">${displayPrice.toFixed(2)}</span>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default ProductCard;
