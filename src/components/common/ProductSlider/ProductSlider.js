import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts, selectAllProducts, selectProductsStatus } from "../../../store/productsSlice";
import ProductCard from "../Card/ProductCard";
import "./ProductSlider.css";

const ProductSlider = ({
  title = "Premium Collections",
  subtitle = "Discover our enterprise-grade solutions designed for professionals",
  maxItems = 8,
}) => {
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const status = useSelector(selectProductsStatus);
  const [visibleProducts, setVisibleProducts] = useState(maxItems);
  const [isLoading, setIsLoading] = useState(false);
  const productsPerLoad = 8;

  // Filter products with non-null tagline
  const taggedProducts = React.useMemo(() => {
    return products
      .filter(
        (product) =>
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
  }, [status, dispatch, products.length]);

  // Handle infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isLoading || visibleProducts >= taggedProducts.length) return;
      
      const scrollPosition = window.innerHeight + document.documentElement.scrollTop;
      const pageHeight = document.documentElement.offsetHeight;
      
      if (scrollPosition >= pageHeight - 300) {
        setIsLoading(true);
        
        setTimeout(() => {
          setVisibleProducts(prev => Math.min(prev + productsPerLoad, taggedProducts.length));
          setIsLoading(false);
        }, 500);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleProducts, isLoading, taggedProducts.length]);

  // Show loading state if products are being fetched
  if (status === "loading") {
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

  if (status === "failed") {
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
            onClick={() => dispatch(fetchAllProducts())}
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