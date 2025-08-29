import React, { useEffect } from 'react';
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

const BrandSlider = () => {
  const dispatch = useDispatch();
  const { brands, status, error } = useSelector((state) => state.brands);
  const { get } = useApi();

  useEffect(() => {
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
  }, [dispatch, get]);

  const getBrandImage = (brand) => {
      // First, try to get the primary image from the images array
      if (brand.images && brand.images.length > 0) {
        // Find the primary image or use the first one
        const primaryImage = brand.images.find(img => img.isPrimary) || brand.images[0];
        return primaryImage.imageUrl;
      }
      
      // Fall back to the legacy imageUrl property
      if (brand.imageUrl) return brand.imageUrl;
      
      // Default image if no images are available
      return "/images/categories/default.png";
     };

  if (status === 'loading') {
    return (
      <section className="brand-slider-section">
        <div className="container">
          <h2 className="brands-heading">Our Brands</h2>
          <div className="brand-container">
            {[...Array(8)].map((_, index) => (
              <div key={`skeleton-${index}`} className="brand-card skeleton" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (status === 'failed') {
    return (
      <section className="brand-slider-section">
        <div className="container">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            Error loading brands: {error}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="brand-slider-section">
      <div className="container">
        <h2 className="brands-heading">Our Brands</h2>
        <div className="brand-container">
          {brands.slice(0, 8).map((brand) => (
            <Link to={`/brand/${brand.id}`} key={brand.id} className="brand-link">
              <div className="brand-card">
                <img
                  src={getBrandImage(brand)}
                  alt={brand.name}
                  className="brand-image"
                  onError={(e) => {
                    e.target.src = '/images/brands/default.png';
                  }}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandSlider;