import React from 'react';
import { useSelector } from 'react-redux';
import '../../../pages/Checkout/Checkout.css';

const OrderSummary = ({ showEdit = true, shippingCost, total }) => {
  const { items, totalAmount } = useSelector(state => state.cart);
  
  return (
    <div className="checkout-summary">
      <h3>Order Summary</h3>
      <div className="order-items">
        {items.map(item => (
          <div key={item.id} className="order-item">
            <div className="item-info">
              <span className="item-quantity">{item.quantity}x</span>
              <span className="item-name">{item.name}</span>
            </div>
            <span className="item-price">${item.totalPrice.toFixed(2)}</span>
          </div>
        ))}
      </div>
      
      <div className="summary-details">
        <div className="summary-item">
          <span>Subtotal</span>
          <span>${totalAmount.toFixed(2)}</span>
        </div>
        {showEdit && (
          <div className="summary-item">
            <span>Shipping</span>
            <span>${shippingCost.toFixed(2)}</span>
          </div>
        )}
        <div className="summary-item total">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;