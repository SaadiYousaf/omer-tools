// src/pages/Category/Category.js
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setCurrentCategory } from '../../store/categoriesSlice';
import { setProducts, setLoading, setError } from '../../store/productsSlice';
import ProductCard from '../../components/common/Card/ProductCard';
import Loading from '../../components/common/Loading/Loading';
import { dummyProducts } from '../../data/dummyProducts';
import './Category.css';

const Category = () => {
  const { categorySlug } = useParams();
  const dispatch = useDispatch();
  const { categories, currentCategory } = useSelector(state => state.categories);
  const { items: products, status, error } = useSelector(state => state.products);

  useEffect(() => {
    const category = categories?.find(cat => cat.slug === categorySlug);
    if (category) {
      dispatch(setCurrentCategory(category));
      dispatch(setLoading(true));

      // Filter real dummyProducts by category
      const categoryProducts = dummyProducts.filter(
        product => product.categoryId === category.id
      );

      setTimeout(() => {
        dispatch(setProducts(categoryProducts));
        dispatch(setLoading(false));
      }, 500);
    } else {
      dispatch(setError('Category not found.'));
    }
  }, [categorySlug, categories, dispatch]);

  if (status === 'loading') return <Loading />;
  if (status === 'failed') return <div>Error: {error}</div>;

  return (
    <div className="category-page">
      <h1 className="category-title">{currentCategory?.name || 'Category'}</h1>
      <div className="products-grid">
        {products?.length > 0 ? (
          products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div>No products found in this category</div>
        )}
      </div>
    </div>
  );
};

export default Category;
