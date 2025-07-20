// src/pages/Product/Product.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentProduct, setLoading, setError } from '../../store/productsSlice';
import { addItemToCart } from '../../store/cartSlice';
import Loading from '../../components/common/Loading/Loading';
import ScrollToTop from "../../components/common/Scroll/ScrollToTop";
import './Product.css';

const Product = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const { items, currentProduct, status, error } = useSelector(state => state.products);
  const [quantity, setQuantity] = useState(1);
  const [localStock, setLocalStock] = useState(0);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    dispatch(setLoading(true));
    try {
      const product = items.find(p => p.id.toString() === productId.toString());
      if (product) {
        dispatch(setCurrentProduct(product));
        setLocalStock(product.stock ?? 10); // fallback stock = 10 if undefined
      } else {
        dispatch(setError('Product not found'));
      }
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  }, [productId, items, dispatch]);

  const handleAddToCart = () => {
    if (currentProduct && localStock >= quantity) {
      dispatch(
        addItemToCart({
          id: currentProduct.id,
          name: currentProduct.name,
          price: currentProduct.discountedPrice || currentProduct.price,
          image: currentProduct.image || '/images/default-product.jpg',
          quantity: quantity
        })
      );
      setLocalStock(localStock - quantity);
      setQuantity(1);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= localStock) {
      setQuantity(newQuantity);
    }
  };

  if (status === 'loading') return <Loading />;
  if (status === 'failed') return <div>Error: {error}</div>;
  if (!currentProduct) return <div>Product not found</div>;

  const hasDiscount =
    currentProduct.price &&
    currentProduct.discountedPrice &&
    currentProduct.discountedPrice < currentProduct.price;

  return (
    <div className="product-page">
         <ScrollToTop />
      <div className="product-container">

        <div className="product-gallery">
          <div className="main-image">
            <img
              src={currentProduct.image || '/images/default-product.jpg'}
              alt={currentProduct.name}
              onError={(e) => {
                e.target.src = '/images/default-product.jpg';
              }}
            />
          </div>
          <div className="thumbnail-container">
            {currentProduct.images?.length > 0 ? (
              currentProduct.images.map((img, index) => (
                <div
                  className={`thumbnail ${index === 0 ? 'active' : ''}`}
                  key={index}
                >
                  <img src={img} alt={`${currentProduct.name} ${index + 1}`} />
                </div>
              ))
            ) : (
              <div className="thumbnail active">
                <img
                  src={currentProduct.image || '/images/default-product.jpg'}
                  alt={currentProduct.name}
                />
              </div>
            )}
          </div>
        </div>


        <div className="product-details">
          <h1 className="product-title">{currentProduct.name}</h1>

          <div className="product-meta">
            <span className="sku">SKU: {currentProduct.sku || `TK-${currentProduct.id}`}</span>
            <span className="availability">
              {localStock > 0 ? `${localStock} In Stock` : 'Out of Stock'}
            </span>
          </div>

          <div className="price-container">
            {hasDiscount && (
              <span className="original-price">
                ${currentProduct.price.toFixed(2)}
              </span>
            )}
            <span className="current-price">
              ${(currentProduct.discountedPrice || currentProduct.price).toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="discount-badge">
                Save {Math.round(
                  ((currentProduct.price - currentProduct.discountedPrice) / currentProduct.price) * 100
                )}%
              </span>
            )}
          </div>

          <div className="product-description">
            <p>{currentProduct.description || 'No description available.'}</p>
          </div>

          <div className="product-actions">
            <div className="quantity-selector">
              <button
                className="quantity-btn"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                min="1"
                max={localStock}
                className="quantity-input"
                onChange={(e) =>
                  handleQuantityChange(parseInt(e.target.value) || 1)
                }
              />
              <button
                className="quantity-btn"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= localStock}
              >
                +
              </button>
            </div>
            <button
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={localStock <= 0}
            >
              {localStock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>

          <div className="product-specs">
            <h3>Specifications</h3>
            <table>
              <tbody>
                {currentProduct.specifications ? (
                  Object.entries(currentProduct.specifications).map(([key, value]) => (
                    <tr key={key}>
                      <td>{key}</td>
                      <td>{value}</td>
                    </tr>
                  ))
                ) : (
                  <>
                    <tr>
                      <td>Brand</td>
                      <td>{currentProduct.brand || 'Generic'}</td>
                    </tr>
                    <tr>
                      <td>Model</td>
                      <td>{currentProduct.model || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td>Weight</td>
                      <td>{currentProduct.weight || 'N/A'}</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
