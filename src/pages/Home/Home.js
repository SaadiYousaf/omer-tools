// Home.js
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

// Import slider images
import slide1 from "../../assets/images/pb.jpg";
import slide2 from "../../assets/images/dew2.jpg";
import slide3 from "../../assets/images/free-shipping.jpg";
import slide4 from "../../assets/images/dew2.jpg";
import slide5 from "../../assets/images/pb.jpg";
import ProductSlider from "../../components/common/ProductSlider/ProductSlider";

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

  // Define slide sets
  const heroSlides1 = [
    { id: 1, image: slide1, cta: "Shop Now", link: "/category/power-tools" },
    { id: 2, image: slide2, cta: "Explore", link: "/new-arrivals" },
  ];

  const heroSlides2 = [
    { id: 1, image: slide3, cta: "Learn More", link: "/shipping-info" },
    { id: 2, image: slide4, cta: "Buy Now", link: "/category/hand-tools" },
  ];

  const heroSlides3 = [
    { id: 1, image: slide5, cta: "Hot Deals", link: "/deals" },
    { id: 2, image: slide2, cta: "New Arrivals", link: "/new-arrivals" },
    { id: 3, image: slide3, cta: "Free Shipping", link: "/shipping-info" },
  ];

  return (
    <div className="home-page">
      <ScrollToTop />

      {/* Hero Section */}
      <section className="hero-section">
        <HeroSlider slides={heroSlides1} />
      </section>

      {/* Brand Showcase */}
      <BrandSlider />

      {/* Categories */}
      <section className="category-navigation main-categories">
        <div className="container">
          <CategorySlider categories={categories} activeBrandIndex={0} />
        </div>
      </section>

     

      {/* Secondary Categories */}
      <section className="category-navigation secondary-categories">
        <div className="container">
          {/* <h2>Popular Collections</h2> */}
          {/* <CategorySlider categories={categories} activeBrandIndex={2} /> */}

          <ProductSlider />
      
        </div>
      </section>

      {/* Dual Hero Banners */}
      <section className="dual-hero-banners">
        <div className="container">
          <div className="dual-hero-container">
            <div className="hero-column">
              <HeroSlider slides={heroSlides2} />
            </div>
            <div className="hero-column">
              <HeroSlider slides={heroSlides3} />
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
       {/* Member Deals */}
      <section className="member-deals-section">
        <MemberDeals />
      </section>
    </div>
  );
};

export default Home;
