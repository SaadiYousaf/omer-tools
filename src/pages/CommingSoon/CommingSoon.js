// src/pages/ComingSoon/ComingSoon.js
import React from 'react';
import './CommingSoon.css';
import ScrollToTop from "../../components/common/Scroll/ScrollToTop";

const CommingSoon = () => {
  return (
    <div className="coming-soon-container">
      <div className="coming-soon-content">
        <h1>Create Your Own Kit</h1>
        <p>This exciting new feature is coming soon!</p>
        <p>Build custom tool kits tailored to your specific needs.</p>
        <div className="countdown">
          <p>Launching in:</p>
          <div className="timer">
            <span>30</span> days <span>12</span> hours <span>45</span> minutes
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommingSoon;