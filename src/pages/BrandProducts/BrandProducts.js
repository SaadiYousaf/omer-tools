import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useApi from '../../api/useApi';
import ProductGrid from '../../components/common/ProductGrid/ProductGrid';
import Pagination from '../../components/common/Pagination/Pagination';
import Loading from '../../components/common/Loading/Loading';
import ScrollToTop from '../../components/common/Scroll/ScrollToTop';
import './BrandProducts.css';
import defaultImg from "../../assets/images/default.jpg";

const BASE_IMG_URL = process.env.REACT_APP_BASE_IMG_URL;

const BrandProducts = () => {
  const { brandId } = useParams();
  const { get } = useApi();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  
  const [sortOption, setSortOption] = useState('featured');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(15);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // State for brand details and products
  const [brand, setBrand] = useState(null);
  const [products, setProducts] = useState([]);

  const { brands, status: brandsStatus } = useSelector(state => state.brands);

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

  // Fetch brand details
  const fetchBrandDetails = useCallback(async () => {
    try {
      const brandData = await get(`${BASE_URL}/brands/${brandId}?includeImages=true`);
      setBrand(brandData);
    } catch (err) {
      console.error('Error fetching brand details:', err);
    }
  }, [brandId, get, BASE_URL]);

  // Fetch brand-specific products with pagination
  const fetchBrandProducts = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      // Use the brand-specific products endpoint with pagination
      const response = await get(
        `${BASE_URL}/products?brandId=${brandId}&page=${page}&limit=${productsPerPage}`
      );

      // Handle paginated response
      if (response.data && response.total !== undefined) {
        setProducts(response.data);
        setTotalProducts(response.total);
        setTotalPages(response.totalPages);
      } else if (Array.isArray(response)) {
        // Fallback for non-paginated response
        setProducts(response);
        setTotalProducts(response.length);
        setTotalPages(Math.ceil(response.length / productsPerPage));
      } else {
        setProducts([]);
        setTotalProducts(0);
        setTotalPages(0);
      }
    } catch (err) {
      setError('Failed to load brand products. Please try again later.');
      console.error('Error fetching brand products:', err);
    } finally {
      setLoading(false);
    }
  }, [brandId, get, BASE_URL, productsPerPage]);

  // Load brand details and products
  useEffect(() => {
    if (brandId) {
      fetchBrandDetails();
      fetchBrandProducts(currentPage);
    }
  }, [brandId, currentPage, fetchBrandDetails, fetchBrandProducts]);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle sorting
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  // Sort products based on selected option
  const sortedProducts = [...products].sort((a, b) => {
    if (sortOption === 'price-low') return (a.price || 0) - (b.price || 0);
    if (sortOption === 'price-high') return (b.price || 0) - (a.price || 0);
    if (sortOption === 'name') return (a.name || '').localeCompare(b.name || '');
    return 0; // Default sorting (featured)
  });

  // Get brand name and description
  const brandName = brand?.name || `Brand #${brandId}`;
  const brandDescription = brand?.description || 'Premium tools for professionals';
  const brandImage = getBrandImage(brand);

  // Calculate showing range
  const getShowingRange = () => {
    const start = (currentPage - 1) * productsPerPage + 1;
    const end = Math.min(currentPage * productsPerPage, totalProducts);
    return { start, end };
  };

  const { start, end } = getShowingRange();

  if (loading && products.length === 0) {
    return (
      <div className="loading-container">
        <Loading size="medium" variant="spinner" color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <div className="error-icon">⚠️</div>
        <h2>{error}</h2>
        <button 
          className="retry-button"
          onClick={() => fetchBrandProducts(currentPage)}
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
            {totalProducts > 0 && (
              <div className="brand-stats">
                {totalProducts} {totalProducts === 1 ? 'product' : 'products'} available
              </div>
            )}
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
          {products.length > 0 && (
            <div className="results-header">
              <div className="results-info">
                <p>
                  Showing {start}-{end} of {totalProducts} {brandName} products
                </p>
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
          )}

          {/* Products Grid */}
          {loading ? (
            <div className="loading-container">
              <Loading size="medium" variant="spinner" color="primary" />
            </div>
          ) : sortedProducts.length > 0 ? (
            <>
              <ProductGrid products={sortedProducts} />
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination-wrapper">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="no-products">
              <h3>No products found for {brandName}</h3>
              <p>We couldn't find any products for this brand at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrandProducts;