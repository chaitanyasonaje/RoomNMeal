import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCity } from '../context/CityContext';
import { FaUtensils, FaStar, FaMapMarkerAlt, FaClock, FaUsers, FaFilter, FaTimes } from 'react-icons/fa';
import { getMockData } from '../data/mockData';

const MessPlans = () => {
  const { selectedCity } = useCity();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    planType: '',
    cuisine: '',
    dietaryOptions: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchMessPlans();
  }, [selectedCity, filters]);

  const fetchMessPlans = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      let filteredPlans = getMockData.messPlans() || [];
      // Apply city filter
      if (selectedCity) {
        filteredPlans = getMockData.getMessByCity(selectedCity.name) || [];
      }
      // Apply other filters
      if (filters.minPrice) {
        filteredPlans = filteredPlans.filter(plan => 
          plan.mealPlans.some(meal => meal.price >= parseInt(filters.minPrice))
        );
      }
      if (filters.maxPrice) {
        filteredPlans = filteredPlans.filter(plan => 
          plan.mealPlans.some(meal => meal.price <= parseInt(filters.maxPrice))
        );
      }
      if (filters.cuisine) {
        filteredPlans = filteredPlans.filter(plan => 
          plan.cuisine.includes(filters.cuisine)
        );
      }
      setPlans(filteredPlans);
    } catch (error) {
      console.error('Error fetching mess plans:', error);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-5xl mx-auto px-2 sm:px-4 lg:px-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
            Mess Services
            {selectedCity && (
              <span className="block text-primary-600 text-lg mt-1">
                in {selectedCity.name}
              </span>
            )}
          </h1>
          <p className="text-gray-600 text-base">
            Subscribe to quality meal plans from verified providers
            {selectedCity && (
              <span className="block mt-1 text-sm text-primary-600">
                {selectedCity.collegesCount}+ colleges • {selectedCity.techCompaniesCount}+ companies
              </span>
            )}
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="md:hidden mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full btn-secondary flex items-center justify-center gap-2"
          >
            <FaFilter />
            <span>{showFilters ? 'Hide' : 'Show'} Filters</span>
          </button>
        </div>
        {/* Mess Plans Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {plans.map((plan) => (
            <div key={plan._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow flex flex-col">
              {/* Plan Image */}
              <div className="h-44 bg-gray-200 relative">
                {plan.images && plan.images.length > 0 ? (
                  <img
                    src={plan.images[0]}
                    alt={plan.planName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <FaUtensils className="h-12 w-12" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">₹{plan.price}/month</span>
                </div>
              </div>
              {/* Plan Details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{plan.planName}</h3>
                <p className="text-gray-600 text-sm mb-2">{plan.description?.substring(0, 100)}...</p>
                <div className="flex items-center text-gray-500 text-xs mb-2">
                  <FaMapMarkerAlt className="h-4 w-4 mr-1" />
                  <span>{plan.provider?.messDetails?.messName || 'Mess Provider'}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                  <div className="flex items-center"><FaClock className="h-4 w-4 mr-1" />{plan.planType}</div>
                  <div className="flex items-center"><FaUsers className="h-4 w-4 mr-1" />{plan.currentSubscribers}/{plan.capacity}</div>
                </div>
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(plan.ratings?.average || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                  <span className="text-xs text-gray-600 ml-2">({plan.ratings?.count || 0} reviews)</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {plan.mealTypes?.map((meal, index) => (
                    <span key={index} className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs">{meal}</span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {plan.cuisine?.slice(0, 2).map((cuisine, index) => (
                    <span key={index} className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs">{cuisine}</span>
                  ))}
                </div>
                <Link to={`/mess/${plan._id}`} className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-center mt-2">View Details</Link>
              </div>
            </div>
          ))}
        </div>
        {plans.length === 0 && (
          <div className="text-center py-12">
            <FaUtensils className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No mess plans available</h3>
            <p className="text-gray-600">Check back later for new mess plans</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessPlans; 