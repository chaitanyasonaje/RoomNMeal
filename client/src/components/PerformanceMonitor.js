import React, { useEffect, useState } from 'react';
import { reportWebVitals } from '../utils/performance';

const PerformanceMonitor = ({ onPerfEntry }) => {
  const [metrics, setMetrics] = useState({});

  useEffect(() => {
    if (onPerfEntry) {
      reportWebVitals(onPerfEntry);
    }

    // Monitor performance metrics
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        setMetrics(prev => ({
          ...prev,
          [entry.name]: entry.value
        }));
      });
    });

    observer.observe({ entryTypes: ['measure', 'navigation'] });

    return () => observer.disconnect();
  }, [onPerfEntry]);

  // Log performance metrics
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Performance Metrics:', metrics);
    }
  }, [metrics]);

  return null; // This component doesn't render anything
};

export default PerformanceMonitor;
