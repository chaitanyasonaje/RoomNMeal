import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { useCity } from '../context/CityContext';

const CitySelector = ({ isOpen, onClose, onCitySelect }) => {
  const { isDark } = useTheme();
  const { selectedCity, setSelectedCity } = useCity();
  const [searchQuery, setSearchQuery] = useState('');

  const cities = [
    { id: 1, name: 'Delhi', state: 'Delhi', country: 'India' },
    { id: 2, name: 'Mumbai', state: 'Maharashtra', country: 'India' },
    { id: 3, name: 'Bangalore', state: 'Karnataka', country: 'India' },
    { id: 4, name: 'Chennai', state: 'Tamil Nadu', country: 'India' },
    { id: 5, name: 'Kolkata', state: 'West Bengal', country: 'India' },
    { id: 6, name: 'Hyderabad', state: 'Telangana', country: 'India' },
    { id: 7, name: 'Pune', state: 'Maharashtra', country: 'India' },
    { id: 8, name: 'Ahmedabad', state: 'Gujarat', country: 'India' },
    { id: 9, name: 'Jaipur', state: 'Rajasthan', country: 'India' },
    { id: 10, name: 'Lucknow', state: 'Uttar Pradesh', country: 'India' },
    { id: 11, name: 'Chandigarh', state: 'Chandigarh', country: 'India' },
    { id: 12, name: 'Indore', state: 'Madhya Pradesh', country: 'India' },
  ];

  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    onCitySelect(city);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className={`w-full max-w-md rounded-2xl shadow-2xl ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className={`text-lg font-semibold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Select City
            </h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className={`p-2 rounded-lg ${
                isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              } transition-colors duration-200`}
            >
              <FaTimes className="h-5 w-5 text-gray-500" />
            </motion.button>
          </div>

          {/* Search */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search cities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
              />
            </div>
          </div>

          {/* Cities List */}
          <div className="max-h-80 overflow-y-auto">
            {filteredCities.length > 0 ? (
              <div className="p-2">
                {filteredCities.map((city, index) => (
                  <motion.button
                    key={city.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleCitySelect(city)}
                    className={`w-full text-left p-4 rounded-xl transition-colors duration-200 ${
                      selectedCity?.id === city.id
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                        : isDark
                        ? 'hover:bg-gray-700 text-gray-300'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <FaMapMarkerAlt className="h-4 w-4 text-primary-600 flex-shrink-0" />
                      <div>
                        <div className="font-medium">{city.name}</div>
                        <div className={`text-sm ${
                          isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {city.state}, {city.country}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center">
                <FaMapMarkerAlt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className={`text-lg ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  No cities found
                </p>
                <p className={`text-sm ${
                  isDark ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  Try searching with a different term
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CitySelector;
