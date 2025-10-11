// src/components/ui/Loader/Loader.js
import React from 'react';
import './Loading.css';

const Loading = ({
  size = 'medium',
  variant = 'spinner',
  color = 'primary',
  className = ''
}) => {
  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className={`loader-dots dot-${size} loader-${color}`}>
            <div className="loader-dot"></div>
            <div className="loader-dot"></div>
            <div className="loader-dot"></div>
          </div>
        );
      case 'pulse':
        return (
          <div className={`loader-pulse loader-${size} loader-${color}`}></div>
        );
      case 'spinner':
      default:
        return (
          <div className={`loader-spinner loader-${size} loader-${color}`}></div>
        );
    }
  };

  return (
    <div className={`loader-container ${className}`} role="status" aria-live="polite">
      <span className="sr-only">Loading...</span>
      {renderLoader()}
    </div>
  );
};

export default Loading;