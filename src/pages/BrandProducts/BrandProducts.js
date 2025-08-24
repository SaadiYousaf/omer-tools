import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { filterByBrand, fetchAllProducts } from '../../store/productsSlice';
import { fetchBrands, selectAllBrands, selectBrandsStatus } from '../../store/brandsSlice';
import ProductCard from '../../components/common/Card/ProductCard';
import Loading from '../../components/common/Loading/Loading';
import ScrollToTop from '../../components/common/Scroll/ScrollToTop';
import './BrandProducts.css';

const BrandProducts = () => {
  const { brandId } = useParams();
  const dispatch = useDispatch();
  const [sortOption, setSortOption] = useState('featured');
  
  const { filteredItems, items, status } = useSelector(state => state.products);
  const brands = useSelector(selectAllBrands);
  const brandsStatus = useSelector(selectBrandsStatus);

  // Fetch brands if not already fetched
  useEffect(() => {
    if (brandsStatus === 'idle') {
      dispatch(fetchBrands());
    }
  }, [brandsStatus, dispatch]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch/filter products
  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchAllProducts())
        .unwrap()
        .then(() => {
          dispatch(filterByBrand(brandId));
        });
    } else {
      dispatch(filterByBrand(brandId));
    }
  }, [brandId, dispatch, items.length]);

  // Find brand details
  const brand = brands.find(b => b.id === (brandId));
  const brandName = brand?.name || `Brand #${brandId}`;
  const brandDescription = brand?.description || 'Premium tools for professionals';

  // Handle sorting
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  // Sort products based on selected option
  const sortedProducts = [...filteredItems].sort((a, b) => {
    if (sortOption === 'price-low') return a.price - b.price;
    if (sortOption === 'price-high') return b.price - a.price;
    if (sortOption === 'name') return a.name.localeCompare(b.name);
    return 0; // Default sorting (featured)
  });

  if (status === 'loading' || brandsStatus === 'loading') return <Loading />;

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
            {brand?.logoUrl ? (
              <img 
                src={brand.logoUrl} 
                alt={brandName} 
                onError={(e) => {
                  e.target.src = '/images/brands/default.png';
                }}
              />
            ) : (
              <div className="brand-placeholder"></div>
            )}
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

          {/* Products Grid */}
          {sortedProducts.length > 0 ? (
            <div className="product-grid">
              {sortedProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={{
                    ...product,
                    imageUrl: product.images?.[0]?.imageUrl || "/images/products/default.png",
                  }}
                  linkTo={`/product/${product.id}`}
                  showBrand={false}
                />
              ))}
            </div>
          ) : (
            <div className="no-products">
              <p>No products found for {brandName}</p>
              <div className="debug-info">
                <p>Total products: {items.length}</p>
                <p>Product brand IDs: {items.slice(0, 3).map(p => p.brandId).join(', ')}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrandProducts;