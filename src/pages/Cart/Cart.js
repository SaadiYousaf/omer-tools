import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeItemFromCart, clearCart } from '../../store/cartSlice';
import './Cart.css';

const Cart = () => {
  const dispatch = useDispatch();
  const { items, totalQuantity, totalAmount } = useSelector(state => state.cart);

  const handleRemoveItem = (productId) => {
    dispatch(removeItemFromCart(productId));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  if (totalQuantity === 0) {
    return (
      <div className="cart-page empty-cart">
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven't added anything to your cart yet.</p>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2>Your Cart ({totalQuantity} items)</h2>
      
      <div className="cart-items">
        {items.map(item => (
          <div key={item.id} className="cart-item">
            <div className="item-image">
              <img src={item.image} alt={item.name} />
            </div>
            <div className="item-details">
              <h3>{item.name}</h3>
              <div className="item-price">${item.price.toFixed(2)}</div>
              <div className="item-quantity">Qty: {item.quantity}</div>
              <button 
                onClick={() => handleRemoveItem(item.id)}
                className="remove-item-btn"
              >
                Remove
              </button>
            </div>
            <div className="item-total">
              ${item.totalPrice.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      
      <div className="cart-summary">
        <div className="summary-row">
          <span>Subtotal:</span>
          <span>${totalAmount.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Shipping:</span>
          <span>Calculated at checkout</span>
        </div>
        <div className="summary-row total">
          <span>Total:</span>
          <span>${totalAmount.toFixed(2)}</span>
        </div>
        
        <div className="cart-actions">
          <button className="continue-shopping">Continue Shopping</button>
          <button className="checkout-btn">Proceed to Checkout</button>
          <button 
            onClick={handleClearCart}
            className="clear-cart-btn"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;