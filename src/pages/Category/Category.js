import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { 
  fetchSubcategories,
  setCurrentSubcategory
} from '../../store/subcategoriesSlice';
import ProductCard from '../../components/common/Card/ProductCard';
import Loading from '../../components/common/Loading/Loading';
import ErrorMessage from '../../components/layout/ErrorMessage/ErrorMessage';
import './Category.css';

const Category = () => {
  const { categoryId } = useParams();
  const dispatch = useDispatch();
  
  const { 
    subcategories,
    status
  } = useSelector(state => state.subcategories);

  // Load subcategories when categoryId changes
  useEffect(() => {
    if (categoryId) {
      dispatch(fetchSubcategories(categoryId));
    }
  }, [categoryId, dispatch]);

  if (status === 'loading') return <Loading fullPage />;
  if (status === 'failed') return <ErrorMessage message="Failed to load subcategories" />;

  return (
    <div className="category-page">
      <h2 className="category-title">Subcategories</h2>
      <div className="subcategories-grid">
        {subcategories.map(subcategory => {
          // Format subcategory data to match product card expectations
          const cardData = {
            id: subcategory.id,
            name: subcategory.name,
            image: subcategory.imageUrl,
            description: subcategory.description,
            // Add mock price data to maintain card styling
            price: 0,
            discountedPrice: 0,
            // Add empty colors array to prevent errors
            colors: []
          };

          return (
            <div key={subcategory.id} className="subcategory-card-wrapper">
              <Link 
                 to={`/category/${categoryId}/subcategory/${subcategory.id}`}
                className="subcategory-link"
              >
                <ProductCard product={cardData} />
                <div className="subcategory-badge">Subcategory</div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Category;