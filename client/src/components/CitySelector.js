import React, { useState, useEffect } from 'react';
import { useCity } from '../context/CityContext';
import { FaSearch, FaMapMarkerAlt, FaTimes, FaLocationArrow, FaStar } from 'react-icons/fa';

const CitySelector = ({ isOpen, onClose, onCitySelect }) => {
  const { 
    cities, 
    popularCities, 
    states, 
    loading, 
    searchCities, 
    getCitiesByState,
    autoSelectCity 
  } = useCity();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [filteredCities, setFilteredCities] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (selectedState) {
      handleStateFilter();
    } else {
      setFilteredCities([]);
    }
  }, [selectedState]);

  const handleSearch = async () => {
    if (searchQuery.trim().length < 2) return;
    
    setIsSearching(true);
    try {
      const results = await searchCities(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleStateFilter = async () => {
    try {
      const results = await getCitiesByState(selectedState);
      setFilteredCities(results);
    } catch (error) {
      console.error('State filter error:', error);
    }
  };

  const handleCitySelect = (city) => {
    onCitySelect(city);
    onClose();
    setSearchQuery('');
    setSearchResults([]);
    setSelectedState('');
    setFilteredCities([]);
  };

  const handleAutoLocation = async () => {
    try {
      const city = await autoSelectCity();
      if (city) {
        handleCitySelect(city);
      }
    } catch (error) {
      console.error('Auto location error:', error);
    }
  };

  const getTierBadge = (tier) => {
    const tierColors = {
      1: 'bg-primary-100 text-primary-800',
      2: 'bg-success-100 text-success-800',
      3: 'bg-warning-100 text-warning-800'
    };
    
    const tierLabels = {
      1: 'Tier 1',
      2: 'Tier 2', 
      3: 'Tier 3'
    };

    return (
      <span className={`badge ${tierColors[tier]} text-xs font-medium px-2 py-1 rounded-full`}>
        {tierLabels[tier]}
      </span>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Select Your City</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <FaTimes className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search cities, colleges, or companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Auto Location Button */}
          <button
            onClick={handleAutoLocation}
            className="mt-3 w-full flex items-center justify-center gap-2 py-2 px-4 bg-primary-50 text-primary-700 rounded-xl hover:bg-primary-100 transition-colors duration-200 text-sm font-medium"
          >
            <FaLocationArrow className="h-4 w-4" />
            Use My Location
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[60vh] p-4">
          {/* Search Results */}
          {searchQuery && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FaSearch className="h-4 w-4" />
                Search Results
                {isSearching && <div className="animate-spin h-4 w-4 border-2 border-primary-500 border-t-transparent rounded-full"></div>}
              </h3>
              {searchResults.length > 0 ? (
                <div className="space-y-2">
                  {searchResults.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => handleCitySelect(city)}
                      className="w-full text-left p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200 border border-gray-100"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{city.name}</div>
                          <div className="text-sm text-gray-500">{city.state}</div>
                        </div>
                        {getTierBadge(city.tier)}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {city.collegesCount} colleges • {city.techCompaniesCount} companies
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {isSearching ? 'Searching...' : 'No cities found'}
                </div>
              )}
            </div>
          )}

          {/* State Filter */}
          {!searchQuery && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Filter by State</h3>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">All States</option>
                {states.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
          )}

          {/* Filtered Cities by State */}
          {selectedState && filteredCities.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Cities in {selectedState}</h3>
              <div className="space-y-2">
                {filteredCities.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => handleCitySelect(city)}
                    className="w-full text-left p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200 border border-gray-100"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{city.name}</div>
                        <div className="text-sm text-gray-500">{city.description}</div>
                      </div>
                      {getTierBadge(city.tier)}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Cities */}
          {!searchQuery && !selectedState && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FaStar className="h-4 w-4 text-yellow-500" />
                Popular Cities
              </h3>
              <div className="space-y-2">
                {popularCities.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => handleCitySelect(city)}
                    className="w-full text-left p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200 border border-gray-100"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{city.name}</div>
                        <div className="text-sm text-gray-500">{city.state}</div>
                      </div>
                      {getTierBadge(city.tier)}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {city.collegesCount} colleges • {city.techCompaniesCount} companies
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* All Cities (if no search, no state filter, and not too many popular cities) */}
          {!searchQuery && !selectedState && popularCities.length < 5 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FaMapMarkerAlt className="h-4 w-4 text-primary-500" />
                All Cities
              </h3>
              <div className="space-y-2">
                {cities.slice(0, 10).map((city) => (
                  <button
                    key={city.id}
                    onClick={() => handleCitySelect(city)}
                    className="w-full text-left p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200 border border-gray-100"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{city.name}</div>
                        <div className="text-sm text-gray-500">{city.state}</div>
                      </div>
                      {getTierBadge(city.tier)}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {city.collegesCount} colleges • {city.techCompaniesCount} companies
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="p-4 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading cities...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CitySelector;
