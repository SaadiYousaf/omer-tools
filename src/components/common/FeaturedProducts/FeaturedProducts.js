import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import ProductCard from '../Card/ProductCard';
import './FeaturedProducts.css';
const BASE_IMG_URL = process.env.REACT_APP_BASE_IMG_URL;

const FeaturedProducts = () => {
  const [visibleProducts, setVisibleProducts] = useState(8);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(""); // ✅ state for user messages
  const productsPerLoad = 8;

  // Get all products from Redux store
  const items = useSelector((state) => state.products.items);

  // Memoize featured products with proper image handling
  const featuredProducts = useMemo(() => {
    return items
      .filter(product => product.isFeatured)
      .map(product => ({
        ...product,
        imageUrl: BASE_IMG_URL+ product.images?.[0]?.imageUrl || '/images/products/default.png'
      }));
  }, [items]);

  // Handle infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isLoading || visibleProducts >= featuredProducts.length) return;
      
      const scrollPosition = window.innerHeight + document.documentElement.scrollTop;
      const pageHeight = document.documentElement.offsetHeight;
      
      if (scrollPosition >= pageHeight - 300) {
        setIsLoading(true);
        
        setTimeout(() => {
          setVisibleProducts(prev => Math.min(prev + productsPerLoad, featuredProducts.length));
          setIsLoading(false);
        }, 500);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleProducts, isLoading, featuredProducts.length]);

  // Reset visible products when featured products change
  useEffect(() => {
    setVisibleProducts(productsPerLoad);
  }, [featuredProducts]);

  // ✅ Handle "View All Products" button
  const handleViewAll = () => {
    setMessage("Redirecting to all products page...");
    setTimeout(() => {
      // Later replace with navigation e.g. navigate("/products")
      setMessage("All products loaded successfully!");
    }, 1500);
  };

  return (
    <div className="featured-products-compact">
      <div className="header-section">
        <h2>Featured Products</h2>
        {featuredProducts.length > 0 && (
          <p className="subtitle">Discover our handpicked selection of premium items</p>
        )}
      </div>
      
      {featuredProducts.length > 0 ? (
        <>
          <div className="products-grid-compact">
            {featuredProducts.slice(0, visibleProducts).map(product => (
              <div key={product.id} className="product-card-compact-wrapper">
                <ProductCard 
                  product={product}
                  description={product.description}
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
          
          {visibleProducts >= featuredProducts.length && featuredProducts.length > 0 && (
            <div className="end-of-products">
              <p>You've viewed all featured products</p>
              <button className="view-all-btn" onClick={handleViewAll}>
                View All Products
              </button>

              {/* ✅ Inline message instead of alert */}
              {message && <p className="inline-message">{message}</p>}
            </div>
          )}
        </>
      ) : (
        <div className="no-featured-products">
          <p>No featured products available at the moment</p>
          <p>Check back later for new arrivals</p>
        </div>
      )}
    </div>
  );
};

export default FeaturedProducts;
