import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaMapMarkerAlt, FaClock, FaUsers, FaUtensils, FaArrowLeft } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import { buildApiUrl } from '../config/api';

const MessDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessPlanDetails();
  }, [id]);

  // Auto-refresh rating on review submit without full reload
  useEffect(() => {
    const handler = (e) => {
      if (e.detail?.targetModel === 'MessPlan' && e.detail?.targetId === id) {
        fetchMessPlanDetails();
      }
    };
    window.addEventListener('ratings:updated', handler);
    return () => window.removeEventListener('ratings:updated', handler);
  }, [id]);

  const fetchMessPlanDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(buildApiUrl(`/api/mess/plans/${id}`));
      setPlan(response.data.plan);
    } catch (error) {
      console.error('Error fetching mess plan details:', error);
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
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

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Loading mess plan details...</p>
        </motion.div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
            isDark ? 'bg-gray-800' : 'bg-gray-100'
          }`}>
            <FaUtensils className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Mess plan not found
          </h2>
          <p className={`text-lg mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            The mess plan you're looking for doesn't exist.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/mess')}
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
          >
            <FaArrowLeft className="h-4 w-4 mr-2" />
            Back to Mess Plans
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-6 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/mess')}
            className={`inline-flex items-center px-4 py-2 rounded-xl font-medium transition-colors ${
              isDark 
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } shadow-sm`}
          >
            <FaArrowLeft className="h-4 w-4 mr-2" />
            Back to Mess Plans
          </motion.button>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Plan Images */}
            <motion.div
              variants={cardVariants}
              className={`rounded-2xl shadow-lg mb-6 overflow-hidden ${
                isDark ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <div className="h-64 sm:h-80 bg-gray-200 flex items-center justify-center">
                {plan.images && plan.images.length > 0 ? (
                  <img
                    src={plan.images[0]}
                    alt={plan.planName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <FaUtensils className="h-16 w-16" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </motion.div>

            {/* Plan Details */}
            <motion.div
              variants={cardVariants}
              className={`rounded-2xl shadow-lg p-6 mb-6 ${
                isDark ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
                <div className="flex-1">
                  <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {plan.planName}
                  </h1>
                  <div className="flex items-center text-gray-500 mb-4">
                    <FaMapMarkerAlt className="h-5 w-5 mr-2 text-primary-600" />
                    <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {plan.provider?.messDetails?.messName || 'Mess Provider'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary-600">₹{plan.price}</div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>per {plan.planType}</div>
                </div>
              </div>
              
              <p className={`text-lg mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {plan.description}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-700 dark:to-gray-600"
                >
                  <FaClock className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <p className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-1`}>Plan Type</p>
                  <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{plan.planType}</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600"
                >
                  <FaUsers className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <p className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-1`}>Capacity</p>
                  <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{plan.currentSubscribers}/{plan.capacity}</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-700 dark:to-gray-600"
                >
                  <FaUtensils className="h-8 w-8 text-orange-600 mx-auto mb-3" />
                  <p className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-1`}>Duration</p>
                  <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{plan.duration} days</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-700 dark:to-gray-600"
                >
                  <FaStar className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                  <p className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-1`}>Hygiene</p>
                  <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{plan.hygieneRating}/5</p>
                </motion.div>
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-gray-700 dark:to-gray-600">
                <div className="flex items-center">
                  <div className="flex items-center mr-4">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`h-5 w-5 ${i < Math.floor(plan.ratings?.average || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {plan.ratings?.average?.toFixed(1) || 0} ({plan.ratings?.count || 0} reviews)
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Menu */}
            <motion.div
              variants={cardVariants}
              className={`rounded-2xl shadow-lg p-6 mb-6 ${
                isDark ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <h2 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Menu
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plan.menu && Object.keys(plan.menu).map((meal) => (
                  <motion.div
                    key={meal}
                    whileHover={{ scale: 1.02 }}
                    className={`border rounded-xl p-4 ${
                      isDark ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <h3 className={`font-bold mb-3 capitalize text-sm ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {meal}
                    </h3>
                    <ul className="space-y-2">
                      {plan.menu[meal]?.map((item, index) => (
                        <li key={index} className={`text-xs flex items-start ${
                          isDark ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          <span className="w-2 h-2 bg-primary-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Meal Timings */}
            <motion.div
              variants={cardVariants}
              className={`rounded-2xl shadow-lg p-6 mb-6 ${
                isDark ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <h2 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Meal Timings
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plan.mealTimings && Object.keys(plan.mealTimings).map((meal) => (
                  <motion.div
                    key={meal}
                    whileHover={{ scale: 1.05 }}
                    className={`text-center p-4 rounded-xl ${
                      isDark ? 'bg-gray-700' : 'bg-gray-50'
                    }`}
                  >
                    <h3 className={`font-bold capitalize text-sm mb-2 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {meal}
                    </h3>
                    <p className={`text-sm font-medium ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {plan.mealTimings[meal]}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Reviews */}
            <motion.div
              variants={cardVariants}
              className={`rounded-2xl shadow-lg p-6 ${
                isDark ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <h2 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Reviews
              </h2>
              {plan.reviews && plan.reviews.length > 0 ? (
                <div className="space-y-6">
                  {plan.reviews.slice(0, 3).map((review, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-xl ${
                        isDark ? 'bg-gray-700' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className={`text-sm ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                        {review.comment}
                      </p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FaStar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>No reviews yet</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              variants={cardVariants}
              className={`rounded-2xl shadow-lg p-6 sticky top-8 ${
                isDark ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <div className="text-center mb-8">
                <div className={`text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  ₹{plan.price}
                </div>
                <div className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>per {plan.planType}</div>
              </div>
              
              <div className="space-y-4 mb-8">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`flex justify-between items-center p-3 rounded-xl ${
                    isDark ? 'bg-gray-700' : 'bg-gray-50'
                  }`}
                >
                  <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Duration
                  </span>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {plan.duration} days
                  </span>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`flex justify-between items-center p-3 rounded-xl ${
                    isDark ? 'bg-gray-700' : 'bg-gray-50'
                  }`}
                >
                  <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Available Slots
                  </span>
                  <span className={`font-bold ${
                    (plan.capacity - plan.currentSubscribers) > 0 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {plan.capacity - plan.currentSubscribers}
                  </span>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`flex justify-between items-center p-3 rounded-xl ${
                    isDark ? 'bg-gray-700' : 'bg-gray-50'
                  }`}
                >
                  <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Meal Types
                  </span>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {plan.mealTypes?.length || 0}
                  </span>
                </motion.div>
              </div>
              
              <div className="space-y-4 mb-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 px-6 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold text-lg rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Subscribe Now
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg border-2 transition-all duration-200 ${
                    isDark
                      ? 'border-gray-600 text-gray-300 hover:border-gray-500 hover:bg-gray-700'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  Contact Provider
                </motion.button>
              </div>
              
              <div className={`pt-6 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Provider Information
                </h3>
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isDark ? 'bg-green-600' : 'bg-green-100'
                  }`}>
                    <span className={`font-bold text-lg ${
                      isDark ? 'text-white' : 'text-green-600'
                    }`}>
                      {plan.provider?.name?.charAt(0)}
                    </span>
                  </div>
                  <div className="ml-4">
                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {plan.provider?.name}
                    </p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {plan.provider?.phone}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MessDetail; 