import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CityContext = createContext();

export const useCity = () => {
  const context = useContext(CityContext);
  if (!context) {
    throw new Error('useCity must be used within a CityProvider');
  }
  return context;
};

export const CityProvider = ({ children }) => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [cities, setCities] = useState([]);
  const [popularCities, setPopularCities] = useState([]);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load cities on component mount
  useEffect(() => {
    loadCities();
    loadStates();
    loadPopularCities();
    
    // Load previously selected city from localStorage
    const savedCity = localStorage.getItem('selectedCity');
    if (savedCity) {
      try {
        setSelectedCity(JSON.parse(savedCity));
      } catch (error) {
        console.error('Error parsing saved city:', error);
      }
    }
  }, []);

  // Save selected city to localStorage
  useEffect(() => {
    if (selectedCity) {
      localStorage.setItem('selectedCity', JSON.stringify(selectedCity));
    }
  }, [selectedCity]);

  const loadCities = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/cities');
      setCities(response.data.cities);
    } catch (error) {
      console.error('Error loading cities:', error);
      setError('Failed to load cities');
    } finally {
      setLoading(false);
    }
  };

  const loadPopularCities = async () => {
    try {
      const response = await axios.get('/api/cities?popular=true');
      setPopularCities(response.data.cities);
    } catch (error) {
      console.error('Error loading popular cities:', error);
    }
  };

  const loadStates = async () => {
    try {
      const response = await axios.get('/api/cities/states/list');
      setStates(response.data.states);
    } catch (error) {
      console.error('Error loading states:', error);
    }
  };

  const searchCities = async (query) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/cities?search=${encodeURIComponent(query)}`);
      return response.data.cities;
    } catch (error) {
      console.error('Error searching cities:', error);
      setError('Failed to search cities');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getCitiesByState = async (state) => {
    try {
      const response = await axios.get(`/api/cities/state/${encodeURIComponent(state)}`);
      return response.data.cities;
    } catch (error) {
      console.error('Error getting cities by state:', error);
      return [];
    }
  };

  const getCityDetails = async (cityId) => {
    try {
      const response = await axios.get(`/api/cities/${cityId}`);
      return response.data.city;
    } catch (error) {
      console.error('Error getting city details:', error);
      return null;
    }
  };

  const selectCity = (city) => {
    setSelectedCity(city);
  };

  const clearSelectedCity = () => {
    setSelectedCity(null);
    localStorage.removeItem('selectedCity');
  };

  const getNearbyCities = async (latitude, longitude, radius = 100) => {
    try {
      const response = await axios.get(`/api/cities?nearby=true&lat=${latitude}&lng=${longitude}&radius=${radius}`);
      return response.data.cities;
    } catch (error) {
      console.error('Error getting nearby cities:', error);
      return [];
    }
  };

  const detectUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          reject(error);
        }
      );
    });
  };

  const autoSelectCity = async () => {
    try {
      const location = await detectUserLocation();
      const nearbyCities = await getNearbyCities(location.latitude, location.longitude, 50);
      
      if (nearbyCities.length > 0) {
        // Select the closest city (first in the array)
        selectCity(nearbyCities[0]);
        return nearbyCities[0];
      }
    } catch (error) {
      console.error('Error auto-selecting city:', error);
    }
    return null;
  };

  const value = {
    selectedCity,
    cities,
    popularCities,
    states,
    loading,
    error,
    selectCity,
    clearSelectedCity,
    searchCities,
    getCitiesByState,
    getCityDetails,
    getNearbyCities,
    detectUserLocation,
    autoSelectCity,
    loadCities
  };

  return (
    <CityContext.Provider value={value}>
      {children}
    </CityContext.Provider>
  );
};
