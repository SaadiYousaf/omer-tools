import React, { useRef, useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { 
  FiChevronLeft, 
  FiChevronRight, 
  FiArrowRight, 
  FiStar, 
  FiAward, 
  FiZap, 
  FiTrendingUp,
  FiCheckCircle,
  FiShield,
  FiHeart,
  FiEye,
  FiShoppingCart
} from "react-icons/fi";
import { FaStar, FaRegStar, FaStarHalfAlt, FaHeart as FaSolidHeart } from "react-icons/fa";
import { fetchAllProducts, selectAllProducts, selectProductsStatus } from "../../../store/productsSlice";
import { addItemToCart } from "../../../store/cartSlice";
import "./ProductSlider.css";

const ProductSlider = ({ 
  title = "Premium Collections", 
  subtitle = "Discover our enterprise-grade solutions designed for professionals",
  maxItems = 8 
}) => {
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const status = useSelector(selectProductsStatus);
  const cartItems = useSelector(state => state.cart.items);
  const sliderRef = useRef(null);
  const [showArrows, setShowArrows] = useState({ left: false, right: true });
  const [visibleItems, setVisibleItems] = useState(4);
  const [wishlistedItems, setWishlistedItems] = useState({});
  const scrollTimeoutRef = useRef(null);

  // Filter products with non-null tagline and limit to maxItems
  const taggedProducts = products
    .filter(product => product.tagLine && product.tagLine.trim() !== "")
    .slice(0, maxItems);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAllProducts());
    }

    // Calculate visible items based on container width
    const updateVisibleItems = () => {
      const width = window.innerWidth;
      if (width < 640) setVisibleItems(1);
      else if (width < 768) setVisibleItems(2);
      else if (width < 1024) setVisibleItems(3);
      else setVisibleItems(4);
    };

    updateVisibleItems();
    window.addEventListener('resize', updateVisibleItems);
    
    return () => window.removeEventListener('resize', updateVisibleItems);
  }, [status, dispatch]);

  const checkScrollPosition = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      if (sliderRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
        setShowArrows({
          left: scrollLeft > 10,
          right: scrollLeft < scrollWidth - clientWidth - 10,
        });
      }
    }, 100);
  }, []);

  useEffect(() => {
    checkScrollPosition();

    const slider = sliderRef.current;
    if (!slider) return;

    slider.addEventListener("scroll", checkScrollPosition);
    return () => {
      slider.removeEventListener("scroll", checkScrollPosition);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [checkScrollPosition, taggedProducts]);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === "left" ? -sliderRef.current.offsetWidth : sliderRef.current.offsetWidth;
      sliderRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScrollPosition, 300);
    }
  };

  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) {
      const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
      return primaryImage.imageUrl;
    }
    
    if (product.imageUrl) return product.imageUrl;
    
    return "/images/products/default.png";
  };

  // Function to determine tagline style based on content
  const getTaglineStyle = (tagline) => {
    const lowerTagline = tagline.toLowerCase();
    
    if (lowerTagline.includes('sale') || lowerTagline.includes('deal') || lowerTagline.includes('offer')) {
      return "sale";
    } else if (lowerTagline.includes('new') || lowerTagline.includes('launch')) {
      return "new";
    } else if (lowerTagline.includes('featured') || lowerTagline.includes('popular')) {
      return "featured";
    } else if (lowerTagline.includes('premium') || lowerTagline.includes('exclusive')) {
      return "premium";
    } else if (lowerTagline.includes('limited')) {
      return "limited";
    } else if (lowerTagline.includes('enterprise') || lowerTagline.includes('business')) {
      return "enterprise";
    }
    
    return "default";
  };

  // Function to get icon based on tagline style
  const getTaglineIcon = (style) => {
    switch(style) {
      case "sale": return <FiAward className="tagline-icon" />;
      case "new": return <FiZap className="tagline-icon" />;
      case "featured": return <FiStar className="tagline-icon" />;
      case "premium": return <FiTrendingUp className="tagline-icon" />;
      case "limited": return <FiAward className="tagline-icon" />;
      case "enterprise": return <FiShield className="tagline-icon" />;
      default: return <FiCheckCircle className="tagline-icon" />;
    }
  };

  const toggleWishlist = (productId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlistedItems(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const mainImage = getProductImage(product);
    const price = parseFloat(product.price) || 0;
    const discountPrice = parseFloat(product.discountPrice) || null;
    const priceToUse = discountPrice !== null && discountPrice < price ? discountPrice : price;
    
    dispatch(addItemToCart({
      id: product.id,
      name: product.name,
      price: priceToUse,
      image: mainImage,
      quantity: 1,
      maxQuantity: product.stockQuantity || 10
    }));
  };

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

  if (status === "loading") {
    return (
      <section className="enterprise-product-slider">
        <div className="slider-header">
          <div className="header-content">
            <h2 className="slider-title">{title}</h2>
            <p className="slider-subtitle">{subtitle}</p>
          </div>
          <div className="slider-controls">
            <div className="slider-dots">
              {[...Array(Math.ceil(maxItems / visibleItems))].map((_, i) => (
                <div key={i} className="dot"></div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="slider-container">
          <div className="product-grid">
            {[...Array(visibleItems)].map((_, index) => (
              <div key={`skeleton-${index}`} className="product-card-milwaukee skeleton">
                <div className="image-container"></div>
                <div className="product-info">
                  <div className="product-rating">
                    <div className="star-placeholder"></div>
                  </div>
                  <div className="title-placeholder"></div>
                  <div className="price-placeholder"></div>
                  <div className="button-placeholder"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (status === "failed") {
    return (
      <section className="enterprise-product-slider">
        <div className="slider-header">
          <div className="header-content">
            <h2 className="slider-title">{title}</h2>
            <p className="slider-subtitle">{subtitle}</p>
          </div>
        </div>
        
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>Unable to load products</h3>
          <p>Please check your connection and try again</p>
          <button className="retry-button" onClick={() => dispatch(fetchAllProducts())}>
            Retry
          </button>
        </div>
      </section>
    );
  }

  if (taggedProducts.length === 0) {
    return null;
  }

  return (
    <section className="enterprise-product-slider">
      <div className="slider-header">
        <div className="header-content">
          <h2 className="slider-title">{title}</h2>
          <p className="slider-subtitle">{subtitle}</p>
        </div>
        <div className="slider-controls">
          <div className="slider-dots">
            {[...Array(Math.ceil(taggedProducts.length / visibleItems))].map((_, i) => (
              <button 
                key={i} 
                className="dot"
                onClick={() => {
                  if (sliderRef.current) {
                    sliderRef.current.scrollTo({
                      left: i * sliderRef.current.offsetWidth,
                      behavior: 'smooth'
                    });
                  }
                }}
              ></button>
            ))}
          </div>
          <div className="arrow-controls">
            <button
              className={`slider-arrow left-arrow ${!showArrows.left ? 'disabled' : ''}`}
              onClick={() => scroll("left")}
              disabled={!showArrows.left}
              aria-label="Previous products"
            >
              <FiChevronLeft />
            </button>
            <button
              className={`slider-arrow right-arrow ${!showArrows.right ? 'disabled' : ''}`}
              onClick={() => scroll("right")}
              disabled={!showArrows.right}
              aria-label="Next products"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>
      
      <div className="slider-container">
        <div className="product-grid" ref={sliderRef}>
          {taggedProducts.map((product) => {
            const taglineStyle = getTaglineStyle(product.tagLine);
            const price = parseFloat(product.price) || 0;
            const discountPrice = parseFloat(product.discountPrice) || null;
            const hasDiscount = discountPrice !== null && discountPrice < price;
            
            // Check stock status
            const stockQuantity = product.stockQuantity || 0;
            const cartItem = cartItems.find(item => item.id === product.id);
            const cartQuantity = cartItem ? cartItem.quantity : 0;
            const availableStock = Math.max(0, stockQuantity - cartQuantity);
            const isOutOfStock = availableStock < 1;
            
            let stockStatus = "in-stock";
            let stockText = "In Stock";
            
            if (isOutOfStock) {
              stockStatus = "out-of-stock";
              stockText = "Out of Stock";
            } else if (availableStock < 5) {
              stockStatus = "low-stock";
              stockText = "Low Stock";
            }
            
            return (
              <Link
                to={`/product/${product.id}`}
                key={product.id}
                className="product-card-milwaukee"
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
                  className={`wishlist-btn ${wishlistedItems[product.id] ? "active" : ""}`}
                  onClick={(e) => toggleWishlist(product.id, e)}
                  aria-label={wishlistedItems[product.id] ? "Remove from wishlist" : "Add to wishlist"}
                >
                  {wishlistedItems[product.id] ? <FaSolidHeart aria-hidden="true" /> : <FiHeart aria-hidden="true" />}
                </button>

                {/* Product image */}
                <div className="image-container">
                  <img
                    src={getProductImage(product)}
                    alt={product.name}
                    className="product-image"
                    onError={(e) => {
                      e.target.src = "/images/products/default.png";
                    }}
                  />
                  <div className="image-overlay">
                    <div className="overlay-content">View Details</div>
                  </div>
                </div>
                
                <div className="product-info">
                  <div className="product-rating">
                    {renderRating(product.rating || 4.5)}
                    <span className="rating-count">({product.reviewCount || 42})</span>
                  </div>
                  
                  <h3 className="product-title">{product.name}</h3>
                  
                  <div className="stock-status-container">
                    <span className={`stock-status ${stockStatus}`}>{stockText}</span>
                  </div>
                  
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
                  
                  <button 
                    className={`add-to-cart-btn ${isOutOfStock ? "disabled" : ""}`}
                    onClick={(e) => handleAddToCart(product, e)}
                    disabled={isOutOfStock}
                    aria-label={isOutOfStock ? "Out of stock" : "Add to cart"}
                  >
                    <FiShoppingCart className="cart-icon" aria-hidden="true" />
                    <span>{isOutOfStock ? "Out of Stock" : "Add to Cart"}</span>
                  </button>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductSlider;