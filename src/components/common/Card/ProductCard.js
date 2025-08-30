import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart } from "../../../store/cartSlice";
import { 
  FaCartPlus, 
  FaHeart, 
  FaRegHeart, 
  FaStar, 
  FaRegStar,
  FaStarHalfAlt
} from "react-icons/fa";
import "./ProductCard.css";
const BASE_IMG_URL = process.env.REACT_APP_BASE_IMG_URL;

const renderRating = (rating = 0) => {
  const stars = [];
  const normalizedRating = Math.min(Math.max(rating, 0), 5);
  const fullStars = Math.floor(normalizedRating);
  const hasHalfStar = normalizedRating % 1 >= 0.5;

  for (let i = 0; i < fullStars; i++) {
    stars.push(<FaStar key={`full-${i}`} className="star" />);
  }
  if (hasHalfStar) {
    stars.push(<FaStarHalfAlt key="half" className="star" />);
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

  const getImageUrl = useCallback((path) => {
    if (!path) return "/images/products/default.png";
    // if (path.startsWith("http") || path.startsWith("/")) return path;
    if (path.startsWith("/")) return `${BASE_IMG_URL}${path}`;
    return `${BASE_IMG_URL}${path}`;
  }, []);

  if (!product) return null;

  const price = parseFloat(product.price) || 0;
  const discountPrice = parseFloat(product.discountPrice) || null;
  const hasDiscount = discountPrice !== null && discountPrice < price;

  const stockQuantity = product.stockQuantity || 0;
  const cartItem = cartItems.find(item => item.id === product.id);
  const cartQuantity = cartItem ? cartItem.quantity : 0;

  const availableStock = Math.max(0, stockQuantity - cartQuantity);
  const isOutOfStock = availableStock < 1;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

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
  };

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <article 
      className="product-card-milwaukee"
      aria-label={`Product: ${product.name}`}
    >
      {/* Discount ribbon */}
      {hasDiscount && (
        <div className="discount-ribbon" aria-label="Discount">
          Sale
        </div>
      )}

      {/* Tagline ribbon */}
      {product.tagLine && (
        <div className="tagline-ribbon" aria-label="Tagline">
          {product.tagLine}
        </div>
      )}

      {/* Wishlist button */}
      <button 
        className={`wishlist-btn ${isWishlisted ? "active" : ""}`}
        onClick={toggleWishlist}
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        {isWishlisted ? <FaHeart aria-hidden="true" /> : <FaRegHeart aria-hidden="true" />}
      </button>

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
        </div>
      </Link>

      <div className="product-info">
        <div className="product-rating">
          {renderRating(product.rating || 4.5)}
          <span className="rating-count">({product.reviewCount || 42})</span>
        </div>
        
        <Link 
          to={linkTo || `/product/${product.id}`} 
          className="card-link"
          aria-label={`View details for ${product.name}`}
        >
          <h3 className="product-title">{product.name}</h3>
        </Link>
        
        <div className="price-container">
          {hasDiscount ? (
            <>
              <span className="current-price">${discountPrice.toFixed(2)}</span>
              <span className="original-price">${price.toFixed(2)}</span>
            </>
          ) : (
            <span className="current-price">${price.toFixed(2)}</span>
          )}
        </div>
        
        <div className="product-actions">
          <button 
            className={`add-to-cart-btn ${isOutOfStock ? "disabled" : ""}`}
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            aria-label={isOutOfStock ? "Out of stock" : "Add to cart"}
          >
            <FaCartPlus className="cart-icon" aria-hidden="true" />
            <span>{isOutOfStock ? "Out of Stock" : "Add to Cart"}</span>
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
