import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const LoadingSpinner = ({ 
  size = 'md', 
  text = 'Loading...', 
  variant = 'primary',
  showText = true,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const variantClasses = {
    primary: 'text-primary-600',
    secondary: 'text-gray-600',
    white: 'text-white',
    success: 'text-success-600',
    warning: 'text-warning-600',
    accent: 'text-accent-600'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative">
        {/* Main Spinner */}
        <FaSpinner 
          className={`${sizeClasses[size]} ${variantClasses[variant]} animate-spin`}
        />
        
        {/* Pulsing Ring Effect */}
        <div className={`absolute inset-0 ${sizeClasses[size]} rounded-full border-2 border-current opacity-20 animate-ping`}></div>
        
        {/* Outer Ring */}
        <div className={`absolute inset-0 ${sizeClasses[size]} rounded-full border-2 border-current opacity-10 animate-pulse`}></div>
      </div>
      
      {showText && (
        <p className={`mt-3 text-sm font-medium ${variant === 'white' ? 'text-white' : 'text-gray-600'}`}>
          {text}
        </p>
      )}
    </div>
  );
};

// Page Loading Component
export const PageLoading = ({ text = 'Loading amazing content...' }) => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 flex items-center justify-center">
    <div className="text-center">
      <LoadingSpinner size="xl" text={text} variant="primary" />
      <div className="mt-6">
        <div className="flex space-x-1 justify-center">
          <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
          <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
          <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
        </div>
      </div>
    </div>
  </div>
);

// Card Loading Component
export const CardLoading = ({ count = 1, className = '' }) => (
  <div className={className}>
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="card animate-pulse">
        <div className="skeleton-card mb-4"></div>
        <div className="space-y-3">
          <div className="skeleton-text w-3/4"></div>
          <div className="skeleton-text w-full"></div>
          <div className="skeleton-text w-2/3"></div>
          <div className="flex space-x-2">
            <div className="skeleton-text w-16 h-6"></div>
            <div className="skeleton-text w-20 h-6"></div>
          </div>
          <div className="skeleton-text w-full h-10 rounded-xl"></div>
        </div>
      </div>
    ))}
  </div>
);

// Button Loading Component
export const ButtonLoading = ({ size = 'md', variant = 'primary', className = '' }) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const variantClasses = {
    primary: 'bg-primary-600 text-white',
    secondary: 'bg-gray-200 text-gray-800',
    outline: 'border-2 border-primary-600 text-primary-600'
  };

  return (
    <button 
      disabled 
      className={`${sizeClasses[size]} ${variantClasses[variant]} rounded-xl font-semibold flex items-center justify-center space-x-2 opacity-75 cursor-not-allowed ${className}`}
    >
      <LoadingSpinner size="sm" variant="white" showText={false} />
      <span>Loading...</span>
    </button>
  );
};

// Table Loading Component
export const TableLoading = ({ rows = 5, columns = 4 }) => (
  <div className="overflow-hidden">
    <div className="animate-pulse">
      {/* Header */}
      <div className="bg-gray-100 p-4 rounded-t-lg">
        <div className="flex space-x-4">
          {Array.from({ length: columns }).map((_, index) => (
            <div key={index} className="skeleton-text w-24 h-4"></div>
          ))}
        </div>
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="border-b border-gray-200 p-4">
          <div className="flex space-x-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div key={colIndex} className="skeleton-text w-20 h-4"></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default LoadingSpinner;
