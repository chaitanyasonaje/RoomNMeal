import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaClock, FaUsers, FaUtensils } from 'react-icons/fa';
import axios from 'axios';

const MessDetail = () => {
  const { id } = useParams();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessPlanDetails();
  }, [id]);

  const fetchMessPlanDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://roomnmeal.onrender.com/api/mess/plans/${id}`);
      setPlan(response.data.plan);
    } catch (error) {
      console.error('Error fetching mess plan details:', error);
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

  if (!plan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Mess plan not found</h2>
          <p className="text-gray-600">The mess plan you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-5xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Plan Images */}
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="h-64 sm:h-80 bg-gray-200 rounded-t-lg flex items-center justify-center">
                {plan.images && plan.images.length > 0 ? (
                  <img
                    src={plan.images[0]}
                    alt={plan.planName}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <FaUtensils className="h-16 w-16" />
                  </div>
                )}
              </div>
            </div>

            {/* Plan Details */}
            <div className="bg-white rounded-lg shadow p-5 mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{plan.planName}</h1>
              <p className="text-gray-600 mb-4">{plan.description}</p>
              <div className="flex items-center text-gray-500 mb-4">
                <FaMapMarkerAlt className="h-5 w-5 mr-2" />
                <span>{plan.provider?.messDetails?.messName || 'Mess Provider'}</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <FaClock className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600">Plan Type</p>
                  <p className="font-semibold text-sm">{plan.planType}</p>
                </div>
                <div className="text-center">
                  <FaUsers className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600">Capacity</p>
                  <p className="font-semibold text-sm">{plan.currentSubscribers}/{plan.capacity}</p>
                </div>
                <div className="text-center">
                  <FaUtensils className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600">Duration</p>
                  <p className="font-semibold text-sm">{plan.duration} days</p>
                </div>
                <div className="text-center">
                  <FaStar className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600">Hygiene</p>
                  <p className="font-semibold text-sm">{plan.hygieneRating}/5</p>
                </div>
              </div>
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`h-5 w-5 ${i < Math.floor(plan.ratings?.average || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
                <span className="text-gray-600 ml-2 text-sm">{plan.ratings?.average?.toFixed(1) || 0} ({plan.ratings?.count || 0} reviews)</span>
              </div>
            </div>

            {/* Menu */}
            <div className="bg-white rounded-lg shadow p-5 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Menu</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plan.menu && Object.keys(plan.menu).map((meal) => (
                  <div key={meal} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 capitalize text-sm">{meal}</h3>
                    <ul className="space-y-1">
                      {plan.menu[meal]?.map((item, index) => (
                        <li key={index} className="text-gray-600 text-xs">• {item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Meal Timings */}
            <div className="bg-white rounded-lg shadow p-5 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Meal Timings</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plan.mealTimings && Object.keys(plan.mealTimings).map((meal) => (
                  <div key={meal} className="text-center">
                    <h3 className="font-semibold text-gray-900 capitalize text-sm">{meal}</h3>
                    <p className="text-gray-600 text-xs">{plan.mealTimings[meal]}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-lg shadow p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Reviews</h2>
              {plan.reviews && plan.reviews.length > 0 ? (
                <div className="space-y-4">
                  {plan.reviews.slice(0, 3).map((review, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 ml-2">{new Date(review.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-700 text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No reviews yet</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-5 sticky top-8">
              <div className="text-center mb-6">
                <div className="text-2xl font-bold text-gray-900">₹{plan.price}</div>
                <div className="text-gray-600">per {plan.planType}</div>
              </div>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Duration</span>
                  <span className="font-semibold text-sm">{plan.duration} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Available Slots</span>
                  <span className="font-semibold text-sm">{plan.capacity - plan.currentSubscribers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Meal Types</span>
                  <span className="font-semibold text-sm">{plan.mealTypes?.length || 0}</span>
                </div>
              </div>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors mb-3">Subscribe Now</button>
              <button className="w-full btn-outline mb-3">Contact Provider</button>
              {/* Provider Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">Provider Information</h3>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-semibold">
                      {plan.provider?.name?.charAt(0)}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900 text-sm">{plan.provider?.name}</p>
                    <p className="text-xs text-gray-600">{plan.provider?.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessDetail; 