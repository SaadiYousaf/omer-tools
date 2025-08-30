import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  setBrandsLoading, 
  setBrandsSuccess, 
  setBrandsFailed 
} from '../../store/brandsSlice';
import useApi from '../../api/useApi';
import BrandCard from '../../components/common/BrandSlider/BrandCard/BrandCard';
import ProductGrid from '../../components/common/ProductGrid/ProductGrid';
import BrandFilter from '../../components/common/BrandSlider/BrandFilter/BrandFilter';
import Loading from '../../components/common/Loading/Loading';
import './ShopByBrand.css';

const BASE_IMG_URL = process.env.REACT_APP_BASE_IMG_URL;

const ShopByBrand = () => {
  const dispatch = useDispatch();
  const { get } = useApi();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  
  // Get brands from Redux store
  const { brands, status, error } = useSelector((state) => state.brands);
  
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState(null);

  // Function to get brand image (same as in BrandSlider)
  const getBrandImage = (brand) => {
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
  };

  // Fetch brands function (same as in BrandSlider)
  const fetchBrands = useCallback(async () => {
    dispatch(setBrandsLoading());
    try {
      const data = await get(`${BASE_URL}/brands?includeImages=true`);
      dispatch(setBrandsSuccess(data));
    } catch (err) {
      dispatch(setBrandsFailed(err.message));
    }
  }, [dispatch, get, BASE_URL]);

  // Fetch products function
  const fetchProducts = useCallback(async () => {
    try {
      setProductsLoading(true);
      setProductsError(null);
      
      const response = await fetch(`${BASE_URL}/products?featured=true&limit=12`);
      
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
  }, [BASE_URL]);

  useEffect(() => {
    if (status === 'idle') {
      fetchBrands();
    }
    fetchProducts();
  }, [status, fetchBrands, fetchProducts]);

  const isLoading = status === 'loading' || productsLoading;
  const hasError = error || productsError;

  if (hasError) {
    return (
      <div className="shop-by-brand-container">
        <div className="error-message">
          <div className="error-icon">⚠️</div>
          <h2>{hasError}</h2>
          <button 
            className="retry-button"
            onClick={() => {
              if (error) fetchBrands();
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
              <Loading size="medium" variant="spinner" color="primary" />
            </div>
          ) : (
            <div className="brands-grid">
              {brands.slice(0, 8).map(brand => {
                const imageUrl = getBrandImage(brand);
                console.log('Brand:', brand.name, 'Image URL:', imageUrl); // For debugging
                
                return (
                  <BrandCard 
                    key={brand.id} 
                    brand={{
                      ...brand,
                      imageUrl: imageUrl // Ensure this is passed correctly
                    }} 
                  />
                );
              })}
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
            brands={brands.map(brand => ({
              ...brand,
              imageUrl: getBrandImage(brand)
            }))} 
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
              <Loading size="medium" variant="spinner" color="primary" />
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