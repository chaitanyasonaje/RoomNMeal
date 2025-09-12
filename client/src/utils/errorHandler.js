// Error handling utilities for better debugging and user experience

export const safeAsync = async (asyncFn, fallbackValue = null) => {
  try {
    return await asyncFn();
  } catch (error) {
    console.error('Safe async error:', error);
    return fallbackValue;
  }
};

export const safeSync = (syncFn, fallbackValue = null) => {
  try {
    return syncFn();
  } catch (error) {
    console.error('Safe sync error:', error);
    return fallbackValue;
  }
};

export const safeArray = (value) => {
  return Array.isArray(value) ? value : [];
};

export const safeObject = (value) => {
  return value && typeof value === 'object' ? value : {};
};

export const safeString = (value) => {
  return typeof value === 'string' ? value : '';
};

export const safeNumber = (value) => {
  const num = Number(value);
  return !isNaN(num) ? num : 0;
};

// Enhanced error logging
export const logError = (error, context = '') => {
  const errorInfo = {
    message: error?.message || 'Unknown error',
    stack: error?.stack || 'No stack trace',
    context,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href
  };
  
  console.error('Application Error:', errorInfo);
  
  // In production, you might want to send this to an error tracking service
  if (process.env.NODE_ENV === 'production') {
    // Example: send to error tracking service
    // errorTrackingService.captureException(error, errorInfo);
  }
};

// Retry mechanism for failed operations
export const retry = async (fn, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
};

// Safe data access with fallbacks
export const safeAccess = (obj, path, fallback = null) => {
  try {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : fallback;
    }, obj);
  } catch (error) {
    console.error('Safe access error:', error);
    return fallback;
  }
};
