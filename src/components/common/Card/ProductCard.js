import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./ProductCard.css";
import ScrollToTop from "../Scroll/ScrollToTop";

const ProductCard = ({ product, linkTo, description }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [needsSeeMore, setNeedsSeeMore] = useState(false);
  const descriptionRef = useRef(null);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/images/products/default.png";
    if (imagePath.startsWith("http")) return imagePath;
    if (imagePath.startsWith("/")) return imagePath;
    return `/uploads/${imagePath}`;
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    // Check if text is being truncated
    if (descriptionRef.current) {
      const isTextTruncated =
        descriptionRef.current.scrollHeight >
        descriptionRef.current.clientHeight;
      setNeedsSeeMore(isTextTruncated);
    }
  }, [description]);

  if (!product) return null;

  const hasDiscount = product.price &&
    product.discountPrice &&
    product.discountPrice < product.price;

  const discountPercentage = hasDiscount 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const toggleDescription = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowFullDescription(!showFullDescription);
  };

  return (
    <article className="apple-product-card">
      <ScrollToTop />
      <Link to={linkTo || `/product/${product.id}`} className="product-link">
        {hasDiscount && (
          <div className="discount-badge">
            {discountPercentage}% OFF
          </div>
        )}

        <div className="product-image-container">
          <img
            src={getImageUrl(product.images?.[0]?.imageUrl || product.imageUrl)}
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
                <span className="current-price">
                  ${product.discountPrice.toFixed(2)}
                </span>
                <span className="original-price">
                  ${product.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="current-price">
                ${product.price?.toFixed(2) || "0.00"}
              </span>
            )}
          </div>

          <div
            ref={descriptionRef}
            className={`product-description ${
              showFullDescription ? "expanded" : "clamped"
            }`}
          >
            {description || product.description}
          </div>

          {needsSeeMore && (
            <button className="see-more-button" onClick={toggleDescription}>
              {showFullDescription ? "Show Less" : "Show More"}
            </button>
          )}
        </div>
      </Link>
    </article>
  );
};

export default ProductCard;