// App.js
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header/Header";
import Footer from "./components/layout/Footer/Footer";
import Home from "./pages/Home/Home";
import Product from "./pages/Product/Product";
import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/Checkout/Checkout";
import BrandProducts from "./pages/BrandProducts/BrandProducts";
import Login from "./pages/Login/Login";
import ProtectedRoute from "./components/common/ProtectedRoute/ProtectedRoute";
import MembershipPage from "./pages/Membership/MembershipPage";
import WelcomePage from "./pages/Membership/WelcomePage";
import ClearanceSale from "./pages/ClearanceSale/ClearanceSale";
import ComingSoon from "./pages/CommingSoon/CommingSoon";
import ProfilePage from "./pages/UserProfile/ProfilePage";
import Category from "./pages/Category/Category";
import OrderHistoryPage from "./pages/OrderHistory/OrderHistoryPage";
import OrderHistory from "./components/common/OrderSummary/OrderSummary";
import Register from "./components/common/Registration/Register";
import Subcategory from "./pages/SubCategory/Subcategory";
import CategorySubcategories from "./components/common/Subcategory/CategorySubcategories";
import SubcategoryWrapper from "./components/common/Subcategory/SubcategoryWrapper";
import ProductUpload from "./pages/ProductUpload/ProductUpload";
import ScrollToTop from "./components/common/Scroll/ScrollToTop";
import SearchResultsPage from "./pages/SearchResultPages/SearchResultPage";
import ShopByBrand from "./pages/ShopbyBrand/ShopByBrand";
import RedemptionProducts from "./pages/Redemption/RedemptionProducts";
import OmerToolsStoreLocator from "./components/common/Map/OmerToolsStoreLocator";
import AddressBookPage from "./pages/UserProfile/AddressBook/AddressBookPage";
import AccountSettingsPage from "./pages/UserProfile/AccountSetting/AccountSettings";
import PaymentMethodsPage from "./pages/UserProfile/PaymentMethod/PaymentMethod";
import { verifyToken } from "./store/authSlice";
import OrderDetailsPage from "./pages/OrderDetails/OrderDetailsPage";
import Modal from "./components/common/popupmodal/modal";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.items);

  // State for modal popup
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // To keep track of previous cart length
  const prevCartLength = useRef(cartItems.length);

  // Check if user is logged in on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(verifyToken());
    }
  }, [dispatch]);

  // Detect when something new is added to the cart
  useEffect(() => {
    if (cartItems.length > prevCartLength.current) {
      setModalMessage("🛒 Item added to cart!");
      setShowModal(true);

      // Hide automatically after 2 seconds
      setTimeout(() => setShowModal(false), 2000);
    }

    prevCartLength.current = cartItems.length;
  }, [cartItems]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app">
      <Header />
      <main>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Category and Subcategory Routes */}
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/category/:categoryId" element={<Category />} />
          <Route
            path="/category/:categoryId/subcategory/:subcategoryId"
            element={<Subcategory />}
          />
          <Route
            path="/category/:categoryId/subcategory/:subcategoryId/product/:productId"
            element={<Product />}
          />
          <Route
            path="/subcategory/:categoryId"
            element={<CategorySubcategories />}
          />
          <Route path="/upload" element={<ProductUpload />} />
          <Route path="/shop-by-brand" element={<ShopByBrand />} />

          {/* Other Routes */}
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/clearance" element={<ClearanceSale />} />
          <Route path="/create-your-kit" element={<ComingSoon />} />
          <Route path="/brand/:brandId" element={<BrandProducts />} />
          <Route path="/redemption" element={<RedemptionProducts />} />
          <Route path="/store-locations" element={<OmerToolsStoreLocator />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<OrderHistoryPage />} />
          <Route path="/orders/:orderId" element={<OrderHistory />} />
          <Route path="/addresses" element={<AddressBookPage />} />
          <Route path="/payment-methods" element={<PaymentMethodsPage />} />
          <Route path="/account-settings" element={<AccountSettingsPage />} />
          <Route path="/orders/:orderId" element={<OrderDetailsPage />} />

          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrderHistory />
              </ProtectedRoute>
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/membership"
            element={
              <ProtectedRoute>
                <MembershipPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/welcome"
            element={
              <ProtectedRoute>
                <WelcomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrderHistory />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      <Footer />

      {/* Global Modal */}
      <Modal
        show={showModal}
        message={modalMessage}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}

export default App;
