import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSubcategories } from '../../../store/subcategoriesSlice';
import ErrorMessage from '../../layout/ErrorMessage/ErrorMessage';
import Loading from '../Loading/Loading';
import './CategorySubcategories.css';
import ScrollToTop from '../Scroll/ScrollToTop';

const CategorySubcategories = () => {
  const { categoryId } = useParams();
  const dispatch = useDispatch();
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

  const { subcategories, status, error } = useSelector(state => state.subcategories);

  useEffect(() => {
    if (categoryId) {
      dispatch(fetchSubcategories(categoryId));
    }
  }, [categoryId, dispatch]);

  if (status === 'loading') return <Loading fullPage />;
  if (status === 'failed') return <ErrorMessage message={error} />;

  return (
    <div className="category-subcategories">
      <ScrollToTop/>
      <h2>Subcategories</h2>
      {subcategories.length > 0 ? (
        <div className="subcategory-list">
          {subcategories.map(sub => (
             <Link
             key={sub.id}
             to={`/category/${categoryId}/subcategory/${sub.id}`} 
             className="subcategory-link"
           >
              <div className="subcategory-card">
                <h3>{sub.name}</h3>
                {sub.description && <p>{sub.description}</p>}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="no-subcategories">No subcategories found for this category.</p>
      )}
    </div>
  );
};

export default CategorySubcategories;