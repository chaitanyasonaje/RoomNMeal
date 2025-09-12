import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFilter, FaSearch, FaMapMarkerAlt, FaSortAmountDown } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import RoomCard from './RoomCard';

const ListingGrid = ({ 
  items = [], 
  onItemClick = () => {},
  onBookItem = () => {},
  type = 'rooms' // 'rooms', 'meals', 'services'
}) => {
  const { isDark } = useTheme();
  const [filters, setFilters] = useState({
    location: '',
    priceRange: [0, 10000],
    category: '',
    sortBy: 'price'
  });
  const [showFilters, setShowFilters] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const filterVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: {
      height: 'auto',
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  };

  const getFilterOptions = () => {
    switch (type) {
      case 'rooms':
        return {
          categories: ['PG', 'Hostel', 'Apartment', 'House'],
          sortOptions: [
            { value: 'price', label: 'Price: Low to High' },
            { value: 'price-desc', label: 'Price: High to Low' },
            { value: 'rating', label: 'Rating' },
            { value: 'newest', label: 'Newest' }
          ]
        };
      case 'meals':
        return {
          categories: ['North Indian', 'South Indian', 'Gujarati', 'Punjabi', 'Jain'],
          sortOptions: [
            { value: 'price', label: 'Price: Low to High' },
            { value: 'rating', label: 'Rating' },
            { value: 'newest', label: 'Newest' }
          ]
        };
      case 'services':
        return {
          categories: ['Laundry', 'Cleaning', 'Food', 'Transport', 'Maintenance'],
          sortOptions: [
            { value: 'price', label: 'Price: Low to High' },
            { value: 'rating', label: 'Rating' },
            { value: 'newest', label: 'Newest' }
          ]
        };
      default:
        return { categories: [], sortOptions: [] };
    }
  };

  const { categories, sortOptions } = getFilterOptions();

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      priceRange: [0, 10000],
      category: '',
      sortBy: 'price'
    });
  };

  const filteredItems = items.filter(item => {
    if (filters.location && !item.location?.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    if (filters.category && item.category !== filters.category) {
      return false;
    }
    if (item.price < filters.priceRange[0] || item.price > filters.priceRange[1]) {
      return false;
    }
    return true;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (filters.sortBy) {
      case 'price':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'newest':
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      default:
        return 0;
    }
  });

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-heading font-bold mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {type === 'rooms' ? 'Find Your Perfect Room' : 
             type === 'meals' ? 'Discover Delicious Meals' : 
             'Explore Services'}
          </h1>
          <p className={`text-lg ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {filteredItems.length} {type} found
          </p>
        </div>

        {/* Filter Bar */}
        <div className={`mb-8 rounded-2xl ${
          isDark ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Search and Filter Toggle */}
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
                <div className="relative flex-1">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder={`Search ${type}...`}
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-primary-500 ${
                      isDark 
                        ? 'bg-gray-700 text-white placeholder-gray-400' 
                        : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    showFilters
                      ? 'bg-primary-600 text-white'
                      : isDark
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <FaFilter className="h-4 w-4" />
                  <span>Filters</span>
                </motion.button>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center space-x-2">
                <FaSortAmountDown className="h-4 w-4 text-gray-400" />
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className={`px-3 py-2 rounded-lg border-0 focus:ring-2 focus:ring-primary-500 ${
                    isDark 
                      ? 'bg-gray-700 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Expandable Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  variants={filterVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Category Filter */}
                    <div>
                      <label className={`block text-sm font-medium mb-3 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Category
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {categories.map(category => (
                          <button
                            key={category}
                            onClick={() => handleFilterChange('category', 
                              filters.category === category ? '' : category
                            )}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                              filters.category === category
                                ? 'bg-primary-600 text-white'
                                : isDark
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Price Range Filter */}
                    <div>
                      <label className={`block text-sm font-medium mb-3 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Price Range
                      </label>
                      <div className="space-y-2">
                        <input
                          type="range"
                          min="0"
                          max="20000"
                          step="500"
                          value={filters.priceRange[1]}
                          onChange={(e) => handleFilterChange('priceRange', [
                            filters.priceRange[0], 
                            parseInt(e.target.value)
                          ])}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>₹{filters.priceRange[0].toLocaleString()}</span>
                          <span>₹{filters.priceRange[1].toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Clear Filters */}
                    <div className="flex items-end">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={clearFilters}
                        className="w-full px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                      >
                        Clear All Filters
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Results Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {sortedItems.map((item, index) => (
            <RoomCard
              key={item.id || index}
              room={item}
              index={index}
              onBook={() => onBookItem(item)}
              onViewDetails={() => onItemClick(item)}
            />
          ))}
        </motion.div>

        {/* Empty State */}
        {sortedItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className={`text-6xl mb-4 ${
              isDark ? 'text-gray-600' : 'text-gray-300'
            }`}>
              {type === 'rooms' ? '🏠' : type === 'meals' ? '🍽️' : '🔧'}
            </div>
            <h3 className={`text-xl font-heading font-semibold mb-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              No {type} found
            </h3>
            <p className={`text-lg ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Try adjusting your filters or search terms
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ListingGrid;
