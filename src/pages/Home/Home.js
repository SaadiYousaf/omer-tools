import React from 'react';
import { useSelector } from 'react-redux';
import CategorySlider from '../../components/common/CategorySlider/CategorySlider';
import FeaturedProducts from '../../components/common/FeaturedProducts/FeaturedProducts';
import HeroSlider from '../../components/common/HeroSlider/HeroSlider';
import BrandSlider from '../../components/common/BrandSlider/BrandSlider';
import MemberDeals from '../../components/common/MembersDeal/MemberDeals';
import './Home.css';

const Home = () => {
  const categories = useSelector(state => state.categories.categories);
  
  return (
    <div className="home-page">
      <HeroSlider />
      <BrandSlider />
      
      {/* New Member Deals Section */}
      <MemberDeals />
      
      <section className="categories-section">
        <div className="container">
          <h2>Shop by Category</h2>
          <CategorySlider categories={categories} />
        </div>
      </section>
      
      <section className="featured-products">
        <div className="container">
          <FeaturedProducts />
        </div>
      </section>
    </div>
  );
};

export default Home;