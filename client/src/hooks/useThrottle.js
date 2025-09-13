import { useRef, useCallback } from 'react';

const useThrottle = (callback, delay) => {
  const throttleRef = useRef(null);
  const lastExecuted = useRef(Date.now());

  return useCallback((...args) => {
    const now = Date.now();
    
    if (now - lastExecuted.current >= delay) {
      callback(...args);
      lastExecuted.current = now;
    } else {
      if (throttleRef.current) {
        clearTimeout(throttleRef.current);
      }
      
      throttleRef.current = setTimeout(() => {
        callback(...args);
        lastExecuted.current = Date.now();
      }, delay - (now - lastExecuted.current));
    }
  }, [callback, delay]);
};

export default useThrottle;
