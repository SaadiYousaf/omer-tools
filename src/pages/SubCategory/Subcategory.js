import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom";
import {
  fetchSubcategories,
  setCurrentSubcategory,
} from "../../store/subcategoriesSlice";
import {
  fetchProductsBySubcategory,
  filterBySubcategory,
} from "../../store/productsSlice";
import { selectAllBrands } from "../../store/brandsSlice";
import ProductCard from "../../components/common/Card/ProductCard";
import Loading from "../../components/common/Loading/Loading";
import ErrorMessage from "../../components/layout/ErrorMessage/ErrorMessage";
import "./Subcategory.css";

const Subcategory = () => {
  const { categoryId, subcategoryId } = useParams();
  const dispatch = useDispatch();
  
  const [filters, setFilters] = useState({
    brandIds: [],
    minPrice: null,
    maxPrice: null,
    minRating: 0,
    sortBy: "relevance",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;

  const { subcategories, currentSubcategory, status, error } = useSelector(
    (state) => state.subcategories
  );

  const {
    filteredItems: allProducts,
    subcategoryProductsStatus,
    error: productsError,
  } = useSelector((state) => state.products);

  // Get all brands from Redux
  const allBrands = useSelector(selectAllBrands);

  useEffect(() => {
    if (categoryId) {
      dispatch(fetchSubcategories(categoryId));
    }
  }, [categoryId, dispatch]);

  useEffect(() => {
    if (subcategoryId) {
      const subcategory = subcategories.find(
        (sc) => sc.id === Number(subcategoryId)
      );
      if (subcategory) {
        dispatch(setCurrentSubcategory(subcategory));
      }
      dispatch(fetchProductsBySubcategory(subcategoryId));
      dispatch(filterBySubcategory(Number(subcategoryId)));
    }
  }, [subcategoryId, subcategories, dispatch]);

  // Calculate available filters
  const { minPriceAll, maxPriceAll, availableRatings } = useMemo(() => {
    const prices = [];
    const ratings = new Set();
    
    allProducts.forEach((product) => {
      prices.push(product.price);
      if (product.averageRating) {
        ratings.add(Math.floor(product.averageRating));
      }
    });
    
    return {
      minPriceAll: Math.min(...prices),
      maxPriceAll: Math.max(...prices),
      availableRatings: Array.from(ratings).sort((a, b) => b - a),
    };
  }, [allProducts]);

  // Apply filters and sorting
  const getFilteredProducts = () => {
    let filtered = [...allProducts];
    
    // Brand filter
    if (filters.brandIds.length > 0) {
      filtered = filtered.filter(
        (product) => product.brand && filters.brandIds.includes(product.brand.id)
      );
    }
    
    // Price range filter
    if (filters.minPrice) {
      filtered = filtered.filter(
        (product) => product.price >= filters.minPrice
      );
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(
        (product) => product.price <= filters.maxPrice
      );
    }
    
    // Rating filter
    if (filters.minRating > 0) {
      filtered = filtered.filter(
        (product) => product.averageRating >= filters.minRating
      );
    }
    
    // Sorting
    switch (filters.sortBy) {
      case "price_asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name_asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name_desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "rating":
        filtered.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        break;
      case "featured":
        filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
      default:
        // relevance - maintain original order
        break;
    }
    
    return filtered;
  };

  const filteredProducts = getFilteredProducts();
  
  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
    setCurrentPage(1);
  };

  const handleBrandToggle = (brandId) => {
    setFilters(prev => {
      const newBrandIds = prev.brandIds.includes(brandId)
        ? prev.brandIds.filter(id => id !== brandId)
        : [...prev.brandIds, brandId];
      
      return {
        ...prev,
        brandIds: newBrandIds
      };
    });
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      brandIds: [],
      minPrice: null,
      maxPrice: null,
      minRating: 0,
      sortBy: "relevance",
    });
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  const getSubcategoryImage = (subcategory) => {
    if (!subcategory.imageUrl) return "/images/subcategories/default.png";
    return subcategory.imageUrl;
  };

  if (status === "loading") return <Loading fullPage />;
  if (status === "failed") return <ErrorMessage message={error} />;
  if (!currentSubcategory) return <Loading fullPage />;

  return (
    <div className="subcategory-page">
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        {categoryId && (
          <>
            <span> / </span>
            <Link to={`/category/${categoryId}`}>Category</Link>
          </>
        )}
        <span> / {currentSubcategory.name}</span>
      </div>

      <div className="subcategory-header">
        <div className="subcategory-hero">
          <img
            src={getSubcategoryImage(currentSubcategory)}
            alt={currentSubcategory.name}
            className="subcategory-hero-image"
            onError={(e) => {
              e.target.src = "/images/subcategories/default.png";
            }}
          />
        </div>
        <div className="subcategory-info">
          <h1>{currentSubcategory.name}</h1>
          {currentSubcategory.description && (
            <p className="description">{currentSubcategory.description}</p>
          )}
        </div>
      </div>

      {subcategoryProductsStatus === "loading" && <Loading />}
      {subcategoryProductsStatus === "failed" && (
        <ErrorMessage message={productsError} />
      )}

      <div className="subcategory-layout">
        {/* Filters Sidebar */}
        <div className="subcategory-filters">
          <div className="filter-section">
            <h3>Brands</h3>
            <div className="scrollable-filter">
              {allBrands.map((brand) => (
                <div key={brand.id} className="filter-item">
                  <input
                    type="checkbox"
                    id={`brand-${brand.id}`}
                    checked={filters.brandIds.includes(brand.id)}
                    onChange={() => handleBrandToggle(brand.id)}
                  />
                  <label htmlFor={`brand-${brand.id}`}>
                    {brand.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3>Price Range</h3>
            <div className="price-range">
              <input
                type="number"
                placeholder={`Min (${minPriceAll})`}
                value={filters.minPrice || ""}
                onChange={(e) =>
                  handleFilterChange(
                    "minPrice",
                    e.target.value ? Number(e.target.value) : null
                  )
                }
              />
              <span>to</span>
              <input
                type="number"
                placeholder={`Max (${maxPriceAll})`}
                value={filters.maxPrice || ""}
                onChange={(e) =>
                  handleFilterChange(
                    "maxPrice",
                    e.target.value ? Number(e.target.value) : null
                  )
                }
              />
            </div>
          </div>

          <div className="filter-section">
            <h3>Customer Rating</h3>
            <div className="rating-filter">
              {[4, 3, 2, 1].map((rating) => (
                <div key={rating} className="rating-option">
                  <input
                    type="radio"
                    name="rating"
                    id={`rating-${rating}`}
                    checked={filters.minRating === rating}
                    onChange={() => 
                      handleFilterChange(
                        "minRating",
                        filters.minRating === rating ? 0 : rating
                      )
                    }
                  />
                  <label htmlFor={`rating-${rating}`}>
                    {Array(rating).fill().map((_, i) => (
                      <span key={i} className="star">★</span>
                    ))}
                    {rating < 4 && " & up"}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3>Sort By</h3>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
            >
              <option value="relevance">Relevance</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A-Z</option>
              <option value="name_desc">Name: Z-A</option>
              <option value="rating">Highest Rated</option>
              <option value="featured">Featured</option>
            </select>
          </div>

          <button className="clear-filters" onClick={handleClearFilters}>
            Clear All Filters
          </button>
        </div>

        {/* Products Grid */}
        <div className="subcategory-products">
          <div className="results-summary">
            Showing {indexOfFirstProduct + 1} -{" "}
            {Math.min(indexOfLastProduct, filteredProducts.length)} of{" "}
            {filteredProducts.length} products
            
            {/* Active filters indicator */}
            {(filters.brandIds.length > 0 || 
              filters.minPrice || 
              filters.maxPrice || 
              filters.minRating > 0) && (
              <span className="active-filters">
                (filtered)
              </span>
            )}
          </div>

          <div className="products-grid">
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  description={product.description}
                  product={{
                    ...product,
                    imageUrl:
                      product.images?.[0]?.imageUrl ||
                      "/images/products/default.png",
                  }}
                  linkTo={`/category/${categoryId}/subcategory/${subcategoryId}/product/${product.id}`}
                />
              ))
            ) : (
              <div className="no-products">
                {subcategoryProductsStatus === "succeeded"
                  ? "No products found with current filters"
                  : "Loading products..."}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    className={currentPage === pageNum ? "active" : ""}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                )
              )}

              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Subcategory;