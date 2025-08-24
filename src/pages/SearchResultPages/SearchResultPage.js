import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductGrid from '../../components/common/ProductGrid/ProductGrid';
import './SearchResultPage.css';

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    categoryId: null,
    brandId: null,
    minPrice: null,
    maxPrice: null,
    sortBy: 'relevance'
  });
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Fetch search results
  const fetchResults = async () => {
    try {
      setLoading(true);
      
      // Build query parameters correctly
      const params = {
        term: searchParams.get('term') || '',
        page: page,
        pageSize: pageSize,
        sortBy: filters.sortBy
      };
  
      // Add optional parameters only if they have non-empty values
      if (filters.categoryId) params.categoryId = filters.categoryId;
      if (filters.brandId) params.brandId = filters.brandId;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
  
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`http://localhost:5117/api/search?${queryString}`);
       
      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      setResults(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [location.search, page, filters]);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: 
        filterType === 'minPrice' || filterType === 'maxPrice' 
          ? Number(value) 
          : value
    }));
    setPage(1);
  };
  // Handle pagination
  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  // Transform search results to match ProductCard expectations
  const transformProducts = () => {
    if (!results || !results.results) return [];
    
    return results.results.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      discountPrice: product.discountPrice,
      images: [{ imageUrl: product.imageUrl }],
      brand: product.brand,
      stockStatus: product.stockStatus,
      stockQuantity:product.stockQuantity,
      sku: product.SKU,
      category: product.category,
      isFeatured: product.isFeatured
    }));
  };

  if (loading) return <div className="search-loading">Loading results...</div>;
  if (error) return <div className="search-error">Error: {error}</div>;

  return (
    <div className="search-results-container">
      <h1>Search Results for "{results.query}"</h1>
      
      <div className="search-layout">
        {/* Filters Sidebar */}
        <div className="search-filters">
          <div className="filter-section">
            <h3>Categories</h3>
            <ul>
              {results.filters.categories.map(category => (
                <li key={category.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={filters.categoryId === category.id}
                      onChange={() => handleFilterChange(
                        'categoryId', 
                        filters.categoryId === category.id ? null : category.id
                      )}
                    />
                    {category.name} ({category.productCount})
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <div className="filter-section">
            <h3>Brands</h3>
            <ul>
              {results.filters.brands.map(brand => (
                <li key={brand.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={filters.brandId === brand.id}
                      onChange={() => handleFilterChange(
                        'brandId', 
                        filters.brandId === brand.id ? null : brand.id
                      )}
                    />
                    {brand.name} ({brand.productCount})
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <div className="filter-section">
            <h3>Price Range</h3>
            <div className="price-range">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice || ''}
                onChange={(e) => handleFilterChange('minPrice', e.target.value || null)}
              />
              <span>to</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice || ''}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value || null)}
              />
            </div>
          </div>

          <div className="filter-section">
            <h3>Sort By</h3>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            >
              <option value="relevance">Relevance</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A-Z</option>
              <option value="name_desc">Name: Z-A</option>
              <option value="featured">Featured</option>
            </select>
          </div>

          <button 
            className="clear-filters"
            onClick={() => setFilters({
              categoryId: null,
              brandId: null,
              minPrice: null,
              maxPrice: null,
              sortBy: 'relevance'
            })}
          >
            Clear All Filters
          </button>
        </div>

        {/* Results Main Area */}
        <div className="search-results">
          {results.results.length === 0 ? (
            <div className="no-results">
              <h2>No products found</h2>
              <p>Try adjusting your search or filters</p>
            </div>
          ) : (
            <>
              <div className="results-summary">
                Showing {results.pageSize * (results.page - 1) + 1} - 
                {Math.min(results.pageSize * results.page, results.totalCount)} of {results.totalCount} results
              </div>

              {/* Use ProductGrid component */}
              <ProductGrid products={transformProducts()} />
              
              {/* Pagination */}
              {results.totalPages > 1 && (
                <div className="pagination">
                  <button 
                    disabled={page === 1} 
                    onClick={() => handlePageChange(page - 1)}
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: results.totalPages }, (_, i) => i + 1).map(pageNum => (
                    <button
                      key={pageNum}
                      className={page === pageNum ? 'active' : ''}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  ))}
                  
                  <button 
                    disabled={page === results.totalPages} 
                    onClick={() => handlePageChange(page + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;