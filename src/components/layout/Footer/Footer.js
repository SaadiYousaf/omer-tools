import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  // Dummy click handlers for social media icons
  const handleSocialClick = (platform) => {
    console.log(`Navigating to ${platform}`);
    // In a real app, you would link to your social media pages:
    // window.open('https://www.facebook.com/yourpage', '_blank');
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>About Us</h3>
            <p>Omer Tools is your one-stop shop for quality tools and equipment.</p>
            <div className="social-icons">
              <FaFacebook 
                className="social-icon" 
                onClick={() => handleSocialClick('Facebook')} 
                aria-label="Facebook"
              />
              <FaTwitter 
                className="social-icon" 
                onClick={() => handleSocialClick('Twitter')} 
                aria-label="Twitter"
              />
              <FaInstagram 
                className="social-icon" 
                onClick={() => handleSocialClick('Instagram')} 
                aria-label="Instagram"
              />
              <FaLinkedin 
                className="social-icon" 
                onClick={() => handleSocialClick('LinkedIn')} 
                aria-label="LinkedIn"
              />
            </div>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/products">Products</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contact</h3>
            <p>Email: info@omertools.com</p>
            <p>Phone: (02) 1234 5678</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Omer Tools. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;