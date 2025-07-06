// src/components/layout/Header/Header.js
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../../store/authSlice';
import './Header.css';
import logoImage from "../../../assets/images/OmerToolsLogo.png"

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const cartTotalQuantity = useSelector((state) => state.cart.totalQuantity);
  const categories = useSelector((state) => state.categories.categories);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const toggleCategory = () => {
    setIsCategoryOpen(!isCategoryOpen);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-top">
        <Link to="/" className="logo">
            <img 
              src={logoImage} 
              alt="Omer Tools" 
              className="logo-image"
            />
          </Link>
          <div className="header-actions">
            {isAuthenticated ? (
              <>
                <span className="welcome-message">Welcome, {user?.name}</span>
                <Link to="/cart" className="cart-link">
                  Cart ({cartTotalQuantity})
                </Link>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
              </>
            ) : (
              <Link to="/login" className="login-link">Login</Link>
            )}
          </div>
        </div>
     
        <nav className="navbar">
          <ul className="nav-list">
            <li 
              className="nav-item dropdown"
              onMouseEnter={() => setIsCategoryOpen(true)}
              onMouseLeave={() => setIsCategoryOpen(false)}
            >
              <span className="dropdown-toggle" onClick={toggleCategory}>
                Categories
              </span>
              {isCategoryOpen && (
                <ul className="dropdown-menu">
                  {categories.map(category => (
                    <li key={category.id} className="dropdown-item">
                      <Link to={`/category/${category.slug}`}>
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
            <li className="nav-item">
              <Link to="/redemption">Redemption</Link>
            </li>
            <li className="nav-item">
              <Link to="/discount">Deals</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;