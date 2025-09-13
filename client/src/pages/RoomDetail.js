import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaMapMarkerAlt, FaBed, FaBath, FaWifi, FaParking, FaHeart, FaShare, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import BookingForm from '../components/BookingForm';
import { getMockData, mockReviews } from '../data/mockData';

const RoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { isDark } = useTheme();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    fetchRoomDetails();
  }, [id]);

  // Auto-refresh rating on review submit without full reload
  useEffect(() => {
    const handler = (e) => {
      if (e.detail?.targetModel === 'Room' && e.detail?.targetId === id) {
        fetchRoomDetails();
      }
    };
    window.addEventListener('ratings:updated', handler);
    return () => window.removeEventListener('ratings:updated', handler);
  }, [id]);

  const fetchRoomDetails = async () => {
    setLoading(true);
    // Use mock data instead of API
    const mockRoom = getMockData.getRoomById(id);
    if (mockRoom) {
      // Attach reviews from mockReviews
      mockRoom.reviews = mockReviews.filter(r => r.entityId === id && r.entityType === 'room');
      setRoom(mockRoom);
    } else {
      setRoom(null);
    }
    setLoading(false);
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      toast.error('Please login to book a room');
      navigate('/login');
      return;
    }

    if (user.role !== 'student') {
      toast.error('Only students can book rooms');
      return;
    }

    if (room.availability?.availableRooms <= 0) {
      toast.error('No rooms available for booking');
      return;
    }

    setShowBookingForm(true);
  };

  const handleBookingSuccess = (booking) => {
    toast.success('Booking created successfully!');
    setShowBookingForm(false);
    // Optionally redirect to dashboard or booking details
    navigate('/dashboard');
  };

  const handleContactHost = () => {
    if (!isAuthenticated) {
      toast.error('Please login to contact the host');
      navigate('/login');
      return;
    }
    
    // Navigate to chat with host
    navigate(`/chat?userId=${room.host._id}`);
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
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Loading room details...</p>
        </motion.div>
      </div>
    );
  }

  if (!room) {
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
            <FaBed className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Room not found
          </h2>
          <p className={`text-lg mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            The room you're looking for doesn't exist.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/rooms')}
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
          >
            <FaArrowLeft className="h-4 w-4 mr-2" />
            Back to Rooms
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
            onClick={() => navigate('/rooms')}
            className={`inline-flex items-center px-4 py-2 rounded-xl font-medium transition-colors ${
              isDark 
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } shadow-sm`}
          >
            <FaArrowLeft className="h-4 w-4 mr-2" />
            Back to Rooms
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
            {/* Room Images */}
            <motion.div
              variants={cardVariants}
              className={`rounded-2xl shadow-lg mb-6 overflow-hidden ${
                isDark ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <div className="relative h-64 sm:h-80 bg-gray-200">
                {room.images && room.images.length > 0 ? (
                  <img
                    src={room.images[0]}
                    alt={room.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <FaBed className="h-16 w-16" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute top-4 right-4 flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-3 rounded-full shadow-lg transition-colors ${
                      isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    <FaHeart className="h-5 w-5 text-gray-600" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-3 rounded-full shadow-lg transition-colors ${
                      isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    <FaShare className="h-5 w-5 text-gray-600" />
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Room Details */}
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
                    {room.title}
                  </h1>
                  <div className="flex items-center text-gray-500 mb-4">
                    <FaMapMarkerAlt className="h-5 w-5 mr-2 text-primary-600" />
                    <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {room.address?.street}, {room.address?.city}, {room.address?.state}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary-600">₹{room.rent}</div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>per month</div>
                </div>
              </div>
              
              <p className={`text-lg mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {room.description}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-4 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-700 dark:to-gray-600"
                >
                  <FaBed className="h-8 w-8 text-primary-600 mx-auto mb-3" />
                  <p className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-1`}>Room Type</p>
                  <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{room.roomType}</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600"
                >
                  <FaBath className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <p className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-1`}>Property Type</p>
                  <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{room.propertyType}</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-700 dark:to-gray-600"
                >
                  <FaWifi className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <p className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-1`}>Available</p>
                  <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{room.availability?.availableRooms || 0}</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-700 dark:to-gray-600"
                >
                  <FaParking className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                  <p className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-1`}>Security</p>
                  <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>₹{room.securityDeposit}</p>
                </motion.div>
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-gray-700 dark:to-gray-600">
                <div className="flex items-center">
                  <div className="flex items-center mr-4">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`h-5 w-5 ${i < Math.floor(room.ratings?.average || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {room.ratings?.average?.toFixed(1) || 0} ({room.ratings?.count || 0} reviews)
                  </span>
                </div>
                {room.isVerified && (
                  <div className="flex items-center px-3 py-1 bg-green-100 dark:bg-green-900 rounded-full">
                    <FaStar className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-xs font-medium text-green-800 dark:text-green-200">Verified</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Amenities */}
            <motion.div
              variants={cardVariants}
              className={`rounded-2xl shadow-lg p-6 mb-6 ${
                isDark ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <h2 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Amenities
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {room.amenities?.map((amenity, index) => {
                  const amenityName = typeof amenity === 'string' ? amenity : amenity?.name;
                  const amenityPrice = typeof amenity === 'object' ? amenity?.price : undefined;
                  return (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      className={`flex items-center p-3 rounded-xl ${
                        isDark ? 'bg-gray-700' : 'bg-gray-50'
                      }`}
                    >
                      <div className="w-3 h-3 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full mr-4 flex-shrink-0"></div>
                      <span className={`text-sm font-medium ${
                        isDark ? 'text-gray-200' : 'text-gray-700'
                      }`}>
                        {amenityName}
                        {amenityPrice ? ` (₹${amenityPrice})` : ''}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Additional Services */}
            {(room.mealOptions?.hasMeals || room.additionalServices?.laundry?.available || room.additionalServices?.tea?.available) && (
              <motion.div
                variants={cardVariants}
                className={`rounded-2xl shadow-lg p-6 mb-6 ${
                  isDark ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                <h2 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Additional Services
                </h2>
                <div className="space-y-4">
                  {room.mealOptions?.hasMeals && (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={`flex justify-between items-center p-4 rounded-xl ${
                        isDark ? 'bg-gray-700' : 'bg-gray-50'
                      }`}
                    >
                      <div>
                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Meals Available</h3>
                        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          {room.mealOptions.mealTypes?.join(', ')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          ₹{room.mealOptions.mealPrice?.breakfast || 0}/day
                        </p>
                      </div>
                    </motion.div>
                  )}
                  {room.additionalServices?.laundry?.available && (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={`flex justify-between items-center p-4 rounded-xl ${
                        isDark ? 'bg-gray-700' : 'bg-gray-50'
                      }`}
                    >
                      <div>
                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Laundry Service</h3>
                        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Weekly laundry service</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          ₹{room.additionalServices.laundry.price}/week
                        </p>
                      </div>
                    </motion.div>
                  )}
                  {room.additionalServices?.tea?.available && (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={`flex justify-between items-center p-4 rounded-xl ${
                        isDark ? 'bg-gray-700' : 'bg-gray-50'
                      }`}
                    >
                      <div>
                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Tea Service</h3>
                        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Morning and evening tea</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          ₹{room.additionalServices.tea.price}/day
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

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
              {room.reviews && room.reviews.length > 0 ? (
                <div className="space-y-6">
                  {room.reviews.slice(0, 3).map((review, index) => (
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
                  ₹{room.rent}
                </div>
                <div className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>per month</div>
              </div>
              
              <div className="space-y-4 mb-8">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`flex justify-between items-center p-3 rounded-xl ${
                    isDark ? 'bg-gray-700' : 'bg-gray-50'
                  }`}
                >
                  <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Security Deposit
                  </span>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    ₹{room.securityDeposit}
                  </span>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`flex justify-between items-center p-3 rounded-xl ${
                    isDark ? 'bg-gray-700' : 'bg-gray-50'
                  }`}
                >
                  <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Available Rooms
                  </span>
                  <span className={`font-bold ${
                    room.availability?.availableRooms > 0 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {room.availability?.availableRooms || 0}
                  </span>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`flex justify-between items-center p-3 rounded-xl ${
                    isDark ? 'bg-gray-700' : 'bg-gray-50'
                  }`}
                >
                  <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Property Type
                  </span>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {room.propertyType}
                  </span>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`flex justify-between items-center p-3 rounded-xl ${
                    isDark ? 'bg-gray-700' : 'bg-gray-50'
                  }`}
                >
                  <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Room Type
                  </span>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {room.roomType}
                  </span>
                </motion.div>
              </div>
              
              <div className="space-y-4 mb-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBookNow}
                  disabled={room.availability?.availableRooms <= 0}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
                    room.availability?.availableRooms > 0 
                      ? 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-lg hover:shadow-xl' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {room.availability?.availableRooms > 0 ? 'Book Now' : 'No Rooms Available'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleContactHost}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg border-2 transition-all duration-200 ${
                    isDark
                      ? 'border-gray-600 text-gray-300 hover:border-gray-500 hover:bg-gray-700'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  Contact Host
                </motion.button>
              </div>
              
              <div className={`pt-6 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Host Information
                </h3>
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isDark ? 'bg-primary-600' : 'bg-primary-100'
                  }`}>
                    <span className={`font-bold text-lg ${
                      isDark ? 'text-white' : 'text-primary-600'
                    }`}>
                      {room.host?.name?.charAt(0)}
                    </span>
                  </div>
                  <div className="ml-4">
                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {room.host?.name}
                    </p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {room.host?.phone}
                    </p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {room.host?.email}
                    </p>
                  </div>
                </div>
              </div>
              
              {room.isVerified && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900 rounded-xl border border-green-200 dark:border-green-700"
                >
                  <div className="flex items-center mb-2">
                    <FaStar className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-sm font-bold text-green-800 dark:text-green-200">
                      Verified Property
                    </span>
                  </div>
                  <p className="text-xs text-green-700 dark:text-green-300">
                    This property has been verified by our team
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>
        
        {/* Booking Form Modal */}
        {showBookingForm && (
          <BookingForm
            room={room}
            onBookingSuccess={handleBookingSuccess}
            onClose={() => setShowBookingForm(false)}
          />
        )}
      </div>
    </div>
  );
};

export default RoomDetail; 