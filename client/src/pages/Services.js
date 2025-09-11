import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaFilter, FaStar, FaMapMarkerAlt, FaClock, FaUser, FaPlus } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { buildApiUrl } from '../config/api';
import toast from 'react-hot-toast';

const Services = () => {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    priceMin: '',
    priceMax: '',
    rating: '',
    isAvailable: ''
  });
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalServices: 0
  });
  const [availableFilters, setAvailableFilters] = useState({
    categories: [],
    types: []
  });

  useEffect(() => {
    fetchServices();
    fetchAvailableFilters();
  }, [filters, sortBy, sortOrder, pagination.currentPage]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.currentPage,
        limit: 12,
        sortBy,
        sortOrder,
        ...filters
      });

      const response = await axios.get(buildApiUrl(`/api/services?${params}`));
      
      setServices(response.data.services);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableFilters = async () => {
    try {
      const response = await axios.get(buildApiUrl('/api/services'));
      setAvailableFilters(response.data.filters);
    } catch (error) {
      console.error('Error fetching filters:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleSortChange = (key) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('desc');
    }
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      category: '',
      priceMin: '',
      priceMax: '',
      rating: '',
      isAvailable: ''
    });
    setSortBy('createdAt');
    setSortOrder('desc');
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getServiceTypeIcon = (type) => {
    const icons = {
      laundry: '🧺',
      cleaning: '🧹',
      food: '🍽️',
      transport: '🚗',
      maintenance: '🔧',
      other: '📦'
    };
    return icons[type] || '📦';
  };

  const getServiceTypeColor = (type) => {
    const colors = {
      laundry: 'bg-blue-100 text-blue-800',
      cleaning: 'bg-green-100 text-green-800',
      food: 'bg-orange-100 text-orange-800',
      transport: 'bg-purple-100 text-purple-800',
      maintenance: 'bg-red-100 text-red-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (loading && services.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Services</h1>
              <p className="text-gray-600 mt-2">
                Discover and book quality services from verified providers
              </p>
            </div>
            {user && ['host', 'messProvider', 'admin'].includes(user.role) && (
              <Link
                to="/services/add"
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                <FaPlus className="h-4 w-4 mr-2" />
                Add Service
              </Link>
            )}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {/* Service Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Types</option>
                {availableFilters.types.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Categories</option>
                {availableFilters.categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
              <input
                type="number"
                placeholder="₹0"
                value={filters.priceMin}
                onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
              <input
                type="number"
                placeholder="₹∞"
                value={filters.priceMax}
                onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Rating</label>
              <select
                value={filters.rating}
                onChange={(e) => handleFilterChange('rating', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Any Rating</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="2">2+ Stars</option>
                <option value="1">1+ Star</option>
              </select>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
              <select
                value={filters.isAvailable}
                onChange={(e) => handleFilterChange('isAvailable', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Services</option>
                <option value="true">Available Now</option>
              </select>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Clear all filters
            </button>
            <div className="text-sm text-gray-500">
              {pagination.totalServices} services found
            </div>
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            {[
              { key: 'createdAt', label: 'Latest' },
              { key: 'rating', label: 'Rating' },
              { key: 'price', label: 'Price' },
              { key: 'popularity', label: 'Popularity' }
            ].map(option => (
              <button
                key={option.key}
                onClick={() => handleSortChange(option.key)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  sortBy === option.key
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {option.label}
                {sortBy === option.key && (
                  <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.isArray(services) && services.map((service) => {
            if (!service || !service._id) return null;
            return (
            <div key={service._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Service Image */}
              <div className="relative h-48 bg-gray-200">
                {service.images && service.images.length > 0 ? (
                  <img
                    src={service.images[0]}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    {getServiceTypeIcon(service.type)}
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getServiceTypeColor(service.type)}`}>
                    {service.type.charAt(0).toUpperCase() + service.type.slice(1)}
                  </span>
                </div>
                {service.isFeatured && (
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Featured
                    </span>
                  </div>
                )}
              </div>

              {/* Service Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                    {service.name}
                  </h3>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary-600">₹{service.price}</div>
                    <div className="text-xs text-gray-500">{service.priceType}</div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {service.description}
                </p>

                {/* Provider Info */}
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                    {service.provider?.profileImage ? (
                      <img
                        src={service.provider.profileImage}
                        alt={service.provider.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <FaUser className="h-3 w-3 text-primary-600" />
                    )}
                  </div>
                  <span className="text-sm text-gray-700">{service.provider?.name}</span>
                  {service.provider?.isVerified && (
                    <span className="text-xs text-green-600">✓ Verified</span>
                  )}
                </div>

                {/* Rating and Location */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-1">
                    {renderStars(service.rating.average)}
                    <span className="text-sm text-gray-600 ml-1">
                      ({service.rating.totalReviews})
                    </span>
                  </div>
                  {service.location?.city && (
                    <div className="flex items-center text-sm text-gray-500">
                      <FaMapMarkerAlt className="h-3 w-3 mr-1" />
                      {service.location.city}
                    </div>
                  )}
                </div>

                {/* Service Details */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <FaClock className="h-3 w-3 mr-1" />
                    {service.duration}
                  </div>
                  {service.availability?.isAvailable && (
                    <span className="text-green-600 font-medium">Available Now</span>
                  )}
                </div>

                {/* Action Button */}
                <Link
                  to={`/services/${service._id}`}
                  className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors text-center block"
                >
                  View Details
                </Link>
              </div>
            </div>
            );
          })}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center mt-8">
            <div className="flex space-x-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                disabled={pagination.currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: page }))}
                  className={`px-3 py-2 border rounded-md text-sm font-medium ${
                    page === pagination.currentPage
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && services.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters or search criteria
            </p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
