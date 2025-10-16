// App.js
import React, { useEffect } from "react";
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

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  // Check if user is logged in on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(verifyToken());
    }
  }, [dispatch]);

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
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
