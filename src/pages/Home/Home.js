import React from "react";
import { useSelector } from "react-redux";
import CategorySlider from "../../components/common/CategorySlider/CategorySlider";
import FeaturedProducts from "../../components/common/FeaturedProducts/FeaturedProducts";
import HeroSlider from "../../components/common/HeroSlider/HeroSlider";
import BrandSlider from "../../components/common/BrandSlider/BrandSlider";
import MemberDeals from "../../components/common/MembersDeal/MemberDeals";
import "./Home.css";

// Import all brand images
import brand1 from "../../components/common/BrandSlider/brands/brand1.PNG";
import brand2 from "../../components/common/BrandSlider/brands/brand2.PNG";
import brand3 from "../../components/common/BrandSlider/brands/brand3.PNG";
import brand4 from "../../components/common/BrandSlider/brands/brand4.PNG";
import brand5 from "../../components/common/BrandSlider/brands/brand5.PNG";

const Home = () => {
  const categories = useSelector((state) => state.categories.categories);
  const featuredProducts = useSelector((state) => 
    Array.isArray(state.products?.items)
      ? state.products.items
          .filter((product) => product.isFeatured)
          .slice(0, 4)
      : []
  );

  // Create an array of brand images to share across components
  const brandImages = [brand1, brand2, brand3, brand4, brand5];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <HeroSlider />
      </section>

      {/* Brand Showcase - shares the same brand images */}
      <section className="brand-showcase">
        <BrandSlider brands={brandImages} />
      </section>

      {/* Main Category Navigation */}
      <section className="category-navigation main-categories">
        <div className="container">
          <CategorySlider 
            categories={categories} 
            brandImages={brandImages}
            activeBrandIndex={0} // Use brand1 as primary
          />
        </div>
      </section>

      {/* Member Deals */}
      <section className="member-deals-section">
        <MemberDeals />
      </section>

 
      <section className="category-navigation secondary-categories">
        <div className="container">
          <h2>Popular Collections</h2>
          <CategorySlider 
            categories={categories} 
            brandImages={brandImages}
            activeBrandIndex={2} // Use brand3 for this section
          />
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
          <h2>Featured Products</h2>
          <FeaturedProducts products={featuredProducts} />
        </div>
      </section>
    </div>
  );
};

export default Home;