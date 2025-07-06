// src/pages/Category/Category.js
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setCurrentCategory,categories } from '../../store/categoriesSlice';
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
      
      // Generate and set mock products
      const mockProducts = generateMockProducts(category.id);
      setTimeout(() => {
        dispatch(setProducts(mockProducts));
      }, 500);
    }
  }, [categorySlug, categories, dispatch]);

const generateMockProducts = (categoryId) => {
  // First try to use existing dummy products
  const categoryProducts = dummyProducts.filter(
    product => product.categoryId === categoryId
  );
  
  if (categoryProducts.length > 0) {
    return categoryProducts;
  }
  
  // Fallback to generated products
  const categoryNames = {
    1: 'Power Tools',
    2: 'Hand Tools',
    3: 'Tool Storage',
    4: 'Safety Equipment', 
    5: 'Electrical'
  };
  
  return Array.from({ length: 8 }, (_, i) => ({
    id: `${categoryId}${i}`,
    name: `${categoryNames[categoryId]} Product ${i + 1}`,
    price: Math.floor(Math.random() * 200) + 50,
    image: `https://via.placeholder.com/300?text=${categoryNames[categoryId]}+${i+1}`,
    categoryId,
    rating: Math.floor(Math.random() * 5) + 1
  }));
};

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