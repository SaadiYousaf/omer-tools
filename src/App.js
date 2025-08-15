import React from "react";
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
import Subcategory from "./pages/SubCategory/Subcategory";
import CategorySubcategories from "./components/common/Subcategory/CategorySubcategories";
import SubcategoryWrapper from "./components/common/Subcategory/SubcategoryWrapper";
import ProductUpload from "./pages/ProductUpload/ProductUpload";
import ScrollToTop from "./components/common/Scroll/ScrollToTop";
import SearchResultsPage from './pages/SearchResultPages/SearchResultPage';
import ShopByBrand from "./pages/ShopbyBrand/ShopByBrand";


function App() {
  return (
    <div className="app">
      <Header />
      <main>
      <ScrollToTop/>
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Category and Subcategory Routes */}
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/category/:categoryId" element={<Category />} />
          <Route path="/category/:categoryId/subcategory/:subcategoryId" element={<Subcategory />} />
          <Route path='/category/:categoryId/subcategory/:subcategoryId/product/:productId' element={<Product/>}/>
          <Route path="/subcategory/:categoryId" element={<CategorySubcategories />} />
          <Route path="/upload" element={<ProductUpload />} />
          <Route path="/shop-by-brand" element={<ShopByBrand/>} />
           {/* Other Routes */}
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/login" element={<Login />} />
          <Route path="/clearance" element={<ClearanceSale />} />
          <Route path="/create-your-kit" element={<ComingSoon />} />
          <Route path="/brand/:brandId" element={<BrandProducts />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/orders" element={<OrderHistoryPage />} />
            <Route path="/membership" element={<MembershipPage />} />
            <Route path="/welcome" element={<WelcomePage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;