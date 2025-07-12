import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header/Header';
import Footer from './components/layout/Footer/Footer';
import Home from './pages/Home/Home';
import Category from './pages/Category/Category';
import Product from './pages/Product/Product';
import Cart from './pages/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';
import BrandProducts from './pages/BrandProducts/BrandProducts';
import Login from './pages/Login/Login';
import ProtectedRoute from './components/common/ProtectedRoute/ProtectedRoute';
import MembershipPage from './pages/Membership/MembershipPage';
import WelcomePage from './pages/Membership/WelcomePage';
import ClearanceSale from './pages/ClearanceSale/ClearanceSale';


function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:categorySlug" element={<Category />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/login" element={<Login />} />
          <Route path="/brand/:brandSlug" element={<BrandProducts />} />
          <Route path="/clearance" element={<ClearanceSale/>} />

          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
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