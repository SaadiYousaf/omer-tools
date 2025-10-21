import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../../store/authSlice";
import { fetchCategories } from "../../../store/categoriesSlice";
import "./Header.css";
import logoImage from "../../../assets/images/OmerToolsLogo.png";
import {
  FaShoppingCart,
  FaUser,
  FaSearch,
  FaBars,
  FaPhone,
  FaMapMarkerAlt,
  FaTruck,
  FaTimes,
  FaBox,
  FaTag,
  FaLayerGroup,
  FaChevronRight,
} from "react-icons/fa";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Header = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const cartTotalQuantity = useSelector((state) => state.cart.totalQuantity);
  const categories = useSelector((state) => state.categories.categories);
  const categoriesStatus = useSelector((state) => state.categories.status);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showAllCategories, setShowAllCategories] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Fetch categories if not already loaded
  useEffect(() => {
    if (categoriesStatus === "idle") {
      dispatch(fetchCategories());
    }
  }, [categoriesStatus, dispatch]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchSuggestions = async () => {
      const trimmedTerm = searchTerm.trim();
      if (trimmedTerm.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        setIsLoading(true);
        setApiError("");

        const timestamp = Date.now();
        const response = await fetch(
          `${BASE_URL}/search/autocomplete?term=${encodeURIComponent(
            trimmedTerm
          )}&t=${timestamp}`,
          { signal }
        );

        if (!response.ok) {
          throw new Error(
            `API error: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();

        // Normalize API response to ensure consistent casing
        const normalizedData = data.map((item) => ({
          Type: item.type || item.Type,
          Value: item.value || item.Value,
          Category: item.category || item.Category,
          ReferenceId: item.referenceId || item.ReferenceId,
        }));

        if (isMounted) {
          setSuggestions(normalizedData);
          setShowSuggestions(true);
        }
      } catch (error) {
        if (error.name !== "AbortError" && isMounted) {
          console.error("Error fetching suggestions:", error);
          setApiError("Failed to load suggestions. Please try again.");
          setSuggestions([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);

    return () => {
      isMounted = false;
      controller.abort();
      clearTimeout(debounceTimer);
    };
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedTerm = searchTerm.trim();
    if (trimmedTerm) {
      navigate(`/search?term=${encodeURIComponent(trimmedTerm)}`);
      setIsMobileMenuOpen(false);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (!suggestion) return;

    // Use normalized properties
    switch (suggestion.Type) {
      case "Product":
        navigate(`/product/${suggestion.ReferenceId}`);
        break;
      case "Brand":
        navigate(`/brand/${suggestion.ReferenceId}`);
        break;
      case "Category":
        navigate(`/category/${suggestion.ReferenceId}`);
        break;
      default:
        navigate(`/search?term=${encodeURIComponent(suggestion.Value)}`);
    }

    setShowSuggestions(false);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSuggestions([]);
    setShowSuggestions(false);
    setApiError("");
  };

  const handleInputFocus = () => {
    if (searchTerm.trim().length >= 2) {
      setShowSuggestions(true);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleUserProfile = () => {
    navigate("/profile");
  };

  const toggleDropdown = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const getSuggestionIcon = (type) => {
    switch (type) {
      case "Product":
        return <FaBox className="suggestion-icon product" />;
      case "Brand":
        return <FaTag className="suggestion-icon brand" />;
      case "Category":
        return <FaLayerGroup className="suggestion-icon category" />;
      default:
        return <FaSearch className="suggestion-icon default" />;
    }
  };

  // Sort categories alphabetically by name
  const sortedCategories = [...categories].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  // Calculate categories to display
  const displayedCategories = showAllCategories
    ? sortedCategories
    : sortedCategories.slice(0, 10);

  return (
    <header className="header">
      <div className="top-bar">
        <div className="container">
          <div className="top-bar-content">
            <div className="free-delivery-container">
              <span className="free-delivery">
                <FaTruck /> FREE delivery on orders over $100
              </span>
            </div>
            <div className="top-bar-left"></div>
            <div className="top-bar-right">
              <span>
                <a href="tel:0297598833" className="phone-link">
                  <FaPhone /> 02 9759 8833
                </a>
              </span>
              <span>
                <FaMapMarkerAlt />{" "}
                <Link to="/store-locations">Store Locations</Link>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="main-header">
        <div className="container">
          <div className="main-header-grid">
            <button
              className="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <FaBars />
            </button>

            <Link to="/" className="logo">
              <img src={logoImage} alt="Omer Tools" />
            </Link>

            <div className="search-container-wrapper" ref={searchRef}>
              <form
                className="search-form"
                onSubmit={handleSearch}
                role="search"
              >
                <div className="search-input-container">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={handleInputFocus}
                    placeholder="Search products, brands, categories..."
                    className="search-input"
                    aria-label="Search"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      className="clear-search-btn"
                      onClick={handleClearSearch}
                      aria-label="Clear search"
                    >
                      <FaTimes />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="search-btn"
                    aria-label="Submit search"
                  >
                    <FaSearch />
                  </button>
                </div>
              </form>

              {showSuggestions && (
                <div className="suggestions-dropdown">
                  {isLoading ? (
                    <div className="suggestion-item loading">
                      <div className="suggestion-loader"></div>
                      Loading suggestions...
                    </div>
                  ) : apiError ? (
                    <div className="suggestion-item error">
                      <div className="error-icon">!</div>
                      {apiError}
                    </div>
                  ) : suggestions.length > 0 ? (
                    <>
                      <div className="suggestion-header">
                        <span>Suggestions</span>
                        <span className="suggestion-count">
                          {suggestions.length} results
                        </span>
                      </div>
                      {suggestions.map((suggestion) => (
                        <div
                          key={`${suggestion.Type}-${suggestion.ReferenceId}`}
                          className="suggestion-item"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {getSuggestionIcon(suggestion.Type)}
                          <div className="suggestion-content">
                            <div className="suggestion-main">
                              <span className="suggestion-value">
                                {suggestion.Value}
                              </span>
                              <span className="suggestion-type">
                                {suggestion.Type}
                              </span>
                            </div>
                            {suggestion.Category && (
                              <div className="suggestion-category">
                                {suggestion.Category}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </>
                  ) : searchTerm.trim().length >= 2 ? (
                    <div className="suggestion-item no-results">
                      No suggestions found for "{searchTerm}"
                    </div>
                  ) : null}
                </div>
              )}
            </div>
            <div className="user-cart-container">
              {isAuthenticated ? (
                <div className="user-dropdown">
                  <button className="user-btn">
                    <FaUser /> <span>{user?.name}</span>
                  </button>
                  <div className="user-dropdown-menu">
                    <button onClick={handleLogout} className="dropdown-item">
                      Logout
                    </button>
                    <button
                      onClick={handleUserProfile}
                      className="dropdown-item"
                    >
                      User Profile
                    </button>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="login-btn">
                  <FaUser /> <span>Login</span>
                </Link>
              )}

              <Link to="/cart" className="cart-container1">
                <div className="cart-icon">
                  <FaShoppingCart />
                  <span className="cart-count">{cartTotalQuantity}</span>
                </div>
                <span className="cart-text">Cart</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <nav className={`navbar ${isMobileMenuOpen ? "open" : ""}`}>
        <div className="container">
          <ul className="nav-list">
            <li
              className={`nav-item dropdown ${
                activeDropdown === "categories" ? "active" : ""
              }`}
              onClick={() => toggleDropdown("categories")}
              onMouseEnter={() => setActiveDropdown("categories")}
              onMouseLeave={() => {
                setActiveDropdown(null);
                setShowAllCategories(false);
              }}
            >
              <span className="dropdown-toggle">
                <FaBars className="menu-bars" /> Shop by Category
              </span>

              <div className="dropdown-menu">
                {categoriesStatus === "loading" ? (
                  <div className="loading-categories">
                    Loading categories...
                  </div>
                ) : sortedCategories.length > 0 ? (
                  <div className="category-grid">
                    {sortedCategories.map((category) => (
                      <Link
                        key={category.id}
                        to={`/category/${category.id}`}
                        className="dropdown-item"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="no-categories">No categories available</div>
                )}
              </div>
            </li>
            <li className="nav-item" onClick={() => setIsMobileMenuOpen(false)}>
              <Link to="/shop-by-brand">Shop By Brand</Link>
            </li>
            <li className="nav-item" onClick={() => setIsMobileMenuOpen(false)}>
              <Link to="/redemption">Redemptions</Link>
            </li>
            <li className="nav-item" onClick={() => setIsMobileMenuOpen(false)}>
              <Link to="/store-locations">Store Locations</Link>
            </li>
            <li className="nav-item" onClick={() => setIsMobileMenuOpen(false)}>
              <Link to="/create-your-kit">
                Create Your Own Kit
                <span className="coming-soon-badge">Coming Soon</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
