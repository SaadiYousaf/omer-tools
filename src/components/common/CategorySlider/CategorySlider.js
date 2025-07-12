import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './CategorySlider.css';
import brand1 from "../BrandSlider/brands/brand1.PNG";

const CategorySlider = ({categories}) => {
  const sliderRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  useEffect(() => {
    checkScrollPosition();
  }, []);

  const checkScrollPosition = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

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

  return (
    <div className="category-slider-wrapper">
      <div className="category-slider-container">
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
          className="category-slider" 
          ref={sliderRef}
          onScroll={checkScrollPosition}
        >
          {categories.map((category) => (
            <Link
              to={`/category/${category.slug}`}
              key={category.id}
              className="category-item"
            >
              <img 
                src={brand1} 
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

        {showRightArrow && (
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