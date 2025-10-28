import React, { useEffect, useState,useCallback,useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectSliderProducts, selectSliderProductsStatus, fetchSliderProducts } from "../../../store/productsSlice";
import ProductCard from "../Card/ProductCard";
import "./ProductSlider.css";

const ProductSlider = ({
  title = "Premium Collections",
  subtitle = "Discover our enterprise-grade solutions designed for professionals",
  maxItems = 10,
}) => {
  const dispatch = useDispatch();
  const sliderProducts = useSelector(selectSliderProducts);
  const sliderStatus = useSelector(selectSliderProductsStatus);
  const [visibleProducts, setVisibleProducts] = useState(maxItems);
  const [isLoading, setIsLoading] = useState(false);
  const productsPerLoad = 10;

  // Filter products with non-null tagline
  const taggedProducts = React.useMemo(() => {
    return sliderProducts.slice(0, maxItems);
  }, [sliderProducts, maxItems]);

  useEffect(() => {
    // Only fetch products if they haven't been loaded yet
 if (sliderStatus === "idle" || sliderProducts.length === 0) {
      dispatch(fetchSliderProducts(maxItems));
    }
  }, [sliderStatus, dispatch, maxItems, sliderProducts.length]);

  // Handle infinite scroll
  // useEffect(() => {
  //   const handleScroll  = useCallback(() => {
  //     if (isLoading || visibleProducts >= taggedProducts.length) return;
      
  //     const scrollPosition = window.innerHeight + document.documentElement.scrollTop;
  //     const pageHeight = document.documentElement.offsetHeight;
      
  //     if (scrollPosition >= pageHeight - 300) {
  //       setIsLoading(true);
        
  //       setTimeout(() => {
  //         setVisibleProducts(prev => Math.min(prev + productsPerLoad, taggedProducts.length));
  //         setIsLoading(false);
  //       }, 500);
  //     }
  //   };

  //   window.addEventListener('scroll', handleScroll);
  //   return () => window.removeEventListener('scroll', handleScroll);
  // }, [visibleProducts, isLoading, taggedProducts.length]);
    const handleScroll = useCallback(() => {
    if (isLoading || visibleProducts >= taggedProducts.length) return;
    
    const scrollPosition = window.innerHeight + document.documentElement.scrollTop;
    const pageHeight = document.documentElement.offsetHeight;
    
    if (scrollPosition >= pageHeight - 300) {
      setIsLoading(true);
      
      // Use requestAnimationFrame for better performance
      requestAnimationFrame(() => {
        setVisibleProducts(prev => Math.min(prev + productsPerLoad, taggedProducts.length));
        setIsLoading(false);
      });
    }
  }, [visibleProducts, isLoading, taggedProducts.length, productsPerLoad]);
  // Optimized: Throttled scroll event listener
  useEffect(() => {
    let ticking = false;
    
    const throttledScrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    return () => window.removeEventListener('scroll', throttledScrollHandler);
  }, [handleScroll]);

    // Optimized: Memoized skeleton items
  const skeletonItems = useMemo(() => 
    [...Array(maxItems)].map((_, index) => (
      <div key={`skeleton-${index}`} className="product-card-wrapper skeleton">
        <div className="product-image-placeholder"></div>
        <div className="product-info">
          <div className="title-placeholder"></div>
          <div className="description-placeholder"></div>
        </div>
      </div>
    )), [maxItems]
  );

  // Optimized: Memoized product list
  const productList = useMemo(() => 
    taggedProducts.slice(0, visibleProducts).map((product) => (
      <div key={product.id} className="product-card-wrapper">
        <ProductCard 
          product={product}
          description={product.tagLine}
          linkTo={`/product/${product.id}`}
        />
      </div>
    )), [taggedProducts, visibleProducts]
  );
  // Show loading state if products are being fetched
  if (sliderStatus  === "loading") {
    return (
      <section className="product-slider-container">
        <div className="slider-header">
          <h2>{title}</h2>
          <p className="subtitle">{subtitle}</p>
        </div>
        
        <div className="products-grid">
          {[...Array(maxItems)].map((_, index) => (
            <div key={`skeleton-${index}`} className="product-card-wrapper skeleton">
              <div className="product-image-placeholder"></div>
              <div className="product-info">
                <div className="title-placeholder"></div>
                <div className="description-placeholder"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (sliderStatus  === "failed") {
    return (
      <section className="product-slider-container">
        <div className="slider-header">
          <h2>{title}</h2>
          <p className="subtitle">{subtitle}</p>
        </div>

        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>Unable to load products</h3>
          <p>Please check your connection and try again</p>
          <button
            className="retry-button"
            onClick={() => dispatch(fetchSliderProducts())}
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  if (taggedProducts.length === 0) {
    return (
      <section className="product-slider-container">
        <div className="slider-header">
          <h2>{title}</h2>
          <p className="subtitle">{subtitle}</p>
        </div>

        <div className="no-products-message">
          <p>No products available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="product-slider-container">
      <div className="slider-header">
        <h2>{title}</h2>
        <p className="subtitle">{subtitle}</p>
      </div>

      <div className="products-grid">
        {taggedProducts.slice(0, visibleProducts).map((product) => (
          <div key={product.id} className="product-card-wrapper">
            <ProductCard 
              product={product}
              description={product.tagLine}
              linkTo={`/product/${product.id}`}
            />
          </div>
        ))}
      </div>
      
      {isLoading && (
        <div className="loading-indicator">
          <div className="loader"></div>
          <p>Loading more products...</p>
        </div>
      )}
      
      {visibleProducts >= taggedProducts.length && taggedProducts.length > 0 && (
        <div className="end-of-products">
          <p>You've viewed all products in this collection</p>
        </div>
      )}
    </section>
  );
};

export default ProductSlider;