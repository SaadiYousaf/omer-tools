import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { filterByBrand, fetchAllProducts } from '../../store/productsSlice';
import ProductCard from '../../components/common/Card/ProductCard';
import Loading from '../../components/common/Loading/Loading';
import './BrandProducts.css';
import ScrollToTop from '../../components/common/Scroll/ScrollToTop';

const BrandProducts = () => {
  const { brandId } = useParams();
  const dispatch = useDispatch();
  const { 
    filteredItems,
    items,
    status
  } = useSelector(state => state.products);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    console.log('Initial load - brandId:', brandId);
    
    // Fetch products if none exist
    if (items.length === 0) {
      console.log('Fetching all products...');
      dispatch(fetchAllProducts())
        .unwrap()
        .then(() => {
          console.log('Products fetched, now filtering...');
          dispatch(filterByBrand(brandId));
        });
    } else {
      console.log('Using existing products, filtering...');
      dispatch(filterByBrand(brandId));
    }
  }, [brandId, dispatch, items.length]);

  console.log('Render - filteredItems:', filteredItems);
  console.log('Render - all items:', items);

  if (status === 'loading') return <Loading />;

  return (
    <div className="brand-products-page">
        <ScrollToTop />
      <h2>Products for Brand #{brandId}</h2>
      
      {filteredItems.length > 0 ? (
        <div className="product-grid">
          
          {filteredItems.map(product => (
                <ProductCard
                key={product.id}
                product={{
                  ...product,
                  imageUrl:
                    product.images?.[0]?.imageUrl ||
                    "/images/products/default.png",
                }}
                linkTo={`/product/${product.id}`}      />
          ))}
        </div>
      ) : (
        <div className="no-products">
          <p>No products found for brand #{brandId}</p>
          <div className="debug-info">
            <p>Total products: {items.length}</p>
            <p>Product brand IDs: {
              items.slice(0, 3).map(p => p.brandId).join(', ')
            }</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandProducts;