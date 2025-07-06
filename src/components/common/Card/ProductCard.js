import React from 'react';
import { useDispatch } from 'react-redux';
import { addItemToCart } from '../../../store/cartSlice';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addItemToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    }));
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-details">
        <h3 className="product-name">{product.name}</h3>
        <div className="product-price">${product.price?.toFixed(2)}</div>
        <div className="product-rating">
          {'★'.repeat(product.rating)}{'☆'.repeat(5 - (product.rating || 0))}
        </div>
        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;