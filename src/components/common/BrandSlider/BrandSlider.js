// src/components/common/BrandSlider/BrandSlider.js
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

const BrandSlider = () => {
  const dispatch = useDispatch();
  const { brands, status, error } = useSelector((state) => state.brands);
  const { get } = useApi();

  useEffect(() => {
    const fetchBrands = async () => {
      dispatch(setBrandsLoading());
      try {
        const data = await get('http://localhost:5117/api/brands');
        dispatch(setBrandsSuccess(data));
      } catch (err) {
        dispatch(setBrandsFailed(err.message));
      }
    };

    fetchBrands();
  }, [dispatch, get]);

  const getBrandImage = (brand) => {
    if (!brand.logoUrl) return '/images/brands/default.png';
    return brand.logoUrl;
  };

  if (status === 'loading') {
    return (
      <section className="brand-slider-section">
        <div className="container">
          <div className="brand-grid">
            {[...Array(8)].map((_, index) => (
              <div key={`skeleton-${index}`} className="brand-item">
                <div className="brand-card" style={{ backgroundColor: '#e0e0e0' }} />
              </div>
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
          <div className="brand-grid">
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem' }}>
              Error loading brands: {error}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="brand-slider-section">
      <div className="container">
        <div className="brand-grid">
          {brands.slice(0, 8).map((brand) => (
            <Link to={`/brand/${brand.id}`} key={brand.id} className="brand-item">
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