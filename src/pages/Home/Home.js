// Home.js
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import CategorySlider from "../../components/common/CategorySlider/CategorySlider";
import FeaturedProducts from "../../components/common/FeaturedProducts/FeaturedProducts";
import HeroSlider from "../../components/common/HeroSlider/HeroSlider";
import BrandSlider from "../../components/common/BrandSlider/BrandSlider";
import MemberDeals from "../../components/common/MembersDeal/MemberDeals";
import ScrollToTop from "../../components/common/Scroll/ScrollToTop";
import SEO from "../../components/common/SEO/SEO";
import { useSEO } from "../../hooks/useSEO";
import "./Home.css";
import {
  fetchFeaturedProducts,
  fetchAllProducts,
  selectAllProducts,
} from "../../store/productsSlice";

// Desktop  slider images
import slide1 from "../../assets/images/Slider1.jpg";
import slide2 from "../../assets/images/Slider2.jpg";
import slide3 from "../../assets/images/Slider3.jpg";
import slide4 from "../../assets/images/1.jpg";
import slide5 from "../../assets/images/2.jpg";
import slide6 from "../../assets/images/6.jpg";
import slide7 from "../../assets/images/7.jpg";
import ProductSlider from "../../components/common/ProductSlider/ProductSlider";
// Mobile Images
import slide1Mobile from "../../assets/images/milwaukee_phone_size.jpg";
import slide2Mobile from "../../assets/images/hikoki_phone_size.jpg";
import slide3Mobile from "../../assets/images/dewalt-phone-size.jpg";
import slide4Mobile from "../../assets/images/dewalt-phone-size.jpg";

const BASE_URL = process.env.REACT_APP_BASE_URL || '';
const BASE_IMG_URL = process.env.REACT_APP_BASE_IMG_URL || '';

const Home = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.categories);
  const products = useSelector(selectAllProducts);
  // State to detect mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  // API-driven hero slides (override static if API returns data)
  const [apiHeroSlides1, setApiHeroSlides1] = useState([]);
  const [apiHeroSlides2, setApiHeroSlides2] = useState([]);

    //SEO hook
  const seoData ={
    title: "Omer Tools - Premium Tools & Equipment",
    description: "Discover premium power tools, hand tools, and equipment from top brands like Milwaukee, DeWalt, and Hikoki. Best prices, free shipping, and expert service.",
    keywords: "power tools, hand tools, equipment, construction tools, professional tools, shop online, Milwaukee, DeWalt, Hikoki, Omer Tools",
    ogTitle: "Omer Tools - Premium Tools & Equipment",
    ogDescription: "Discover premium power tools, hand tools, and equipment from top brands.",
    siteVerification:'GpiiEykGsHnDUq0g11xRmXXK9rHVIANbQMUL77z7sGM'
};
  // Update isMobile on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const featuredProducts = useSelector((state) => state.products.featuredItems);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
    //  dispatch(fetchAllProducts());
  }, [dispatch]);

  // Fetch hero images from API
  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        const response = await fetch(`${BASE_URL}/site-settings/hero-images`);
        if (response.ok) {
          const data = await response.json();
          const toSlide = (img) => ({
            id: img.id,
            image: `${BASE_IMG_URL}${img.imageUrl}`,
            cta: img.ctaText || 'Shop Now',
            link: img.linkUrl || '/',
            altText: img.altText,
          });
          const mainImages = data.filter((img) => img.section === 'main').map(toSlide);
          const secondaryImages = data.filter((img) => img.section === 'secondary').map(toSlide);
          if (mainImages.length > 0) setApiHeroSlides1(mainImages);
          if (secondaryImages.length > 0) setApiHeroSlides2(secondaryImages);
        }
      } catch (err) {
        // Fall back to static images silently
      }
    };
    fetchHeroImages();
  }, []);

  // Define slide sets
  const heroSlides1 = isMobile
    ? [
        {
          id: 1,
          image: slide1Mobile,
          cta: "Shop Now",
          link: "/category/power-tools",
        },
        { id: 2, image: slide2Mobile, cta: "Explore", link: "/new-arrivals" },
        { id: 3, image: slide3Mobile, cta: "none", link: "/new-arrivals" },
         { id: 4, image: slide4Mobile, cta: "none", link: "/new-arrivals" },
      ]
    : [
        {
          id: 1,
          image: slide1,
          cta: "Shop Now",
          link: "/category/power-tools",
        },
        { id: 2, image: slide2, cta: "Explore", link: "/new-arrivals" },
        { id: 3, image: slide3, cta: "none", link: "/new-arrivals" },
        { id: 4, image: slide6, cta: "none", link: "/new-arrivals" },
      ];

  const heroSlides2 = isMobile
    ? [
        {
          id: 1,
          image: slide4Mobile,
          cta: "Learn More",
          link: "/shipping-info",
        },
        { id: 2, image: slide1Mobile, cta: "Buy Now", link: "/category/hand-tools" },
        { id: 3, image: slide2Mobile, cta: "Shop Now", link: "/category/hand-tools" },
      ]
    : [
        { id: 1, image: slide7, cta: "Learn More", link: "/shipping-info" },
        { id: 2, image: slide5, cta: "Buy Now", link: "/category/hand-tools" },
        { id: 3, image: slide4, cta: "Buy Now", link: "/category/hand-tools" },
      ];

  // const heroSlides3 = [
  //   { id: 1, image: slide5, cta: "Hot Deals", link: "/deals" },
  //   { id: 2, image: slide2, cta: "New Arrivals", link: "/new-arrivals" },
  //   { id: 3, image: slide3, cta: "Free Shipping", link: "/shipping-info" },
  // ];

  return (
    <div className="home-page">
      <ScrollToTop />
        {/* SEO Component*/}
         <SEO {...seoData} />

      {/* Hero Section */}
      <section className="hero-section">
        <HeroSlider slides={apiHeroSlides1.length > 0 ? apiHeroSlides1 : heroSlides1} />
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
              <HeroSlider slides={apiHeroSlides2.length > 0 ? apiHeroSlides2 : heroSlides2} />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products-section">
        <div className="container">
          <FeaturedProducts />
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
