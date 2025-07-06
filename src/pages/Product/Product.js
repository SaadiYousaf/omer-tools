import React from 'react';
import { useParams } from 'react-router-dom';
import './Product.css';

const Product = () => {
  const { productId } = useParams();
  
  // In a real app, you would fetch product data based on productId
  const product = {
    id: productId,
    name: `Product ${productId}`,
    price: 199.99,
    description: 'This is a detailed description of the product.',
    image: 'https://via.placeholder.com/500',
    rating: 4,
    reviews: 25,
    inStock: true,
  };

  return (
    <div className="product-page">
      <div className="product-container">
        <div className="product-image">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="product-details">
          <h1>{product.name}</h1>
          <div className="product-rating">
            {'★'.repeat(product.rating)}{'☆'.repeat(5 - product.rating)}
            <span>({product.reviews} reviews)</span>
          </div>
          <div className="product-price">${product.price.toFixed(2)}</div>
          <p className="product-description">{product.description}</p>
          <div className={`product-stock ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </div>
          <button className="add-to-cart-btn">Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default Product;