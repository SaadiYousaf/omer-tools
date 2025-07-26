// src/components/common/CategorySlider/CategorySlider.js
import React, { useRef, useEffect, useCallback,useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import {
  setCategoriesLoading,
  setCategoriesSuccess,
  setCategoriesFailed
} from '../../../store/categoriesSlice';
import useApi from '../../../api/useApi';
import './CategorySlider.css';

const CategorySlider = ({ brandImages, activeBrandIndex = 0 }) => {
  const dispatch = useDispatch();
  const { categories, status, error } = useSelector((state) => state.categories);
  const sliderRef = useRef(null);
  const [showArrows, setShowArrows] = useState({ left: false, right: true });
  const scrollTimeoutRef = useRef(null);
  const { get } = useApi();

  useEffect(() => {
    const fetchCategories = async () => {
      dispatch(setCategoriesLoading());
      try {
        const data = await get('http://localhost:5117/api/categories');
        dispatch(setCategoriesSuccess(data));
      } catch (err) {
        dispatch(setCategoriesFailed(err.message));
      }
    };

    fetchCategories();
  }, [dispatch, get]);

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
  }, [checkScrollPosition, categories]); // Added categories to dependency array

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

  const getBrandImage = (index) => {
    if (!brandImages || brandImages.length === 0) return '/images/categories/default.png';
    return brandImages[(activeBrandIndex + index) % brandImages.length];
  };

  if (status === 'loading') {
    return (
      <div className="category-slider-wrapper">
        <div className="category-slider-container">
          <div className="category-slider">
            {[...Array(8)].map((_, index) => (
              <div key={`skeleton-${index}`} className="category-item">
                <div 
                  className="category-image" 
                  style={{ backgroundColor: '#e0e0e0' }} 
                />
                <div 
                  className="category-name" 
                  style={{ backgroundColor: '#e0e0e0', width: '80px', height: '16px' }} 
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="category-slider-wrapper">
        <div className="category-slider-container">
          <div className="category-slider-error">
            Error loading categories: {error}
          </div>
        </div>
      </div>
    );
  }

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

        <div className="category-slider" ref={sliderRef}>
          {categories.map((category, index) => (
            <Link
              to={`/subcategory/${category.id}`}
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