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
import defaultImg from "../../../assets/images/default.jpg";
import { useLayoutEffect } from "react";

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
  const BASE_URL = process.env.REACT_APP_BASE_IMG_URL;

  const repeatedCategories = [...categories, ...categories, ...categories]; // 3x for looping
  const middleIndex = categories.length;

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      dispatch(setCategoriesLoading());
      try {
        const data = await get(`${API_BASE_URL}/categories?includeImages=true`);
        dispatch(setCategoriesSuccess(data));
      } catch (err) {
        dispatch(setCategoriesFailed(err.message));
      }
    };

    fetchCategories();
  }, [dispatch, get, API_BASE_URL]);

  // Scroll to the middle set on load
  useEffect(() => {
    if (sliderRef.current && categories.length > 0) {
      const slider = sliderRef.current;
      const itemWidth = slider.scrollWidth / repeatedCategories.length;
      slider.scrollLeft = itemWidth * middleIndex;
    }
  }, [categories, repeatedCategories.length, middleIndex]);

  // Check and toggle arrows
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

  // Handle infinite loop scroll
  const handleLoopingScroll = useCallback(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const itemWidth = slider.scrollWidth / repeatedCategories.length;
    const totalItems = repeatedCategories.length;
    const scrollLeft = slider.scrollLeft;

    if (scrollLeft <= itemWidth) {
      // Too far left → jump to middle
      slider.scrollLeft = itemWidth * middleIndex;
    } else if (scrollLeft >= itemWidth * (totalItems - categories.length - 1)) {
      // Too far right → jump to middle
      slider.scrollLeft = itemWidth * middleIndex;
    }
  }, [categories.length, repeatedCategories.length, middleIndex]);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const onScroll = () => {
      checkScrollPosition();
      handleLoopingScroll();
    };

    slider.addEventListener("scroll", onScroll);
    return () => {
      slider.removeEventListener("scroll", onScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [checkScrollPosition, handleLoopingScroll]);

  // Handle scroll via arrows
  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      sliderRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
      setTimeout(() => {
        checkScrollPosition();
        handleLoopingScroll();
      }, 350);
    }
  };

  // Get image for each category
  const getCategoryImage = (category) => {
    if (category.images && category.images.length > 0) {
      const primaryImage =
        category.images.find((img) => img.isPrimary) || category.images[0];
      return BASE_URL + primaryImage.imageUrl;
    }

    if (category.imageUrl) return category.imageUrl;

    return defaultImg;
  };

  // LOADING UI
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

  // ERROR UI
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
          {repeatedCategories.map((category, index) => (
            <Link
              to={`/category/${category.id}`}
              key={`${category.id}-${index}`}
              className="category-item"
            >
              <img
                src={getCategoryImage(category)}
                alt={category.name}
                className="category-image"
                onError={(e) => {
                  e.target.src = defaultImg;
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
