import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import ProductCard from '../Card/ProductCard';
import './FeaturedProducts.css';
import { selectFeaturedProducts } from '../../../store/productsSlice';
import { nameUrlUtils } from '../../Utils/nameUrlUtils';
const BASE_IMG_URL = process.env.REACT_APP_BASE_IMG_URL;

const FeaturedProducts = () => {
  // const featureProducts = useSelector(selectFeaturedProducts);
  const featuredProductsFromRedux = useSelector(selectFeaturedProducts);
  const featuredStatus = useSelector((state) => state.products.featuredStatus || 'idle');
const productsStatus = useSelector((state) => state.products.status || 'idle');
  const [visibleProducts, setVisibleProducts] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const productsPerLoad = 10;

  // Get all products from Redux store
  const items = useSelector((state) => state.products.items);

  // Memoize featured products with proper image handling
const featuredProducts = useMemo(() => {
    if (!featuredProductsFromRedux || featuredProductsFromRedux.length === 0) {
      return [];
    }
    
    return featuredProductsFromRedux.map(product => ({
      ...product,
      imageUrl: product.images?.[0]?.imageUrl 
        ? BASE_IMG_URL + product.images[0].imageUrl 
        : '/images/products/default.png'
    }));
  }, [featuredProductsFromRedux]); // Correct dependency
  

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

  // Handle "View All Products" button
  const handleViewAll = () => {
    setMessage("Redirecting to all products page...");
    setTimeout(() => {
      setMessage("All products loaded successfully!");
    }, 1500);
  };

  const isLoadingState = featuredStatus === 'loading' || productsStatus === 'loading';
  const hasNoProducts = featuredProducts.length === 0;
  if (isLoadingState && hasNoProducts) {
    return (
      <div className="featured-products">
        <div className="header-section">
          <h2>Featured Products</h2>
        </div>
        <div className="loading-indicator">
          <div className="loader"></div>
          <p>Loading featured products...</p>
        </div>
      </div>
    );
  }
if (!isLoadingState && hasNoProducts) {
    return (
      <div className="featured-products">
        <div className="header-section">
          <h2>Featured Products</h2>
        </div>
        <div className="no-products-message">
          <p>No featured products available at the moment.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="featured-products">
      <div className="header-section">
        <h2>Featured Products</h2>
        {featuredProducts.length > 0 && (
          <p className="subtitle">Discover our handpicked selection of premium items</p>
        )}
      </div>
      
      {featuredProducts.length > 0 && (
        <>
          <div className="products-grid">
            {featuredProducts.slice(0, visibleProducts).map(product => (
              <div key={product.id} className="product-card-wrapper">
                <ProductCard 
                  product={product}
                  description={product.description}
                  linkTo={`/product/${nameUrlUtils.convertNameToUrl(product.canonicalUrl)}`}
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
              {/* <button className="view-all-btn" onClick={handleViewAll}>
                View All Products
              </button> */}

              {message && <p className="inline-message">{message}</p>}
            </div>
          )}
        </>
      ) 
      
      }
    </div>
  );
};

export default FeaturedProducts;