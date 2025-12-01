import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/common/Loading/Loading';
import { nameUrlUtils } from '../../components/Utils/nameUrlUtils';
import {
  fetchRedemptionProducts,
  selectRedemptionProducts,
  selectRedemptionStatus,
  selectProductsError
} from '../../store/productsSlice';
import ProductCard from '../../components/common/Card/ProductCard';
import './RedemptionProducts.css';
const BASE_IMG_URL = process.env.REACT_APP_BASE_IMG_URL;

const RedemptionProducts = () => {
  const [visibleProducts, setVisibleProducts] = useState(8);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const productsPerLoad = 8;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get redemption products from Redux store
  const redemptionItems = useSelector(selectRedemptionProducts) || [];
  const redemptionStatus = useSelector(selectRedemptionStatus);
  const redemptionError = useSelector(selectProductsError); // Using the general error selector

  // Fetch redemption products on component mount
  useEffect(() => {
    if (redemptionStatus === 'idle') {
      dispatch(fetchRedemptionProducts());
    }
  }, [redemptionStatus, dispatch]);

  // Memoize redemption products with safe image handling
  const redemptionProducts = useMemo(() => {
    return redemptionItems.map(product => ({
      ...product,
      imageUrl: BASE_IMG_URL + product.images?.[0]?.imageUrl || '/images/products/default.png'
    }));
  }, [redemptionItems]);

  // Handle infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isLoadingMore || visibleProducts >= redemptionProducts.length) return;

      const scrollPosition = window.innerHeight + document.documentElement.scrollTop;
      const pageHeight = document.documentElement.offsetHeight;

      if (scrollPosition >= pageHeight - 300) {
        setIsLoadingMore(true);
        setTimeout(() => {
          setVisibleProducts(prev => Math.min(prev + productsPerLoad, redemptionProducts.length));
          setIsLoadingMore(false);
        }, 500);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleProducts, isLoadingMore, redemptionProducts.length]);

  // Reset visible products when redemption products change
  useEffect(() => {
    setVisibleProducts(productsPerLoad);
  }, [redemptionProducts]);

  // Handle retry
  const handleRetry = () => {
    if (redemptionStatus !== 'loading') {
      dispatch(fetchRedemptionProducts());
    }
  };

  if (redemptionStatus === 'loading') {
    return (
      <div className="redemption-products">
        <div className="header-section">
          <h2>Redemption Products</h2>
        </div>
        <div className="loading-indicator">
          <div className="loader"></div>
          <Loading size="medium" variant="spinner" color="primary" />
        </div>
      </div>
    );
  }

  if (redemptionStatus === 'failed') {
    return (
      <div className="redemption-products">
        <div className="header-section">
          <h2>Redemption Products</h2>
        </div>
        <div className="error-message">
          <p>Error: {redemptionError}</p>
          <button onClick={handleRetry} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="redemption-products">
      <div className="header-section">
        <h2>Redemption Products</h2>
        {redemptionProducts.length > 0 && (
          <p className="subtitle">Special products available for redemption with your points</p>
        )}
      </div>

      {redemptionProducts.length > 0 ? (
        <>
          <div className="products-grid">
            {redemptionProducts.slice(0, visibleProducts).map(product => (
              <div key={product.id} className="product-card-wrapper">
                <ProductCard
                  product={product}
                  description={product.description}
                  linkTo={`/product/${nameUrlUtils.convertNameToUrl(product.canonicalUrl)}`}
                  showRedemptionBadge={true}
                />
              </div>
            ))}
          </div>

          {isLoadingMore && (
            <div className="loading-indicator">
              <div className="loader"></div>
              <p>Loading more products...</p>
            </div>
          )}

          {visibleProducts >= redemptionProducts.length && redemptionProducts.length > 0 && (
            <div className="end-of-products">
              <p>You've viewed all redemption products</p>
              <button className="view-all-btn" onClick={() => navigate('/products')}>
                View All Products
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="no-redemption-products">
          <p>No redemption products available at the moment</p>
          <p>Check back later for new redemption offers</p>
        </div>
      )}
    </div>
  );
};

export default RedemptionProducts;