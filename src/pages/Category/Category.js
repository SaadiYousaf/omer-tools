import React, { useEffect, useCallback } from 'react';
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
import defaultImg from "../../assets/images/default.jpg";
const BASE_URL=process.env.REACT_APP_BASE_URL;
const BASE_IMG_URL = process.env.REACT_APP_BASE_IMG_URL;
const Category = () => {
  const { categoryId } = useParams();
  const dispatch = useDispatch();
  
  const { 
    subcategories,
    status: subcategoriesStatus
  } = useSelector(state => state.subcategories);

  const brands = useSelector(selectCategoryBrands);
  const brandsStatus = useSelector(selectBrandsStatus);

  // Function to get brand image (consistent with other components)
  const getBrandImage = useCallback((brand) => {
    if (!brand) return defaultImg;
    
    // First, try to get the primary image from the images array
    if (brand.images && brand.images.length > 0) {
      // Find the primary image or use the first one
      const primaryImage = brand.images.find(img => img.isPrimary) || brand.images[0];
      return BASE_IMG_URL + primaryImage.imageUrl;
    }
    
    // Fall back to the legacy imageUrl property
    if (brand.imageUrl) return brand.imageUrl;
    
    // Fall back to logoUrl if exists
    if (brand.logoUrl) return brand.logoUrl;
    
    // Default image if no images are available
    return defaultImg;
  }, []);

  // Function to get subcategory image
  const getSubcategoryImage = useCallback((subcategory) => {
    if (!subcategory) return defaultImg;
    
    // First, try to get the primary image from the images array
    if (subcategory.images && subcategory.images.length > 0) {
      // Find the primary image or use the first one
      const primaryImage = subcategory.images.find(img => img.isPrimary) || subcategory.images[0];
      return BASE_IMG_URL + primaryImage.imageUrl;
    }
    
    // Fall back to the legacy imageUrl property
    if (subcategory.imageUrl) return subcategory.imageUrl;
    
    // Default image if no images are available
    return defaultImg;
  }, []);

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
                <div key={`brand-skeleton-${index}`} className="brand-item-skeleton">
                  <Loading size="small" variant="spinner" color="primary" />
                </div>
              ))
            ) : (
              // Show actual brands when loaded
              brands.map(brand => {
                const  buildImgePath= getBrandImage(brand);
                const brandImage =buildImgePath;
                
                return (
                  <div key={brand.id} className="brand-item">
                    <Link 
                      to={`/brand/${brand.id}`}
                      className="brand-link"
                    >
                      <img 
                        src={brandImage} 
                        alt={brand.name} 
                        className="brand-logo"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = defaultImg;
                        }}
                      />
                    </Link>
                  </div>
                );
              })
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
              <div key={`subcat-skeleton-${index}`} className="subcategory-card-skeleton">
                <Loading size="medium" variant="spinner" color="primary" />
              </div>
            ))
          ) : subcategories.length === 0 ? (
            <p className="no-subcategories">No subcategories found for this category.</p>
          ) : (
            // Show actual subcategories when loaded
            subcategories.map(subcategory => {
              const subcategoryImage = getSubcategoryImage(subcategory);
              return (
                <div key={subcategory.id} className="subcategory-card-wrapper">
                  <Link 
                    to={`/category/${categoryId}/subcategory/${subcategory.id}`}
                    className="subcategory-link"
                  >
                    <div className="subcategory-card">
                      <div className="subcategory-image-container">
                        <img
                          src={subcategoryImage}
                          alt={subcategory.name}
                          className="subcategory-image"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = defaultImg;
                          }}
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
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};

export default Category;