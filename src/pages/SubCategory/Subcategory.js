import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { 
  fetchSubcategories,
  setCurrentSubcategory
} from '../../store/subcategoriesSlice';
import { fetchProductsBySubcategory } from '../../store/productsSlice';
import ProductCard from '../../components/common/Card/ProductCard';
import Loading from '../../components/common/Loading/Loading';
import ErrorMessage from '../../components/layout/ErrorMessage/ErrorMessage';
import './Subcategory.css';

const Subcategory = () => {
  const { categoryId, subcategoryId } = useParams();
  const dispatch = useDispatch();
  
  const { 
    subcategories,
    currentSubcategory,
    status,
    error
  } = useSelector(state => state.subcategories);

  const {
    productsBySubcategory,
    subcategoryProductsStatus,
    error: productsError
  } = useSelector(state => state.products);

  useEffect(() => {
    if (categoryId) {
      dispatch(fetchSubcategories(categoryId));
    }
  }, [categoryId, dispatch]);

  useEffect(() => {
    if (subcategoryId) {
      if (subcategories.length > 0) {
        const subcategory = subcategories.find(sc => sc.id === Number(subcategoryId));
        if (subcategory) {
          dispatch(setCurrentSubcategory(subcategory));
          dispatch(fetchProductsBySubcategory(subcategoryId));
        }
      } else {
        dispatch(fetchProductsBySubcategory(subcategoryId));
      }
    }
  }, [subcategoryId, subcategories, dispatch]);

  if (status === 'loading') return <Loading fullPage />;
  if (status === 'failed') return <ErrorMessage message={error} />;
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
        <h1>{currentSubcategory.name}</h1>
        {currentSubcategory.description && (
          <p className="description">{currentSubcategory.description}</p>
        )}
      </div>
      
      {subcategoryProductsStatus === 'loading' && <Loading />}
      {subcategoryProductsStatus === 'failed' && <ErrorMessage message={productsError} />}
      
      <div className="products-grid">
        {productsBySubcategory.length > 0 ? (
          productsBySubcategory.map(product => (
            <ProductCard 
              key={product.id} 
              product={product}
              linkTo={`/category/${categoryId}/subcategory/${subcategoryId}/product/${product.id}`}
            />
          ))
        ) : (
          <div className="no-products">
            {subcategoryProductsStatus === 'succeeded' ? 'No products found in this subcategory' : 'Loading products...'}
          </div>
        )}
      </div>
    </div>
  );
};

export default Subcategory;