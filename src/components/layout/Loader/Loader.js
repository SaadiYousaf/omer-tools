// src/components/ui/Loader/Loader.js
import React from 'react';
import './Loader.css';

const Loader = ({
  size = 'medium',
  variant = 'spinner',
  color = 'primary',
  className = ''
}) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-purple-600',
    light: 'text-gray-200',
    dark: 'text-gray-700'
  };

  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className={`flex space-x-2 ${sizeClasses[size]}`}>
            <div className={`w-2 h-2 rounded-full animate-bounce ${colorClasses[color]}`} style={{ animationDelay: '0s' }} />
            <div className={`w-2 h-2 rounded-full animate-bounce ${colorClasses[color]}`} style={{ animationDelay: '0.2s' }} />
            <div className={`w-2 h-2 rounded-full animate-bounce ${colorClasses[color]}`} style={{ animationDelay: '0.4s' }} />
          </div>
        );
      case 'pulse':
        return (
          <div className={`rounded-full animate-pulse ${sizeClasses[size]} ${colorClasses[color]}`} />
        );
      case 'spinner':
      default:
        return (
          <div className={`animate-spin rounded-full border-b-2 border-t-2 ${colorClasses[color]} ${sizeClasses[size]}`} style={{ borderColor: 'currentColor' }} />
        );
    }
  };

  return (
    <div className={`flex items-center justify-center ${className}`} role="status" aria-live="polite">
      <span className="sr-only">Loading...</span>
      {renderLoader()}
    </div>
  );
};

export default Loader;