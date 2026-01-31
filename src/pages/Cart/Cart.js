// src/pages/Cart/Cart.js
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeItemFromCart, clearCart } from "../../store/cartSlice";
import { useNavigate } from "react-router-dom";
import ScrollToTop from "../../components/common/Scroll/ScrollToTop";
import "./Cart.css";
import Visa from "../../assets/images/visa.png";
import Mastercard from "../../assets/images/Mastercard.png";
import Paypal from "../../assets/images/paypal.png";
import Applepay from "../../assets/images/Applepay.png";
import Amex from "../../assets/images/Amex.png";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalQuantity, totalAmount } = useSelector(
    (state) => state.cart,
  );
  const { user, isAuthenticated } = useSelector((state) => state.auth); // ✅ Get user from auth state
  const [showGuestOption, setShowGuestOption] = useState(false); // ✅ NEW STATE
  useEffect(() => {}, [items]);
  const handleRemoveItem = (productId) => {
    dispatch(removeItemFromCart(productId));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleCheckout = () => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    //      console.log('Checkout auth check:', {
    //   token: !!token,
    //   reduxUser: user,
    //   reduxAuthenticated: isAuthenticated,
    //   storedUser: !!storedUser
    // });
    const hasToken = !!token;
    const hasUserInRedux = !!user;
    const hasUserInStorage = !!storedUser;
    const isReduxAuthenticated = isAuthenticated;

    // If we have a token and user data anywhere, proceed to checkout
    if (
      hasToken &&
      (hasUserInRedux || hasUserInStorage || isReduxAuthenticated)
    ) {
      navigate("/checkout");
    } else {
      setShowGuestOption(true);
    }
  };
  // ✅ NEW FUNCTION FOR GUEST CHECKOUT
  const handleGuestCheckout = () => {
    navigate("/checkout");
  };
  const handleLogin = () => {
    navigate("/login", { state: { from: "/checkout" } });
  };

  const closeGuestOption = () => {
    setShowGuestOption(false);
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (totalQuantity === 0) {
    return (
      <div className="cart-page empty-cart">
        <div className="cart-container">
          <div className="cart-header">
            <h1 className="cart-title">Your Cart</h1>
          </div>
          <div className="empty-cart-content">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your Cart is Empty</h2>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <button
              onClick={() => navigate("/")}
              className="continue-shopping-btn"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <ScrollToTop />
      {/* ✅ GUEST CHECKOUT MODAL */}
      {showGuestOption && (
        <div className="guest-checkout-modal">
          <div className="modal-overlay" onClick={closeGuestOption}></div>
          <div className="modal-content">
            <div className="modal-header">
              <h3>Continue to Checkout</h3>
              <button className="close-modal" onClick={closeGuestOption}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="checkout-option">
                <div className="option-icon">👤</div>
                <div className="option-content">
                  <h4>Login to Your Account</h4>
                  <p>
                    Access your order history and save your information for
                    faster checkout.
                  </p>
                  <button onClick={handleLogin} className="option-btn primary">
                    Login & Checkout
                  </button>
                </div>
              </div>

              <div className="checkout-divider">
                <span>OR</span>
              </div>

              <div className="checkout-option">
                <div className="option-icon">🚀</div>
                <div className="option-content">
                  <h4>Continue as Guest</h4>
                  <p>
                    Checkout without creating an account. You can create an
                    account later.
                  </p>
                  <button
                    onClick={handleGuestCheckout}
                    className="option-btn secondary"
                  >
                    Checkout as Guest
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="cart-container">
        <div className="cart-header">
          <h1 className="cart-title">
            Your Cart
            <span className="cart-count-1">
              ({totalQuantity} {totalQuantity === 1 ? "item" : "items"})
            </span>
          </h1>

          <button onClick={handleClearCart} className="clear-cart-btn">
            Clear Cart
          </button>
        </div>

        <div className="cart-content">
          <div className="cart-items-container">
            <div className="cart-items-header">
              <div className="header-product">Product</div>
              <div className="header-price">Price</div>
              <div className="header-quantity">Quantity</div>
              <div className="header-total">Total</div>
              <div className="header-actions"></div>
            </div>

            <div className="cart-items">
              {items.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="item-product">
                    <div className="item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="item-details">
                      <h3>{item.name}</h3>
                      <div className="item-sku">SKU: {item.sku}</div>
                    </div>
                  </div>
                  <div className="price-qty-total-wrapper">
                    <div className="item-price">
                      <div className="price-value">
                        ${item.price.toFixed(2)}
                      </div>
                      {item.originalPrice &&
                        item.originalPrice > item.price && (
                          <div className="original-price discounted">
                            ${item.originalPrice.toFixed(2)}
                          </div>
                        )}
                    </div>
                    <div className="item-quantity">
                      <div className="quantity-box">
                        <span className="quantity-value">{item.quantity}</span>
                      </div>
                    </div>
                    <div className="item-total">
                      ${item.totalPrice.toFixed(2)}
                    </div>
                  </div>
                  <div className="item-actions">
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="remove-item-btn"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="cart-summary">
            <div className="summary-box">
              <h3 className="summary-title">Order Summary</h3>

              <div className="summary-row">
                <span>Subtotal:</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="summary-row">
                <span>GST:</span>
                <span>Prices are included GST</span>
              </div>

              <div className="summary-total">
                <span>Total:</span>
                <span className="total-amount">${totalAmount.toFixed(2)}</span>
              </div>

              <div className="summary-actions">
                <button onClick={handleCheckout} className="checkout-btn">
                  Proceed to Checkout
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="continue-shopping-btn"
                >
                  Continue Shopping
                </button>
              </div>
              <div className="payment-icons">
                <img src={Visa} alt="Visa" className="payment-icon" />
                <img
                  src={Mastercard}
                  alt="Mastercard"
                  className="payment-icon"
                />
                <img
                  src={Amex}
                  alt="American Express"
                  className="payment-icon"
                />
                <img src={Paypal} alt="PayPal" className="payment-icon" />
                <img src={Applepay} alt="Apple Pay" className="payment-icon" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
