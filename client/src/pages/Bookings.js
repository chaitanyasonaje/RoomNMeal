import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FaFilter, FaSearch, FaCalendar, FaHome, FaUser, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import BookingCard from '../components/BookingCard';
import { getMockData } from '../data/mockData';

const Bookings = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    search: ''
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    // Use mock data instead of API
    if (user && user._id) {
      setBookings(getMockData.getUserBookings(user._id));
    } else {
      setBookings([]);
    }
    setLoading(false);
  };

  const handleBookingUpdate = (updatedBooking) => {
    setBookings(prev => 
      prev.map(booking => 
        booking._id === updatedBooking._id ? updatedBooking : booking
      )
    );
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = filters.status === 'all' || booking.status === filters.status;
    const matchesSearch = filters.search === '' || 
      booking.room?.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
      (user?.role === 'student' ? booking.host?.name?.toLowerCase().includes(filters.search.toLowerCase()) : 
       booking.student?.name?.toLowerCase().includes(filters.search.toLowerCase()));
    
    return matchesStatus && matchesSearch;
  });

  const getStatusCounts = () => {
    const counts = { all: bookings.length };
    bookings.forEach(booking => {
      counts[booking.status] = (counts[booking.status] || 0) + 1;
    });
    return counts;
  };

  const statusCounts = getStatusCounts();

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
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Loading your bookings...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-6 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="mb-8 text-center"
          >
            <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              My Bookings
            </h1>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {user?.role === 'student'
                ? 'Manage your room bookings and track their status'
                : 'Manage bookings for your properties'}
            </p>
          </motion.div>
          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8"
          >
            {Object.entries(statusCounts).map(([status, count]) => (
              <motion.div
                key={status}
                whileHover={{ scale: 1.05 }}
                className={`rounded-2xl shadow-lg p-6 text-center ${
                  isDark ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                <div className={`text-3xl font-bold mb-2 ${
                  status === 'all' ? (isDark ? 'text-white' : 'text-gray-900') :
                  status === 'pending' ? 'text-yellow-600' :
                  status === 'confirmed' ? 'text-blue-600' :
                  status === 'active' ? 'text-green-600' :
                  status === 'completed' ? (isDark ? 'text-gray-400' : 'text-gray-600') :
                  'text-red-600'
                }`}>
                  {count}
                </div>
                <div className={`text-sm font-medium capitalize ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {status === 'all' ? 'Total' : status}
                </div>
              </motion.div>
            ))}
          </motion.div>
          {/* Filters */}
          <motion.div
            variants={cardVariants}
            className={`rounded-2xl shadow-lg mb-8 ${
              isDark ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder={`Search ${user?.role === 'student' ? 'rooms or hosts' : 'students or rooms'}...`}
                      value={filters.search}
                      onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                      className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>
                </div>
                <div className="md:w-48">
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
          {/* Bookings List */}
          <motion.div
            variants={itemVariants}
            className="space-y-6"
          >
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking, index) => (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <BookingCard
                    booking={booking}
                    userRole={user.role}
                    onStatusUpdate={handleBookingUpdate}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className={`rounded-2xl shadow-lg p-12 text-center ${
                  isDark ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                <FaCalendar className="h-20 w-20 text-gray-400 mx-auto mb-6" />
                <h3 className={`text-xl font-semibold mb-3 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {filters.status !== 'all' || filters.search
                    ? 'No bookings match your filters'
                    : 'No bookings yet'}
                </h3>
                <p className={`text-lg mb-8 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {filters.status !== 'all' || filters.search
                    ? 'Try adjusting your search or filter criteria'
                    : user?.role === 'student'
                      ? 'Start by browsing available rooms and making your first booking'
                      : 'Bookings will appear here once students book your rooms'}
                </p>
                {user?.role === 'student' && (
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href="/rooms"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <FaHome className="mr-2 h-5 w-5" />
                    Browse Rooms
                  </motion.a>
                )}
              </motion.div>
            )}
          </motion.div>
          {/* Quick Actions */}
          {user?.role === 'student' && bookings.length > 0 && (
            <motion.div
              variants={cardVariants}
              className={`mt-8 rounded-2xl shadow-lg p-6 ${
                isDark ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <h3 className={`text-xl font-bold mb-6 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Quick Actions
              </h3>
              <div className="flex flex-wrap gap-4">
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="/rooms"
                  className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    isDark 
                      ? 'bg-blue-900 text-blue-200 hover:bg-blue-800' 
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  <FaHome className="mr-2 h-5 w-5" />
                  Find More Rooms
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="/mess"
                  className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    isDark 
                      ? 'bg-green-900 text-green-200 hover:bg-green-800' 
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  <FaUser className="mr-2 h-5 w-5" />
                  Browse Mess Plans
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="/chat"
                  className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    isDark 
                      ? 'bg-purple-900 text-purple-200 hover:bg-purple-800' 
                      : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                  }`}
                >
                  <FaCalendar className="mr-2 h-5 w-5" />
                  Chat with Hosts
                </motion.a>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Bookings; 