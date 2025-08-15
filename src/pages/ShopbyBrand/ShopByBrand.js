import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBrands, selectAllBrands, selectBrandsStatus, selectBrandsError } from '../../store/brandsSlice';

import BrandCard from '../../components/common/BrandSlider/BrandCard/BrandCard';
import ProductGrid from '../../components/common/ProductGrid/ProductGrid';
import BrandFilter from '../../components/common/BrandSlider/BrandFilter/BrandFilter';
import LoadingSpinner from '../../components/common/Loading/Loading';
import './ShopByBrand.css';

const ShopByBrand = () => {
  const dispatch = useDispatch();
  
  const brands = useSelector(selectAllBrands);
  const brandsStatus = useSelector(selectBrandsStatus);
  const brandsError = useSelector(selectBrandsError);
  
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState(null);

  // Fetch products function
  const fetchProducts = useCallback(async () => {
    try {
      setProductsLoading(true);
      setProductsError(null);
      
      const response = await fetch('http://localhost:5117/api/products?featured=true&limit=12');
      
      if (!response.ok) {
        throw new Error('Failed to load products');
      }
      
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setProductsError('Failed to load products. Please try again later.');
      console.error('Error fetching products:', err);
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (brandsStatus === 'idle') {
      dispatch(fetchBrands());
    }
    fetchProducts();
  }, [brandsStatus, dispatch, fetchProducts]);

  const isLoading = brandsStatus === 'loading' || productsLoading;
  const error = brandsError || productsError;

  if (error) {
    return (
      <div className="shop-by-brand-container">
        <div className="error-message">
          <div className="error-icon">⚠️</div>
          <h2>{error}</h2>
          <button 
            className="retry-button"
            onClick={() => {
              if (brandsError) dispatch(fetchBrands());
              if (productsError) fetchProducts();
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="shop-by-brand-container">
      <div className="brands-header">
        <div className="header-gradient">
          <h1>Shop by Brand</h1>
          <p>Discover premium products from our curated collection of trusted brands</p>
        </div>
      </div>

      <div className="content-wrapper">
        {/* Top Brands Section */}
        <section className="top-brands-section">
          <div className="section-header">
            <h2>Top Brands</h2>
            <div className="header-divider"></div>
          </div>
          {isLoading ? (
            <div className="loading-container">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="brands-grid">
              {brands.slice(0, 8).map(brand => (
                <BrandCard 
                  key={brand.id} 
                  brand={brand} 
                />
              ))}
            </div>
          )}
        </section>

        {/* Brand Filter */}
        <section className="brand-filter-section">
          <div className="section-header">
            <h2>All Brands</h2>
            <div className="header-divider"></div>
          </div>
          <BrandFilter 
            brands={brands} 
          />
        </section>

        {/* Products Section */}
        <section className="products-section">
          <div className="section-header">
            <h2>Featured Products</h2>
            <div className="header-divider"></div>
          </div>
          
          {isLoading ? (
            <div className="loading-container">
              <LoadingSpinner />
            </div>
          ) : products.length === 0 ? (
            <div className="no-products">
              <div className="empty-state-icon">📦</div>
              <h3>No products available</h3>
              <p>We couldn't find any featured products at the moment.</p>
            </div>
          ) : (
            <ProductGrid products={products} />
          )}
        </section>
      </div>
    </div>
  );
};

export default ShopByBrand;