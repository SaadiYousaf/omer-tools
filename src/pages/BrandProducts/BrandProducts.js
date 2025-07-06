// src/pages/BrandProducts/BrandProducts.js
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { filterByBrand, setLoading } from '../../store/productsSlice';
import ProductGrid from '../../components/common/ProductGrid/ProductGrid';
import './BrandProducts.css';
//import { brands } from '../../components/common/BrandSlider/BrandSlider';

const BrandProducts = () => {
  const { brandSlug } = useParams();
  const dispatch = useDispatch();
  const { filteredItems: products,items,status } = useSelector((state) => state.products);
  const brand = useSelector((state) => 
    items.find(product => product.brand === brandSlug)
  );

  useEffect(() => {
    if (brandSlug) {
      dispatch(setLoading(true));
      setTimeout(() => {
        dispatch(filterByBrand(brandSlug));
      }, 500);
    }
  }, [brandSlug, dispatch]);

  if (status === 'loading') {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="brand-products-page">
      <div className="container">
        <h1 className="brand-title">{brand?.name || 'Brand Products'}</h1>
        <p className="brand-description">
          {brand?.description || 'Explore our premium collection'}
        </p>
        
        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <div className="no-products">
            No products found for this brand.
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandProducts;