import { useState, useEffect, useCallback } from 'react';
import { apiCache } from '../utils/performance';

const useApi = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refetch, setRefetch] = useState(0);

  const {
    method = 'GET',
    body = null,
    headers = {},
    cache = true,
    cacheTime = 300000, // 5 minutes
    ...fetchOptions
  } = options;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      if (cache && method === 'GET') {
        const cachedData = apiCache.get(url);
        if (cachedData) {
          setData(cachedData);
          setLoading(false);
          return;
        }
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: body ? JSON.stringify(body) : null,
        ...fetchOptions
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);

      // Cache the result
      if (cache && method === 'GET') {
        apiCache.set(url, result);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [url, method, body, headers, cache, ...Object.values(fetchOptions)]);

  useEffect(() => {
    fetchData();
  }, [fetchData, refetch]);

  const refetchData = useCallback(() => {
    setRefetch(prev => prev + 1);
  }, []);

  const clearCache = useCallback(() => {
    if (cache) {
      apiCache.remove(url);
    }
  }, [url, cache]);

  return {
    data,
    loading,
    error,
    refetch: refetchData,
    clearCache
  };
};

export default useApi;
