import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { filterByBrand, fetchAllProducts } from '../../store/productsSlice';
import { 
  setBrandsLoading, 
  setBrandsSuccess, 
  setBrandsFailed 
} from '../../store/brandsSlice';
import useApi from '../../api/useApi';
import ProductCard from '../../components/common/Card/ProductCard';
import Loading from '../../components/common/Loading/Loading';
import ScrollToTop from '../../components/common/Scroll/ScrollToTop';
import './BrandProducts.css';
import defaultImg from "../../assets/images/default.jpg";

const BASE_IMG_URL = process.env.REACT_APP_BASE_IMG_URL;

const BrandProducts = () => {
  const { brandId } = useParams();
  const dispatch = useDispatch();
  const { get } = useApi();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  
  const [sortOption, setSortOption] = useState('featured');
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState({});
  const [showDebug, setShowDebug] = useState(false);
  const [manuallyFilteredProducts, setManuallyFilteredProducts] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  const { filteredItems, items, status } = useSelector(state => state.products);
  const { brands, status: brandsStatus, error: brandsError } = useSelector(state => state.brands);

  // Function to get brand image
  const getBrandImage = useCallback((brand) => {
    if (!brand) return defaultImg;
    
    if (brand.images && brand.images.length > 0) {
      const primaryImage = brand.images.find(img => img.isPrimary) || brand.images[0];
      return BASE_IMG_URL + primaryImage.imageUrl;
    }
    
    if (brand.imageUrl) return brand.imageUrl;
    if (brand.logoUrl) return brand.logoUrl;
    
    return defaultImg;
  }, [BASE_IMG_URL]);

  // Fetch brands function
  const fetchBrands = useCallback(async () => {
    dispatch(setBrandsLoading());
    try {
      const data = await get(`${BASE_URL}/brands?includeImages=true`);
      dispatch(setBrandsSuccess(data));
    } catch (err) {
      dispatch(setBrandsFailed(err.message));
    }
  }, [dispatch, get, BASE_URL]);

  // Fetch all products with persistence
  const fetchProducts = useCallback(async () => {
    // Check if we already have products in localStorage
    const cachedProducts = localStorage.getItem(`cachedProducts_${brandId}`);
    const cacheTimestamp = localStorage.getItem(`cacheTimestamp_${brandId}`);
    const isCacheValid = cacheTimestamp && (Date.now() - parseInt(cacheTimestamp)) < 300000; // 5 minutes
    
    if (isCacheValid && cachedProducts) {
      try {
        const parsedProducts = JSON.parse(cachedProducts);
        dispatch({
          type: 'products/fetchAllProducts/fulfilled',
          payload: parsedProducts
        });
        dispatch(filterByBrand(brandId));
        return;
      } catch (e) {
        console.error('Error parsing cached products:', e);
      }
    }
    
    // If no valid cache, fetch from API
    setLoadingProducts(true);
    setError(null);
    try {
      const productsData = await get('https://zohaibii-001-site1.mtempurl.com/api/products?limit=1000');
      
      // Cache the products
      localStorage.setItem(`cachedProducts_${brandId}`, JSON.stringify(productsData));
      localStorage.setItem(`cacheTimestamp_${brandId}`, Date.now().toString());
      
      dispatch({
        type: 'products/fetchAllProducts/fulfilled',
        payload: productsData
      });
      
      return productsData;
    } catch (err) {
      setError('Failed to load products');
      console.error('Failed to fetch products:', err);
      throw err;
    } finally {
      setLoadingProducts(false);
      setIsInitialLoad(false);
    }
  }, [dispatch, get, brandId]);

  // Manual filtering function
  const manualFilterByBrand = useCallback((products, brandId) => {
    if (!products || !brandId) return [];
    return products.filter(product => product.brandId === brandId);
  }, []);

  // Debug function to check brand ID matching
  const checkBrandIdMatching = useCallback(() => {
    if (items.length > 0 && brandId) {
      const sampleProducts = items.slice(0, 5);
      const brandIdsInProducts = [...new Set(items.map(item => item.brandId))];
      
      const brandIdExists = brandIdsInProducts.some(id => id === brandId);
      const matchingProducts = manualFilterByBrand(items, brandId);
      
      setDebugInfo({
        totalProducts: items.length,
        brandIdFromUrl: brandId,
        brandIdType: typeof brandId,
        sampleProductBrandIds: sampleProducts.map(p => ({id: p.id, brandId: p.brandId, brandIdType: typeof p.brandId})),
        allBrandIdsInProducts: brandIdsInProducts,
        brandIdExistsInProducts: brandIdExists,
        matchingProductsCount: matchingProducts.length,
        apiUrl: 'https://zohaibii-001-site1.mtempurl.com/api/products?limit=1000',
        filteredItemsCount: filteredItems.length,
        manuallyFilteredCount: manuallyFilteredProducts.length,
        isInitialLoad: isInitialLoad
      });
      
      // If Redux filtering isn't working, use manual filtering
      if (matchingProducts.length > 0 && filteredItems.length === 0) {
        setManuallyFilteredProducts(matchingProducts);
      }
    }
  }, [items, brandId, filteredItems.length, manualFilterByBrand, manuallyFilteredProducts.length, isInitialLoad]);

  // Fetch brands if not already fetched
  useEffect(() => {
    if (brandsStatus === 'idle') {
      fetchBrands();
    }
  }, [brandsStatus, fetchBrands]);

  // Fetch products if not already fetched
  useEffect(() => {
    if (status === 'idle' || items.length === 0) {
      fetchProducts();
    }
  }, [status, fetchProducts, items.length]);

  // Filter products when brandId changes or products are loaded
  useEffect(() => {
    if (items.length > 0 && brandId) {
      dispatch(filterByBrand(brandId));
      checkBrandIdMatching();
    }
  }, [brandId, items, dispatch, checkBrandIdMatching]);

  // Handle page refresh
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Clear specific cache on refresh to force refetch
      localStorage.removeItem(`cacheTimestamp_${brandId}`);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [brandId]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Get the current brand
  const brand = brands.find(b => b.id === brandId);
  const brandName = brand?.name || `Brand #${brandId}`;
  const brandDescription = brand?.description || 'Premium tools for professionals';
  const brandImage = getBrandImage(brand);

  // Handle sorting
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  // Use manually filtered products if Redux filteredItems is empty
  const productsToDisplay = filteredItems.length > 0 ? filteredItems : manuallyFilteredProducts;

  // Sort products based on selected option
  const sortedProducts = [...productsToDisplay].sort((a, b) => {
    if (sortOption === 'price-low') return a.price - b.price;
    if (sortOption === 'price-high') return b.price - a.price;
    if (sortOption === 'name') return a.name.localeCompare(b.name);
    return 0; // Default sorting (featured)
  });

  if (status === 'loading' || brandsStatus === 'loading' || loadingProducts) {
    return (
      <div className="loading-container">
        <Loading size="medium" variant="spinner" color="primary" />
      </div>
    );
  }

  if (brandsError || error) {
    return (
      <div className="error-message">
        <div className="error-icon">⚠️</div>
        <h2>{brandsError || error}</h2>
        <button 
          className="retry-button"
          onClick={brandsError ? fetchBrands : fetchProducts}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="brand-products-page">
      <ScrollToTop />
      
      {/* Brand Hero Section */}
      <div className="brand-hero">
        <div className="container">
          <div className="brand-info">
            <h1>{brandName}</h1>
            <p>{brandDescription}</p>
          </div>
          <div className="brand-image">
            <img 
              src={brandImage} 
              alt={brandName}
              onError={(e) => {
                e.target.src = defaultImg;
              }}
            />
          </div>
        </div>
      </div>

      {/* Product Grid Section */}
      <div className="products-container">
        <div className="container">
          {/* Sorting and Results */}
          <div className="results-header">
            <div className="results-count">
              {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'} found
              {manuallyFilteredProducts.length > 0 && filteredItems.length === 0 && (
                <span style={{fontSize: '12px', color: '#ff5722', marginLeft: '10px'}}>
                  (using manual filtering)
                </span>
              )}
            </div>
            <div className="sort-options">
              <label htmlFor="sort-select">Sort by:</label>
              <select 
                id="sort-select" 
                value={sortOption}
                onChange={handleSortChange}
              >
                <option value="featured">Featured</option>
                <option value="name">Name (A-Z)</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Debug toggle button */}
          {/* <div style={{marginBottom: '10px'}}>
            <button 
              onClick={() => setShowDebug(!showDebug)}
              style={{
                padding: '5px 10px',
                background: '#f0f0f0',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '12px'
              }}
            >
              {showDebug ? 'Hide Debug Info' : 'Show Debug Info'}
            </button>
            <button 
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              style={{
                padding: '5px 10px',
                background: '#ffebee',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '12px',
                marginLeft: '10px'
              }}
            >
              Clear Cache & Reload
            </button>
          </div> */}

          {/* Debug information */}
          {/* {showDebug && (
            <div className="debug-info">
              <h3>Debug Information</h3>
              <p><strong>API URL:</strong> {debugInfo.apiUrl || 'Not loaded yet'}</p>
              <p><strong>Total products in store:</strong> {debugInfo.totalProducts || 0}</p>
              <p><strong>Brand ID from URL:</strong> {debugInfo.brandIdFromUrl} (type: {debugInfo.brandIdType})</p>
              <p><strong>Brand ID exists in products:</strong> {debugInfo.brandIdExistsInProducts ? 'Yes' : 'No'}</p>
              <p><strong>Matching products count:</strong> {debugInfo.matchingProductsCount || 0}</p>
              <p><strong>Redux filtered items count:</strong> {debugInfo.filteredItemsCount || 0}</p>
              <p><strong>Manually filtered count:</strong> {debugInfo.manuallyFilteredCount || 0}</p>
              <p><strong>Is initial load:</strong> {debugInfo.isInitialLoad ? 'Yes' : 'No'}</p>
              
              {debugInfo.sampleProductBrandIds && (
                <div>
                  <p><strong>Sample product brand IDs:</strong></p>
                  <ul>
                    {debugInfo.sampleProductBrandIds.map((product, idx) => (
                      <li key={idx}>
                        Product {product.id}: {product.brandId} (type: {product.brandIdType})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <button 
                onClick={() => {
                  console.log('All products:', items);
                  console.log('Filtered items:', filteredItems);
                  console.log('Manually filtered:', manuallyFilteredProducts);
                  console.log('Debug info:', debugInfo);
                  console.log('Brands:', brands);
                }}
                style={{marginTop: '10px', padding: '8px 12px', background: '#eee', border: '1px solid #ccc'}}
              >
                Log Debug Info to Console
              </button>
            </div>
          )} */}

          {/* Products Grid */}
          {sortedProducts.length > 0 ? (
            <div className="product-grid">
              {sortedProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={{
                    ...product,
                    imageUrl: product.images?.[0]?.imageUrl || defaultImg,
                  }}
                  linkTo={`/product/${product.id}`}
                  showBrand={false}
                />
              ))}
            </div>
          ) : (
            <div className="no-products">
              <h3>No products found for {brandName}</h3>
              
              {items.length > 0 && (
                <div className="debug-help">
                  <h4>Why might this be happening?</h4>
                  <ul>
                    <li>The Redux store might be resetting on page refresh</li>
                    <li>There could be an issue with the filterByBrand action</li>
                    <li>Check if there are any errors in the console</li>
                  </ul>
                  
                  <div style={{marginTop: '20px'}}>
                    <button 
                      onClick={fetchProducts}
                      style={{
                        padding: '10px 15px',
                        background: '#4caf50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Refetch Products
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrandProducts;