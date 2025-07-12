// src/components/common/HeroSlider/HeroSlider.js
import React, { useState, useEffect } from 'react';
import './HeroSlider.css';
import slide1 from '../../../assets/images/hero-slide1.jpg';
import slide2 from '../../../assets/images/new-arrivals.jpg';
import slide3 from '../../../assets/images/free-shipping.jpg';

const slides = [
  {
    id: 1,
    image: slide1,
    cta: 'Shop Now',
    link: '/category/power-tools'
  },
  {
    id: 2,
    image: slide2,
    cta: 'Explore',
    link: '/new-arrivals'
  },
  {
    id: 3,
    image: slide3,
    cta: 'Learn More',
    link: '/shipping-info'
  }
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hero-slider">
      <div className="slides-container">
        {slides.map((slide, index) => (
          <div 
            key={slide.id}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="slide-overlay"></div>
            <div className="slide-content">
              <a href={slide.link} className="cta-button">{slide.cta}</a>
            </div>
          </div>
        ))}
      </div>
      
      <div className="slider-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;