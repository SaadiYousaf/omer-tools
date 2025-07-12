import React from "react";
import { useSelector } from "react-redux";
import CategorySlider from "../../components/common/CategorySlider/CategorySlider";
import FeaturedProducts from "../../components/common/FeaturedProducts/FeaturedProducts";
import HeroSlider from "../../components/common/HeroSlider/HeroSlider";
import BrandSlider from "../../components/common/BrandSlider/BrandSlider";
import MemberDeals from "../../components/common/MembersDeal/MemberDeals";
import "./Home.css";

const Home = () => {
  const categories = useSelector((state) => state.categories.categories);
  const products = useSelector((state) =>
    Array.isArray(state.products?.items)
      ? state.products.items
          .filter((product) => product.isFeatured) // Only show featured products
          .slice(0, 4)
      : []
  );

  return (
    <div className="home-page">
      <HeroSlider />
      <BrandSlider />
      <MemberDeals />
      <section className="categories-section">
        <div className="container">
          <h2>Shop by Category</h2>
          <CategorySlider categories={categories} />
        </div>
      </section>
      {/* <section className="categories-section">
        <div className="container">
          <h2>Shop by Category</h2>
          <CategorySlider categories={products} />
        </div>
      </section> */}
      <div className="dual-hero-container">
        <div className="hero-column">
          <HeroSlider />
        </div>
        <div className="hero-column">
          <HeroSlider />
        </div>
      </div>
      <section className="featured-products">
        <div className="container">
          <FeaturedProducts />
        </div>
      </section>
    </div>
  );
};

export default Home;
