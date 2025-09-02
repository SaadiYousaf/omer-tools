import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight, FiHeart, FiShoppingCart } from "react-icons/fi";
import { FaHeart as FaSolidHeart } from "react-icons/fa";
import { fetchAllProducts, selectAllProducts, selectProductsStatus } from "../../../store/productsSlice";
import { addItemToCart } from "../../../store/cartSlice";
import "./ProductSlider.css";

const BASE_IMG_URL = process.env.REACT_APP_BASE_IMG_URL;

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
  const [wishlistedItems, setWishlistedItems] = useState({});
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(4);
  const autoSlideRef = useRef(null);

  // Filter products with non-null tagline and limit to maxItems
  const taggedProducts = React.useMemo(() => {
    return products
      .filter(product => 
        product.tagLine && 
        product.tagLine.trim() !== "" &&
        !product.isFeatured &&
        !product.isRedemption
      )
      .slice(0, maxItems);
  }, [products, maxItems]);

  useEffect(() => {
    // Only fetch products if they haven't been loaded yet
    if (status === "idle" || products.length === 0) {
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
  }, [status, dispatch, products.length]);

  useEffect(() => {
    // Reset initial load flag once products are loaded
    if (status === "succeeded" && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [status, isInitialLoad]);

  // Auto slide functionality
  useEffect(() => {
    if (taggedProducts.length <= visibleItems) return;
    
    const startAutoSlide = () => {
      autoSlideRef.current = setInterval(() => {
        setCurrentIndex(prevIndex => {
          if (prevIndex >= taggedProducts.length - visibleItems) {
            return 0; // Loop back to start
          }
          return prevIndex + 1;
        });
      }, 3000);
    };
    
    startAutoSlide();
    
    return () => {
      if (autoSlideRef.current) {
        clearInterval(autoSlideRef.current);
      }
    };
  }, [taggedProducts.length, visibleItems]);

  // Handle manual navigation
  const handlePrev = () => {
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current);
    }
    
    setCurrentIndex(prevIndex => {
      if (prevIndex === 0) {
        return Math.max(0, taggedProducts.length - visibleItems);
      }
      return prevIndex - 1;
    });
    
    // Restart auto slide
    setTimeout(() => {
      autoSlideRef.current = setInterval(() => {
        setCurrentIndex(prevIndex => {
          if (prevIndex >= taggedProducts.length - visibleItems) {
            return 0;
          }
          return prevIndex + 1;
        });
      }, 3000);
    }, 5000);
  };

  const handleNext = () => {
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current);
    }
    
    setCurrentIndex(prevIndex => {
      if (prevIndex >= taggedProducts.length - visibleItems) {
        return 0;
      }
      return prevIndex + 1;
    });
    
    // Restart auto slide
    setTimeout(() => {
      autoSlideRef.current = setInterval(() => {
        setCurrentIndex(prevIndex => {
          if (prevIndex >= taggedProducts.length - visibleItems) {
            return 0;
          }
          return prevIndex + 1;
        });
      }, 3000);
    }, 5000);
  };

  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) {
      const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
      return BASE_IMG_URL + primaryImage.imageUrl;
    }
    
    if (product.imageUrl) return product.imageUrl;
    
    return "/images/products/default.png";
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

  // Show loading state if products are being fetched or if it's the initial load
  if (status === "loading" || isInitialLoad) {
    return (
      <section className="product-carousel-container">
        <div className="carousel-header">
          <div className="header-content">
            <h2 className="carousel-title">{title}</h2>
            <p className="carousel-subtitle">{subtitle}</p>
          </div>
          <div className="carousel-controls">
            <div className="carousel-dots">
              {[...Array(Math.ceil(maxItems / visibleItems))].map((_, i) => (
                <div key={i} className="dot"></div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="carousel-wrapper">
          <div className="product-carousel">
            {[...Array(visibleItems)].map((_, index) => (
              <div key={`skeleton-${index}`} className="carousel-product-card skeleton">
                <div className="product-image-container"></div>
                <div className="product-info">
                  <div className="title-placeholder"></div>
                  <div className="tagline-placeholder"></div>
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
      <section className="product-carousel-container">
        <div className="carousel-header">
          <div className="header-content">
            <h2 className="carousel-title">{title}</h2>
            <p className="carousel-subtitle">{subtitle}</p>
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
    return (
      <section className="product-carousel-container">
        <div className="carousel-header">
          <div className="header-content">
            <h2 className="carousel-title">{title}</h2>
            <p className="carousel-subtitle">{subtitle}</p>
          </div>
        </div>
        
        <div className="no-products-message">
          <p>No products available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="product-carousel-container">
      <div className="carousel-header">
        <div className="header-content">
          <h2 className="carousel-title">{title}</h2>
          <p className="carousel-subtitle">{subtitle}</p>
        </div>
        <div className="carousel-controls">
          <div className="carousel-dots">
            {[...Array(Math.ceil(taggedProducts.length / visibleItems))].map((_, i) => (
              <button 
                key={i} 
                className={`dot ${Math.floor(currentIndex / visibleItems) === i ? 'active' : ''}`}
                aria-label={`Go to slide ${i + 1}`}
              ></button>
            ))}
          </div>
          <div className="arrow-controls">
            <button
              className="carousel-arrow left-arrow"
              onClick={handlePrev}
              aria-label="Previous products"
            >
              <FiChevronLeft />
            </button>
            <button
              className="carousel-arrow right-arrow"
              onClick={handleNext}
              aria-label="Next products"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>
      
      <div className="carousel-wrapper">
        <div 
          className="product-carousel" 
          ref={sliderRef}
          style={{ 
            transform: `translateX(-${currentIndex * (100 / visibleItems)}%)`,
            transition: 'transform 0.5s ease-in-out'
          }}
        >
          {taggedProducts.map((product) => {
            return (
              <Link
                to={`/product/${product.id}`}
                key={product.id}
                className="carousel-product-card"
              >
                {/* Wishlist button */}
                <button 
                  className={`wishlist-btn ${wishlistedItems[product.id] ? "active" : ""}`}
                  onClick={(e) => toggleWishlist(product.id, e)}
                  aria-label={wishlistedItems[product.id] ? "Remove from wishlist" : "Add to wishlist"}
                >
                  {wishlistedItems[product.id] ? <FaSolidHeart aria-hidden="true" /> : <FiHeart aria-hidden="true" />}
                </button>

                {/* Product image */}
                <div className="product-image-container">
                  <img
                    src={getProductImage(product)}
                    alt={product.name}
                    className="product-image"
                    onError={(e) => {
                      e.target.src = "/images/products/default.png";
                    }}
                  />
                </div>
                
                <div className="product-info">
                  <h3 className="product-title">{product.name}</h3>
                  <p className="product-tagline">{product.tagLine}</p>
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