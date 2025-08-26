import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { 
  fetchSubcategories,
} from '../../store/subcategoriesSlice';
import { 
  fetchBrandsByCategory,
  selectCategoryBrands,
  selectBrandsStatus
} from '../../store/categoriesSlice';
import Loading from '../../components/common/Loading/Loading';
import ErrorMessage from '../../components/layout/ErrorMessage/ErrorMessage';
import './Category.css';

const Category = () => {
  const { categoryId } = useParams();
  const dispatch = useDispatch();
  
  const { 
    subcategories,
    status: subcategoriesStatus
  } = useSelector(state => state.subcategories);

  const brands = useSelector(selectCategoryBrands);
  const brandsStatus = useSelector(selectBrandsStatus);

  // Load brands and subcategories when categoryId changes
  useEffect(() => {
    if (categoryId) {
      dispatch(fetchBrandsByCategory(categoryId));
      dispatch(fetchSubcategories(categoryId));
    }
  }, [categoryId, dispatch]);

  // Combined loading state
  const isLoading = brandsStatus === 'loading' || subcategoriesStatus === 'loading';
  const hasError = brandsStatus === 'failed' || subcategoriesStatus === 'failed';

  // Handle image loading errors
  const handleImageError = (e) => {
    e.target.src = '/images/subcategories/default.png';
  };

  // Skeleton loader for brands
  const BrandSkeleton = () => (
    <div className="brand-item loading">
      <div className="brand-logo-skeleton" />
    </div>
  );

  // Skeleton loader for subcategories
  const SubcategorySkeleton = () => (
    <div className="subcategory-card-wrapper">
      <div className="subcategory-card loading">
        <div className="subcategory-image-container-skeleton" />
        <div className="subcategory-info-skeleton">
          <div className="subcategory-name-skeleton" />
          <div className="subcategory-desc-skeleton" />
        </div>
      </div>
    </div>
  );

  if (hasError) return <ErrorMessage message="Failed to load category data" />;

  return (
    <div className="category-page">
      {/* Brands Section - Horizontal Scroll */}
      <section className="brands-section">
        <h2 className="section-title">TOP BRANDS</h2>
        <div className="brands-scroller">
          <div className="brands-container">
            {isLoading ? (
              // Show skeleton loaders while loading
              Array.from({ length: 8 }).map((_, index) => (
                // <BrandSkeleton key={`brand-skeleton-${index}`} />
                <Loading size="medium" variant="spinner" color="primary" />
              ))
            ) : (
              // Show actual brands when loaded
              brands.map(brand => (
                <div key={brand.id} className="brand-item">
                  <Link 
                    to={`/brand/${brand.id}`}
                    className="brand-link"
                  >
                    <img 
                      src={brand.logoUrl} 
                      alt={brand.name} 
                      className="brand-logo"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/brands/default.png';
                      }}
                    />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Subcategories Section */}
      <section className="subcategories-section">
        <h2 className="section-title">SHOP BY SUBCATEGORY</h2>
        <div className="subcategories-grid">
          {isLoading ? (
            // Show skeleton loaders while loading
            Array.from({ length: 6 }).map((_, index) => (
              <Loading size="medium" variant="spinner" color="primary" />
            ))
          ) : subcategories.length === 0 ? (
            <p className="no-subcategories">No subcategories found for this category.</p>
          ) : (
            // Show actual subcategories when loaded
            subcategories.map(subcategory => (
              <div key={subcategory.id} className="subcategory-card-wrapper">
                <Link 
                  to={`/category/${categoryId}/subcategory/${subcategory.id}`}
                  className="subcategory-link"
                >
                  <div className="subcategory-card">
                    <div className="subcategory-image-container">
                      <img
                        src={subcategory.imageUrl || '/images/subcategories/default.png'}
                        alt={subcategory.name}
                        className="subcategory-image"
                        onError={handleImageError}
                      />
                    </div>
                    <div className="subcategory-info">
                      <h3>{subcategory.name}</h3>
                      {subcategory.description && (
                        <p>{subcategory.description}</p>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Category;