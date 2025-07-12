import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../../store/authSlice';
import './Header.css';
import logoImage from "../../../assets/images/OmerToolsLogo.png";
import { FaShoppingCart, FaUser, FaSearch, FaBars, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const cartTotalQuantity = useSelector((state) => state.cart.totalQuantity);
  const categories = useSelector((state) => state.categories.categories);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const toggleDropdown = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  return (
    <header className="header">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="container">
          <div className="top-bar-content">
            <div className="top-bar-left">
              <span><FaPhone /> 1300 360 603</span>
              <span><FaMapMarkerAlt /> Store Locations</span>
            </div>
            <div className="top-bar-right">
              {isAuthenticated ? (
                <>
                  <span className="welcome">Hi, {user?.name}</span>
                  <button onClick={handleLogout} className="logout-btn">Logout</button>
                </>
              ) : (
                <Link to="/login" className="login-link">
                  <FaUser /> <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="main-header">
        <div className="container">
          <div className="main-header-content">
            {/* Logo */}
            <Link to="/" className="logo">
              <img src={logoImage} alt="Omer Tools" />
            </Link>

            {/* Mobile Menu Toggle */}
            <button 
              className="mobile-menu-toggle" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <FaBars />
            </button>

            {/* Search */}
            <div className="search-container">
              <input
                type="text"
                placeholder="Search products, brands and categories..."
                className="search-input"
              />
              <button className="search-btn">
                <FaSearch />
              </button>
            </div>

            {/* Cart */}
            <Link to="/cart" className="cart-container">
              <div className="cart-icon">
                <FaShoppingCart />
                <span className="cart-count">{cartTotalQuantity}</span>
              </div>
              <div className="cart-text">
                <span>My Cart</span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className={`navbar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="container">
          <ul className="nav-list">
            <li 
              className={`nav-item dropdown ${activeDropdown === 'categories' ? 'active' : ''}`}
              onClick={() => toggleDropdown('categories')}
              onMouseEnter={() => setActiveDropdown('categories')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <span className="dropdown-toggle">
                <FaBars className="menu-bars" /> Shop by Category
              </span>
              <div className="dropdown-menu">
                {categories.map(category => (
                  <Link 
                    key={category.id} 
                    to={`/category/${category.slug}`} 
                    className="dropdown-item"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </li>
            <li className="nav-item" onClick={() => setIsMobileMenuOpen(false)}>
              <Link to="/shop-by-brand">Shop By Brand</Link>
            </li>
            <li className="nav-item" onClick={() => setIsMobileMenuOpen(false)}>
              <Link to="/redemption">Redemptions</Link>
            </li>
            {/* <li className="nav-item" onClick={() => setIsMobileMenuOpen(false)}>
              <Link to="/clearance">Massive Clearance Sale</Link>
            </li> */}
            <li className="nav-item" onClick={() => setIsMobileMenuOpen(false)}>
              <Link to="/store-locations">Store Locations</Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;