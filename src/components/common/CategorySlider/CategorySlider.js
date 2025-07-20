import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './CategorySlider.css';

const CategorySlider = ({ categories, brandImages, activeBrandIndex = 0 }) => {
  const sliderRef = useRef(null);
  const [showArrows, setShowArrows] = useState({ left: false, right: true });
  const scrollTimeoutRef = useRef(null);

  // Memoized scroll position check with debounce
  const checkScrollPosition = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      if (sliderRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
        setShowArrows({
          left: scrollLeft > 10,
          right: scrollLeft < scrollWidth - clientWidth - 10
        });
      }
    }, 100);
  }, []);

  // Initial check and setup scroll listener
  useEffect(() => {
    checkScrollPosition();
    
    const slider = sliderRef.current;
    if (!slider) return;

    slider.addEventListener('scroll', checkScrollPosition);
    return () => {
      slider.removeEventListener('scroll', checkScrollPosition);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [checkScrollPosition]);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      sliderRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
      
      setTimeout(checkScrollPosition, 300);
    }
  };

  // Get brand image for category (cycle through available images)
  const getBrandImage = (index) => {
    if (!brandImages || brandImages.length === 0) return '/images/categories/default.png';
    return brandImages[(activeBrandIndex + index) % brandImages.length];
  };

  return (
    <div className="category-slider-wrapper">
      <div className="category-slider-container">
        {showArrows.left && (
          <button 
            className="slider-arrow left-arrow" 
            onClick={() => scroll('left')}
            aria-label="Scroll left"
          >
            <FiChevronLeft />
          </button>
        )}

        <div 
          className="category-slider" 
          ref={sliderRef}
        >
          {categories.map((category, index) => (
            <Link
              to={`/category/${category.slug}`}
              key={category.id}
              className="category-item"
            >
              <img 
                src={getBrandImage(index)} 
                alt={category.name}
                className="category-image"
                onError={(e) => {
                  e.target.src = '/images/categories/default.png';
                }}
              />
              <span className="category-name">{category.name}</span>
            </Link>
          ))}
        </div>

        {showArrows.right && (
          <button 
            className="slider-arrow right-arrow" 
            onClick={() => scroll('right')}
            aria-label="Scroll right"
          >
            <FiChevronRight />
          </button>
        )}
      </div>
    </div>
  );
};

export default CategorySlider;