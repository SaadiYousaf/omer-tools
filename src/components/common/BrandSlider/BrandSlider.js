import React, { useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  setBrandsLoading,
  setBrandsSuccess,
  setBrandsFailed
} from '../../../store/brandsSlice';
import useApi from '../../../api/useApi';
import './BrandSlider.css';

const BASE_URL = process.env.REACT_APP_BASE_URL;
const BASE_IMG_URL = process.env.REACT_APP_BASE_IMG_URL;

const BrandSlider = () => {
  const dispatch = useDispatch();
  const { brands, status, error } = useSelector((state) => state.brands);
  const { get } = useApi();

  // Optimized: Memoized brand image getter to prevent recreation on every render
  const getBrandImage = useCallback((brand) => {
    // First, try to get the primary image from the images array
    if (brand.images && brand.images.length > 0) {
      // Find the primary image or use the first one
      const primaryImage = brand.images.find(img => img.isPrimary) || brand.images[0];
      return BASE_IMG_URL + primaryImage.imageUrl;
    }
    
    // Fall back to the legacy imageUrl property
    if (brand.imageUrl) return brand.imageUrl;
    
    // Default image if no images are available
    return "/images/categories/default.png";
  }, []);

  // Optimized: Conditional data fetching - only fetch if brands are empty
  useEffect(() => {
    // Only fetch brands if they haven't been loaded yet
    if (brands.length === 0) {
      const fetchBrands = async () => {
        dispatch(setBrandsLoading());
        try {
          const data = await get(`${BASE_URL}/brands?includeImages=true`);
          dispatch(setBrandsSuccess(data));
        } catch (err) {
          dispatch(setBrandsFailed(err.message));
        }
      };
      fetchBrands();
    }
  }, [dispatch, get, brands.length]); // Added brands.length to dependencies

  // Optimized: Memoized displayed brands (first 8)
  const displayedBrands = useMemo(() => 
    brands.slice(0, 10), 
    [brands]
  );

  // Optimized: Memoized skeleton loader to prevent recreation
  const skeletonLoader = useMemo(() => (
    <section className="brand-slider-section">
      <div className="container">
        <h2 className="brands-heading">Our Brands</h2>
        <div className="brand-container">
          {[...Array(10)].map((_, index) => (
            <div key={`skeleton-${index}`} className="brand-card skeleton" />
          ))}
        </div>
      </div>
    </section>
  ), []);

  // Optimized: Memoized error state
  const errorState = useMemo(() => (
    <section className="brand-slider-section">
      <div className="container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Error loading brands: {error}
        </div>
      </div>
    </section>
  ), [error]);

  // Optimized: Memoized brand cards with stable references
  const brandCards = useMemo(() => 
    displayedBrands.map((brand) => (
      <Link to={`/brand/${brand.id}`} key={brand.id} className="brand-link">
        <div className="brand-card">
          <img
            src={getBrandImage(brand)}
            alt={brand.name}
            className="brand-image"
            loading="lazy" // Added lazy loading for better performance
            onError={(e) => {
              e.target.src = '/images/brands/default.png';
            }}
          />
        </div>
      </Link>
    )), 
    [displayedBrands, getBrandImage]
  );

  // Return states (functionality unchanged)
  if (status === 'loading') {
    return skeletonLoader;
  }

  if (status === 'failed') {
    return errorState;
  }

  return (
    <section className="brand-slider-section">
      <div className="container">
        <h2 className="brands-heading">Shop By Brand</h2>
        <div className="brand-container">
          {brandCards}
        </div>
      </div>
    </section>
  );
};

// Optimized: Prevent unnecessary re-renders with React.memo
export default React.memo(BrandSlider);