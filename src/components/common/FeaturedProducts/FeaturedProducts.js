import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import ProductCard from '../Card/ProductCard';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './FeaturedProducts.css';

const FeaturedProducts = () => {
  const sliderRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);

  // Get all products from Redux store
  const items = useSelector((state) => state.products.items);

  // Memoize featured products with proper image handling
  const featuredProducts = useMemo(() => {
    return items
      .filter(product => product.isFeatured)
      .map(product => ({
        ...product,
        // Ensure consistent image structure with Subcategory component
        imageUrl: product.images?.[0]?.imageUrl || '/images/products/default.png'
      }));
  }, [items]);

  // Rest of your existing code remains the same...
  const checkScrollPosition = useCallback(() => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (sliderRef.current?.parentElement) {
        setContainerWidth(sliderRef.current.parentElement.clientWidth);
      }
      checkScrollPosition();
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [checkScrollPosition]);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let scrollTimeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(checkScrollPosition, 100);
    };

    slider.addEventListener('scroll', handleScroll);
    return () => {
      slider.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [checkScrollPosition]);

  useEffect(() => {
    checkScrollPosition();
  }, [featuredProducts.length, containerWidth, checkScrollPosition]);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const cardWidth = 250;
      const scrollAmount = direction === 'left' ? -cardWidth * 2 : cardWidth * 2;
      sliderRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScrollPosition, 500);
    }
  };

  return (
    <div className="featured-products">
      <h2>Featured Products</h2>
      <div className="featured-products-container">
        {featuredProducts.length > 0 ? (
          <>
            {showLeftArrow && (
              <button 
                className="slider-arrow left-arrow" 
                onClick={() => scroll('left')}
                aria-label="Scroll left"
              >
                <FiChevronLeft />
              </button>
            )}

            <div 
              className="featured-products-slider" 
              ref={sliderRef}
            >
              {featuredProducts.map(product => (
                <div key={product.id} className="slider-product-item">
                  <ProductCard 
                    product={product}
                    description={product.description}
                    linkTo={`/product/${product.id}`}
                  />
                </div>
              ))}
            </div>

            {showRightArrow && (
              <button 
                className="slider-arrow right-arrow" 
                onClick={() => scroll('right')}
                aria-label="Scroll right"
              >
                <FiChevronRight />
              </button>
            )}
          </>
        ) : (
          <div className="no-featured-products">
            <p>No featured products available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedProducts;