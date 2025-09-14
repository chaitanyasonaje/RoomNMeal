import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FaHome, FaUtensils, FaComments, FaPlus, FaEye, FaEdit, FaCalendar, FaUsers, FaMoneyBillWave, FaArrowRight } from 'react-icons/fa';
import axios from 'axios';
import BookingCard from '../components/BookingCard';
import toast from 'react-hot-toast';
import { getMockData } from '../data/mockData';

const Dashboard = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [stats, setStats] = useState({
    bookings: { total: 0, pending: 0, confirmed: 0, active: 0, completed: 0 },
    subscriptions: { total: 0, active: 0, paused: 0 },
    rooms: 0,
    messPlans: 0,
    earnings: 0
  });
  const [bookings, setBookings] = useState([]);
  const [recentSubscriptions, setRecentSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    if (user && user._id) {
      const bookingsData = getMockData.getUserBookings(user._id) || [];
      const subscriptionsData = getMockData.getUserSubscriptions(user._id) || [];
      setBookings(bookingsData);
      setRecentSubscriptions(subscriptionsData.slice(0, 3));
      setStats({
        bookings: {
          total: bookingsData.length,
          pending: bookingsData.filter(b => b.status === 'pending').length,
          confirmed: bookingsData.filter(b => b.status === 'confirmed').length,
          active: bookingsData.filter(b => b.status === 'active').length,
          completed: bookingsData.filter(b => b.status === 'completed').length
        },
        subscriptions: { total: subscriptionsData.length },
        rooms: 0,
        messPlans: 0,
        earnings: 0
      });
    } else {
      setBookings([]);
      setRecentSubscriptions([]);
      setStats({
        bookings: { total: 0, pending: 0, confirmed: 0, active: 0, completed: 0 },
        subscriptions: { total: 0, active: 0, paused: 0 },
        rooms: 0,
        messPlans: 0,
        earnings: 0
      });
    }
    setLoading(false);
  };

  const handleBookingUpdate = (updatedBooking) => {
    setBookings(prev => 
      prev.map(booking => 
        booking._id === updatedBooking._id ? updatedBooking : booking
      )
    );
    fetchDashboardData(); // Refresh stats
  };

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    let greeting = '';
    
    if (hour < 12) greeting = 'Good morning';
    else if (hour < 18) greeting = 'Good afternoon';
    else greeting = 'Good evening';
    
    return `${greeting}, ${user?.name}!`;
  };

  const getQuickActions = () => {
    switch (user?.role) {
      case 'student':
        return [
          { title: 'Find Rooms', icon: FaHome, link: '/rooms', color: 'bg-blue-500' },
          { title: 'Mess Services', icon: FaUtensils, link: '/mess', color: 'bg-green-500' },
          { title: 'Chat', icon: FaComments, link: '/chat', color: 'bg-purple-500' }
        ];
      case 'host':
        return [
          { title: 'Add Room', icon: FaPlus, link: '/rooms/add', color: 'bg-blue-500' },
          { title: 'My Rooms', icon: FaEye, link: '/rooms/host', color: 'bg-green-500' },
          { title: 'Chat', icon: FaComments, link: '/chat', color: 'bg-purple-500' }
        ];
      case 'messProvider':
        return [
          { title: 'Add Mess Plan', icon: FaPlus, link: '/mess/add', color: 'bg-blue-500' },
          { title: 'My Plans', icon: FaEye, link: '/mess/provider', color: 'bg-green-500' },
          { title: 'Chat', icon: FaComments, link: '/chat', color: 'bg-purple-500' }
        ];
      default:
        return [];
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

  const getStatsCards = () => {
    if (user?.role === 'student') {
      return [
        {
          title: 'Total Bookings',
          value: stats.bookings.total,
          icon: FaCalendar,
          color: 'bg-blue-500',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-600'
        },
        {
          title: 'Active Subscriptions',
          value: stats.subscriptions.total,
          icon: FaUtensils,
          color: 'bg-green-500',
          bgColor: 'bg-green-100',
          textColor: 'text-green-600'
        },
        {
          title: 'Pending Bookings',
          value: stats.bookings.pending,
          icon: FaCalendar,
          color: 'bg-yellow-500',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-600'
        },
        {
          title: 'Active Bookings',
          value: stats.bookings.active,
          icon: FaHome,
          color: 'bg-purple-500',
          bgColor: 'bg-purple-100',
          textColor: 'text-purple-600'
        }
      ];
    } else if (user?.role === 'host') {
      return [
        {
          title: 'Total Rooms',
          value: stats.rooms,
          icon: FaHome,
          color: 'bg-blue-500',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-600'
        },
        {
          title: 'Total Bookings',
          value: stats.bookings.total,
          icon: FaCalendar,
          color: 'bg-green-500',
          bgColor: 'bg-green-100',
          textColor: 'text-green-600'
        },
        {
          title: 'Pending Bookings',
          value: stats.bookings.pending,
          icon: FaCalendar,
          color: 'bg-yellow-500',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-600'
        },
        {
          title: 'Active Bookings',
          value: stats.bookings.active,
          icon: FaUsers,
          color: 'bg-purple-500',
          bgColor: 'bg-purple-100',
          textColor: 'text-purple-600'
        }
      ];
    } else if (user?.role === 'messProvider') {
      return [
        {
          title: 'Mess Plans',
          value: stats.messPlans,
          icon: FaUtensils,
          color: 'bg-green-500',
          bgColor: 'bg-green-100',
          textColor: 'text-green-600'
        },
        {
          title: 'Active Subscriptions',
          value: stats.subscriptions.total,
          icon: FaUsers,
          color: 'bg-blue-500',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-600'
        }
      ];
    }
    return [];
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
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Loading dashboard...</p>
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
          {/* Welcome Section */}
          <motion.div
            variants={itemVariants}
            className="mb-8 text-center"
          >
            <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {getWelcomeMessage()}
            </h1>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Here's what's happening with your account
            </p>
          </motion.div>
          {/* Stats Cards */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {getStatsCards().map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className={`rounded-2xl shadow-lg p-6 flex items-center ${
                  isDark ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                <div className={`p-4 rounded-2xl ${
                  isDark ? 'bg-gray-700' : stat.bgColor
                }`}>
                  <stat.icon className={`h-8 w-8 ${
                    isDark ? 'text-gray-300' : stat.textColor
                  }`} />
                </div>
                <div className="ml-4">
                  <p className={`text-sm font-medium ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {stat.title}
                  </p>
                  <p className={`text-2xl font-bold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {stat.value}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
          {/* Quick Actions */}
          <motion.div
            variants={cardVariants}
            className={`rounded-2xl shadow-lg mb-8 ${
              isDark ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div className={`px-6 py-4 border-b ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h2 className={`text-xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Quick Actions
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getQuickActions().map((action, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      to={action.link}
                      className={`flex items-center p-4 border rounded-xl transition-all duration-200 ${
                        isDark 
                          ? 'border-gray-700 hover:bg-gray-700' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`p-3 rounded-2xl ${action.color}`}>
                        <action.icon className="h-6 w-6 text-white" />
                      </div>
                      <span className={`ml-3 font-semibold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {action.title}
                      </span>
                      <FaArrowRight className="h-4 w-4 ml-auto text-gray-400" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Bookings */}
            <motion.div
              variants={cardVariants}
              className={`rounded-2xl shadow-lg ${
                isDark ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <div className={`px-6 py-4 border-b ${
                isDark ? 'border-gray-700' : 'border-gray-200'
              } flex justify-between items-center`}>
                <h2 className={`text-xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Recent Bookings
                </h2>
                <Link 
                  to="/bookings" 
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
                >
                  View all <FaArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </div>
              <div className="p-6">
                {bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.slice(0, 3).map((booking, index) => (
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
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FaCalendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      No bookings yet
                    </p>
                    {user?.role === 'student' && (
                      <Link 
                        to="/rooms" 
                        className="mt-4 inline-block text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Find rooms to book →
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
            {/* Recent Subscriptions or Additional Info */}
            <motion.div
              variants={cardVariants}
              className={`rounded-2xl shadow-lg ${
                isDark ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <div className={`px-6 py-4 border-b ${
                isDark ? 'border-gray-700' : 'border-gray-200'
              } flex justify-between items-center`}>
                <h2 className={`text-xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {user?.role === 'student' ? 'Recent Subscriptions' : 'Recent Activity'}
                </h2>
                <Link 
                  to={user?.role === 'student' ? '/mess' : '/dashboard'} 
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
                >
                  View all <FaArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </div>
              <div className="p-6">
                {user?.role === 'student' ? (
                  recentSubscriptions.length > 0 ? (
                    <div className="space-y-4">
                      {recentSubscriptions.map((subscription, index) => (
                        <motion.div
                          key={subscription._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`flex items-center justify-between p-4 border rounded-xl ${
                            isDark ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'
                          }`}
                        >
                          <div>
                            <p className={`font-semibold text-sm ${
                              isDark ? 'text-white' : 'text-gray-900'
                            }`}>
                              {subscription.messPlan?.planName}
                            </p>
                            <p className={`text-sm ${
                              isDark ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              ₹{subscription.totalAmount}
                            </p>
                          </div>
                          <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                            subscription.status === 'active' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {subscription.status}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FaUtensils className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        No subscriptions yet
                      </p>
                      <Link 
                        to="/mess" 
                        className="mt-4 inline-block text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Browse mess plans →
                      </Link>
                    </div>
                  )
                ) : (
                  <div className="text-center py-8">
                    <FaMoneyBillWave className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Earnings and analytics coming soon
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard; 