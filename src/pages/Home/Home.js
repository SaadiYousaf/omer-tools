import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CategorySlider from "../../components/common/CategorySlider/CategorySlider";
import FeaturedProducts from "../../components/common/FeaturedProducts/FeaturedProducts";
import HeroSlider from "../../components/common/HeroSlider/HeroSlider";
import BrandSlider from "../../components/common/BrandSlider/BrandSlider";
import MemberDeals from "../../components/common/MembersDeal/MemberDeals";
import ScrollToTop from "../../components/common/Scroll/ScrollToTop";
import "./Home.css";
import { fetchFeaturedProducts } from "../../store/productsSlice";

const Home = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.categories);
  const featuredProducts = useSelector((state) =>
    Array.isArray(state.products?.items)
      ? state.products.items.filter((product) => product.isFeatured).slice(0, 4)
      : []
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
  }, [dispatch]);

  return (
    <div className="home-page">
      <ScrollToTop />

      {/* Hero Section */}
      <section className="hero-section">
        <HeroSlider />
      </section>

      {/* Brand Showcase - tight under hero */}
      <BrandSlider />

      {/* Main Category Navigation */}
      <section className="category-navigation main-categories">
        <div className="container">
          <CategorySlider categories={categories} activeBrandIndex={0} />
        </div>
      </section>

      {/* Member Deals */}
      <section className="member-deals-section">
        <MemberDeals />
      </section>

      {/* Secondary Categories */}
      <section className="category-navigation secondary-categories">
        <div className="container">
          <h2>Popular Collections</h2>
          <CategorySlider categories={categories} activeBrandIndex={2} />
        </div>
      </section>

      {/* Dual Hero Banners */}
      <section className="dual-hero-banners">
        <div className="container">
          <div className="dual-hero-container">
            <div className="hero-column">
              <HeroSlider />
            </div>
            <div className="hero-column">
              <HeroSlider />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products-section">
        <div className="container">
        
          <FeaturedProducts products={featuredProducts} />
        </div>
      </section>
    </div>
  );
};

export default Home;
