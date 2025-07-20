import React from "react";
import { Link } from 'react-router-dom';
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  if (!product) return null;

  const hasDiscount = product.price && product.discountedPrice && 
                     product.discountedPrice < product.price;

  return (
    
    <article className="apple-product-card">
      <Link to={`/product/${product.id}`} className="product-link">
        {hasDiscount && (
          <div className="discount-badge">
            SAVE ${product.price - product.discountedPrice}
          </div>
        )}

        <div className="product-image-container">
          <img
            src={product.image || "/images/default-product.jpg"}
            alt={product.name || "Product"}
            loading="lazy"
            className="product-image"
            onError={(e) => {
              e.target.src = "/images/default-product.jpg";
            }}
          />
        </div>

        <div className="product-info">
          <h3 className="product-title">{product.name || "Product Name"}</h3>
          
          <div className="price-container">
            {hasDiscount ? (
              <>
                <span className="current-price">${product.discountedPrice.toFixed(2)}</span>
                <span className="original-price">${product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="current-price">${product.price?.toFixed(2) || "0.00"}</span>
            )}
          </div>
          
          <div className="color-options">
            <span className="color-label">Color: </span>
            {product.colors ? (
              <>
                {product.colors.slice(0, 3).map((color, index) => (
                  <span 
                    key={index} 
                    className="color-option" 
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
                {product.colors.length > 3 && (
                  <span className="more-colors">+{product.colors.length - 3}</span>
                )}
              </>
            ) : (
              <span className="no-colors">—</span>
            )}
          </div>
        </div>
      </Link>
      

    </article>
  );
};

export default ProductCard;