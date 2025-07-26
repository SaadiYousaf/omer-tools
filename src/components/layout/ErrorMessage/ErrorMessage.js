// src/components/ui/ErrorMessage/ErrorMessage.js
import React from 'react';
import { FiAlertCircle, FiRefreshCw } from 'react-icons/fi';
import './ErrorMessage.css';

const ErrorMessage = ({
  message,
  onRetry,
  retryText = 'Retry',
  className = '',
  iconSize = 'md'
}) => {
  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={`error-message ${className}`} role="alert">
      <div className="error-content">
        <FiAlertCircle className={`error-icon ${iconSizes[iconSize]}`} />
        <span className="error-text">{message}</span>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="retry-button"
          aria-label="Retry"
        >
          <FiRefreshCw className="retry-icon" />
          <span>{retryText}</span>
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;