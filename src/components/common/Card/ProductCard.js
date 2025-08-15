import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart } from "../../../store/cartSlice";
import { 
  FaCartPlus, 
  FaHeart, 
  FaRegHeart, 
  FaArrowsAlt, 
  FaStar, 
  FaRegStar,
  FaStarHalfAlt 
} from "react-icons/fa";
import "./ProductCard.css";

const renderRating = (rating = 0) => {
  const stars = [];
  const normalizedRating = Math.min(Math.max(rating, 0), 5);
  const fullStars = Math.floor(normalizedRating);
  const hasHalfStar = normalizedRating % 1 >= 0.5;

  for (let i = 0; i < fullStars; i++) {
    stars.push(<FaStar key={`full-${i}`} className="star" />);
  }

  if (hasHalfStar) {
    stars.push(<FaStarHalfAlt  key="half" className="star" />);
  }

  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<FaRegStar key={`empty-${i}`} className="star" />);
  }

  return stars;
};

const ProductCard = ({ product, linkTo }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  
  // Memoized image URL handler
  const getImageUrl = useCallback((path) => {
    if (!path) return "/images/products/default.png";
    if (path.startsWith("http") || path.startsWith("/")) return path;
    return `/uploads/${path}`;
  }, []);

  if (!product) return null;

  // Calculate pricing info
  const price = parseFloat(product.price) || 0;
  const discountPrice = parseFloat(product.discountPrice) || null;
  const hasDiscount = discountPrice !== null && discountPrice < price;
  const discountPercentage = hasDiscount
    ? Math.round(((price - discountPrice) / price) * 100)
    : 0;

  // Stock status handling
  const stockQuantity = product.stockQuantity || 0;
  const cartItem = cartItems.find(item => item.id === product.id);
  const cartQuantity = cartItem ? cartItem.quantity : 0;
  
  // Calculate available stock considering items already in cart
  const availableStock = Math.max(0, stockQuantity - cartQuantity);
  const isOutOfStock = availableStock < 1;
  const isLowStock = availableStock > 0 && availableStock <= 10;
  
  // Determine stock status class and text
  const stockStatusClass = isOutOfStock 
    ? 'out-of-stock' 
    : isLowStock 
      ? 'low-stock' 
      : 'in-stock';
  
  const stockStatusText = isOutOfStock 
    ? 'Out of Stock' 
    : isLowStock 
      ? `Low Stock (${availableStock} left)` 
      : 'In Stock';

  // Cart functionality
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isAdding || isOutOfStock) return;
    
    setIsAdding(true);
    
    const mainImage = getImageUrl(product.images?.[0]?.imageUrl);
    const priceToUse = hasDiscount ? discountPrice : price;
    
    dispatch(addItemToCart({
      id: product.id,
      name: product.name,
      price: priceToUse,
      image: mainImage,
      quantity: 1,
      maxQuantity: stockQuantity
    }));
    
    // Reset animation state
    setTimeout(() => setIsAdding(false), 1200);
  };

  // Wishlist functionality
  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  // Quick view placeholder
  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Quick view for:", product.id);
  };

  return (
    <article 
      className={`product-card ${isHovered ? 'hovered' : ''}`} 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={`Product: ${product.name}`}
    >
      {/* Discount ribbon */}
      {hasDiscount && (
        <div 
          className="discount-ribbon" 
          aria-label={`${discountPercentage}% discount`}
        >
          Save {discountPercentage}%
        </div>
      )}

      {/* New arrival ribbon */}
      {product.isNew && (
        <div className="new-ribbon" aria-label="New arrival">
          New
        </div>
      )}

      {/* Quick actions */}
      <div className="quick-actions">
        <button 
          className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
          onClick={toggleWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isWishlisted ? <FaHeart aria-hidden="true" /> : <FaRegHeart aria-hidden="true" />}
        </button>
        <button 
          className="quick-view-btn"
          onClick={handleQuickView}
          aria-label="Quick view"
        >
          <FaArrowsAlt aria-hidden="true" />
        </button>
      </div>

      {/* Product image */}
      <Link 
        to={linkTo || `/product/${product.id}`} 
        className="card-link"
        aria-label={`View details for ${product.name}`}
      >
        <div className="image-container">
          <img
            src={getImageUrl(product.images?.[0]?.imageUrl)}
            alt={product.name}
            className="product-image"
            loading="lazy"
            onError={(e) => (e.target.src = "/images/default-product.jpg")}
          />
          
          {/* Hover overlay */}
          {isHovered && (
            <div className="image-overlay">
              <div className="overlay-content">
                <span>View Details</span>
              </div>
            </div>
          )}
        </div>
      </Link>

      <div className="product-info">
        <Link 
          to={linkTo || `/product/${product.id}`} 
          className="card-link"
          aria-label={`View details for ${product.name}`}
        >
          <div className="brand-tag">{product.brand || "Premium Brand"}</div>
          <h3 className="product-title">{product.name}</h3>
          
          <div className="product-meta">
            <div className="product-rating">
              {renderRating(product.rating || 4.5)}
              <span className="rating-count">
                ({product.reviewCount || 42} reviews)
              </span>
            </div>
            
            <div className="stock-indicator">
              <div className={`status-dot ${stockStatusClass}`}></div>
              {stockStatusText}
            </div>
          </div>
        </Link>
        
        <div className="price-container">
          {hasDiscount ? (
            <>
              <span className="current-price">
                ${discountPrice.toFixed(2)}
              </span>
              <span className="original-price">${price.toFixed(2)}</span>
            </>
          ) : (
            <span className="current-price">
              ${price.toFixed(2)}
            </span>
          )}
        </div>
        
        <div className="product-actions">
          <button 
            className={`add-to-cart-btn ${isAdding ? 'adding' : ''} ${isOutOfStock ? 'disabled' : ''}`}
            onClick={handleAddToCart}
            disabled={isAdding || isOutOfStock}
            aria-label={isOutOfStock ? "Out of stock" : "Add to cart"}
          >
            <FaCartPlus className="cart-icon" aria-hidden="true" />
            <span>
              {isAdding 
                ? 'Added to Cart' 
                : isOutOfStock 
                  ? 'Out of Stock' 
                  : 'Add to Cart'}
            </span>
          </button>
        </div>
        
        <div className="features-list">
          <div className="feature">
            <div className="feature-icon" aria-hidden="true">✓</div>
            <div className="feature-text">Free Shipping</div>
          </div>
          <div className="feature">
            <div className="feature-icon" aria-hidden="true">✓</div>
            <div className="feature-text">3-Year Warranty</div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;