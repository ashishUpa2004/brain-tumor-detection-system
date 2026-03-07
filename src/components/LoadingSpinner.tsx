import React from 'react';
import type { LoadingSpinnerProps } from '../types';

/**
 * LoadingSpinner component displays an animated loading indicator
 * with optional message and size variants.
 * 
 * Requirements: 12.1
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  message 
}) => {
  // Size mappings for the spinner
  const sizeClasses = {
    small: 'w-6 h-6 border-2',
    medium: 'w-10 h-10 border-3',
    large: 'w-16 h-16 border-4'
  };

  // Text size mappings for the message
  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizeClasses[size]} border-blue-500 border-t-transparent rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      />
      {message && (
        <p className={`${textSizeClasses[size]} text-gray-600 dark:text-gray-300`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
