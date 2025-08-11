import React from 'react';
import { FaExclamationTriangle, FaHome, FaRedo, FaBug } from 'react-icons/fa';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }

    // You can also log the error to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 flex items-center justify-center p-4">
          <div className="max-w-2xl mx-auto text-center">
            {/* Error Icon */}
            <div className="mb-8">
              <div className="bg-red-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaExclamationTriangle className="h-12 w-12 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Oops! Something went wrong
              </h1>
              <p className="text-lg text-gray-600">
                We're sorry, but something unexpected happened. Our team has been notified.
              </p>
            </div>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-white rounded-2xl shadow-soft p-6 mb-8 text-left">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <FaBug className="h-5 w-5 text-red-500 mr-2" />
                  Error Details (Development)
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm overflow-auto">
                  <div className="text-red-600 mb-2">
                    <strong>Error:</strong> {this.state.error.toString()}
                  </div>
                  {this.state.errorInfo && (
                    <div className="text-gray-700">
                      <strong>Stack Trace:</strong>
                      <pre className="mt-2 text-xs overflow-auto">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={this.handleReload}
                className="btn-primary flex items-center justify-center gap-2"
              >
                <FaRedo className="h-4 w-4" />
                <span>Try Again</span>
              </button>
              <button
                onClick={this.handleGoHome}
                className="btn-secondary flex items-center justify-center gap-2"
              >
                <FaHome className="h-4 w-4" />
                <span>Go Home</span>
              </button>
            </div>

            {/* Help Text */}
            <div className="mt-8 text-sm text-gray-500">
              <p className="mb-2">
                If this problem persists, please contact our support team.
              </p>
              <p>
                Error ID: {this.state.error?.message?.substring(0, 8) || 'UNKNOWN'}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Functional Error Component for use in components
export const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <div className="bg-red-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaExclamationTriangle className="h-12 w-12 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Something went wrong
          </h1>
          <p className="text-lg text-gray-600">
            An error occurred while loading this content.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={resetErrorBoundary}
            className="btn-primary flex items-center justify-center gap-2"
          >
            <FaRedo className="h-4 w-4" />
            <span>Try Again</span>
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <FaHome className="h-4 w-4" />
            <span>Go Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Simple Error Message Component
export const ErrorMessage = ({ 
  title = 'Error', 
  message = 'Something went wrong', 
  onRetry, 
  className = '' 
}) => {
  return (
    <div className={`bg-red-50 border border-red-200 rounded-2xl p-6 text-center ${className}`}>
      <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
        <FaExclamationTriangle className="h-8 w-8 text-red-600" />
      </div>
      <h3 className="text-lg font-semibold text-red-900 mb-2">{title}</h3>
      <p className="text-red-700 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-primary"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorBoundary;
