import React, { useRef, useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import {
  setCategoriesLoading,
  setCategoriesSuccess,
  setCategoriesFailed,
} from "../../../store/categoriesSlice";
import useApi from "../../../api/useApi";
import "./CategorySlider.css";

const CategorySlider = () => {
  const dispatch = useDispatch();
  const { categories, status, error } = useSelector(
    (state) => state.categories
  );
  const sliderRef = useRef(null);
  const [showArrows, setShowArrows] = useState({ left: false, right: true });
  const scrollTimeoutRef = useRef(null);
  const { get } = useApi();
  const API_BASE_URL = process.env.REACT_APP_BASE_URL;
  console.log("Base URL:", process.env.REACT_APP_BASE_URL);

  useEffect(() => {
    const fetchCategories = async () => {
      dispatch(setCategoriesLoading());
      try {
        // Update the API endpoint to include images
        const data = await get(`${API_BASE_URL}/categories?includeImages=true`);
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
  }, [checkScrollPosition, categories]);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      sliderRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScrollPosition, 300);
    }
  };

  const getCategoryImage = (category) => {
    // First, try to get the primary image from the images array
    if (category.images && category.images.length > 0) {
      // Find the primary image or use the first one
      const primaryImage = category.images.find(img => img.isPrimary) || category.images[0];
      return primaryImage.imageUrl;
    }
    
    // Fall back to the legacy imageUrl property
    if (category.imageUrl) return category.imageUrl;
    
    // Default image if no images are available
    return "/images/categories/default.png";
  };

  if (status === "loading") {
    return (
      <div className="category-slider-wrapper">
        <div className="category-slider-container">
          <div className="category-slider">
            {[...Array(8)].map((_, index) => (
              <div key={`skeleton-${index}`} className="category-item">
                <div
                  className="category-image skeleton"
                  style={{ backgroundColor: "#e0e0e0" }}
                />
                <div
                  className="category-name skeleton"
                  style={{
                    backgroundColor: "#e0e0e0",
                    width: "80px",
                    height: "16px",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (status === "failed") {
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
            onClick={() => scroll("left")}
            aria-label="Scroll left"
          >
            <FiChevronLeft />
          </button>
        )}

        <div className="category-slider" ref={sliderRef}>
          {categories.map((category) => (
            <Link
              to={`/category/${category.id}`}
              key={category.id}
              className="category-item"
            >
              <img
                src={getCategoryImage(category)}
                alt={category.name}
                className="category-image"
                onError={(e) => {
                  e.target.src = "/images/categories/default.png";
                }}
              />
              <span className="category-name">{category.name}</span>
            </Link>
          ))}
        </div>

        {showArrows.right && (
          <button
            className="slider-arrow right-arrow"
            onClick={() => scroll("right")}
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