import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { 
  FaSearch, 
  FaFilter, 
  FaMapMarkerAlt, 
  FaBed, 
  FaUtensils, 
  FaWifi, 
  FaCar, 
  FaSwimmingPool, 
  FaDumbbell, 
  FaParking, 
  FaShieldAlt,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaStar,
  FaRupeeSign,
  FaCalendar
} from 'react-icons/fa';

const AdvancedSearch = ({ 
  onSearch, 
  searchType = 'rooms', 
  initialFilters = {},
  showFilters = true 
}) => {
  const { isDark } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    priceRange: { min: 0, max: 50000 },
    rating: 0,
    amenities: [],
    propertyType: '',
    availability: '',
    sortBy: 'relevance',
    ...initialFilters
  });

  const amenityOptions = [
    { id: 'wifi', label: 'WiFi', icon: FaWifi },
    { id: 'parking', label: 'Parking', icon: FaCar },
    { id: 'gym', label: 'Gym', icon: FaDumbbell },
    { id: 'pool', label: 'Swimming Pool', icon: FaSwimmingPool },
    { id: 'security', label: '24/7 Security', icon: FaShieldAlt },
    { id: 'ac', label: 'Air Conditioning' },
    { id: 'laundry', label: 'Laundry' },
    { id: 'kitchen', label: 'Kitchen' },
    { id: 'furnished', label: 'Furnished' },
    { id: 'balcony', label: 'Balcony' }
  ];

  const propertyTypeOptions = {
    rooms: [
      { value: '', label: 'All Types' },
      { value: 'single', label: 'Single Room' },
      { value: 'double', label: 'Double Room' },
      { value: 'triple', label: 'Triple Room' },
      { value: 'dormitory', label: 'Dormitory' }
    ],
    mess: [
      { value: '', label: 'All Types' },
      { value: 'vegetarian', label: 'Vegetarian' },
      { value: 'non-vegetarian', label: 'Non-Vegetarian' },
      { value: 'jain', label: 'Jain' },
      { value: 'south-indian', label: 'South Indian' }
    ],
    services: [
      { value: '', label: 'All Types' },
      { value: 'cleaning', label: 'Cleaning' },
      { value: 'laundry', label: 'Laundry' },
      { value: 'transport', label: 'Transport' },
      { value: 'maintenance', label: 'Maintenance' }
    ]
  };

  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest First' },
    { value: 'distance', label: 'Nearest First' }
  ];

  useEffect(() => {
    if (onSearch) {
      onSearch({ query: searchQuery, filters });
    }
  }, [searchQuery, filters, onSearch]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleAmenityToggle = (amenityId) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(id => id !== amenityId)
        : [...prev.amenities, amenityId]
    }));
  };

  const handlePriceRangeChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [type]: parseInt(value) || 0
      }
    }));
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      priceRange: { min: 0, max: 50000 },
      rating: 0,
      amenities: [],
      propertyType: '',
      availability: '',
      sortBy: 'relevance'
    });
    setSearchQuery('');
  };

  const hasActiveFilters = () => {
    return searchQuery || 
           filters.location || 
           filters.priceRange.min > 0 || 
           filters.priceRange.max < 50000 ||
           filters.rating > 0 ||
           filters.amenities.length > 0 ||
           filters.propertyType ||
           filters.availability ||
           filters.sortBy !== 'relevance';
  };

  return (
    <div className={`w-full ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg`}>
      {/* Search Bar */}
      <div className="p-6">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder={`Search ${searchType}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-12 pr-4 py-4 rounded-xl border-0 focus:ring-2 focus:ring-primary-500 text-lg ${
              isDark 
                ? 'bg-gray-700 text-white placeholder-gray-400' 
                : 'bg-gray-100 text-gray-900 placeholder-gray-500'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <FaTimes className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter Toggle */}
        {showFilters && (
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                isDark 
                  ? 'bg-gray-700 text-white hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FaFilter className="h-4 w-4" />
              <span>Filters</span>
              {isExpanded ? <FaChevronUp className="h-4 w-4" /> : <FaChevronDown className="h-4 w-4" />}
            </button>

            {hasActiveFilters() && (
              <button
                onClick={clearFilters}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Clear All
              </button>
            )}
          </div>
        )}
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {isExpanded && showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
          >
            <div className="p-6 space-y-6">
              {/* Location */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-white' : 'text-gray-700'
                }`}>
                  Location
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Enter city or area"
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border-0 focus:ring-2 focus:ring-primary-500 ${
                      isDark 
                        ? 'bg-gray-700 text-white placeholder-gray-400' 
                        : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-white' : 'text-gray-700'
                }`}>
                  Price Range (₹)
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.priceRange.min}
                      onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border-0 focus:ring-2 focus:ring-primary-500 ${
                        isDark 
                          ? 'bg-gray-700 text-white placeholder-gray-400' 
                          : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.priceRange.max}
                      onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border-0 focus:ring-2 focus:ring-primary-500 ${
                        isDark 
                          ? 'bg-gray-700 text-white placeholder-gray-400' 
                          : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Property Type */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-white' : 'text-gray-700'
                }`}>
                  Type
                </label>
                <select
                  value={filters.propertyType}
                  onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border-0 focus:ring-2 focus:ring-primary-500 ${
                    isDark 
                      ? 'bg-gray-700 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {propertyTypeOptions[searchType]?.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-white' : 'text-gray-700'
                }`}>
                  Minimum Rating
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => handleFilterChange('rating', star)}
                      className={`text-2xl transition-colors duration-200 ${
                        star <= filters.rating 
                          ? 'text-yellow-400' 
                          : isDark ? 'text-gray-600' : 'text-gray-300'
                      }`}
                    >
                      <FaStar />
                    </button>
                  ))}
                  {filters.rating > 0 && (
                    <button
                      onClick={() => handleFilterChange('rating', 0)}
                      className="ml-2 text-sm text-gray-500 hover:text-gray-700"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-white' : 'text-gray-700'
                }`}>
                  Amenities
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {amenityOptions.map(amenity => {
                    const Icon = amenity.icon;
                    return (
                      <button
                        key={amenity.id}
                        onClick={() => handleAmenityToggle(amenity.id)}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                          filters.amenities.includes(amenity.id)
                            ? 'bg-primary-100 text-primary-700 border border-primary-300'
                            : isDark
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {Icon && <Icon className="h-4 w-4" />}
                        <span>{amenity.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Availability */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-white' : 'text-gray-700'
                }`}>
                  Availability
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleFilterChange('availability', 'immediate')}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                      filters.availability === 'immediate'
                        ? 'bg-primary-100 text-primary-700 border border-primary-300'
                        : isDark
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Immediate
                  </button>
                  <button
                    onClick={() => handleFilterChange('availability', 'next_month')}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                      filters.availability === 'next_month'
                        ? 'bg-primary-100 text-primary-700 border border-primary-300'
                        : isDark
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Next Month
                  </button>
                </div>
              </div>

              {/* Sort By */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-white' : 'text-gray-700'
                }`}>
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border-0 focus:ring-2 focus:ring-primary-500 ${
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedSearch;
