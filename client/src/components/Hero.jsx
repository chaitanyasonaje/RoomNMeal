import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaMapMarkerAlt, FaBed, FaUtensils, FaPlus } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('rooms');
  const { isDark } = useTheme();

  const categories = [
    { id: 'rooms', label: 'Rooms', icon: FaBed, color: 'text-blue-600' },
    { id: 'meals', label: 'Meals', icon: FaUtensils, color: 'text-orange-600' },
    { id: 'services', label: 'Services', icon: FaPlus, color: 'text-green-600' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search logic here
    console.log('Searching for:', searchQuery, 'in category:', selectedCategory);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const searchVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.3,
      },
    },
  };

  return (
    <section className={`relative min-h-screen flex items-center justify-center overflow-hidden ${
      isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-primary-50'
    }`}>
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/5 via-transparent to-secondary-500/5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          {/* Main Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold mb-6"
          >
            <span className={`${isDark ? 'text-white' : 'text-gray-900'}`}>
              Find your{' '}
            </span>
            <span className="bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
              Room, Meal & More
            </span>
            <br />
            <span className={`${isDark ? 'text-white' : 'text-gray-900'}`}>
              in One App
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className={`text-lg sm:text-xl lg:text-2xl mb-12 max-w-3xl mx-auto ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            Discover the perfect accommodation, delicious meals, and essential services 
            for your student life. Everything you need, all in one place.
          </motion.p>

          {/* Search Section */}
          <motion.div
            variants={searchVariants}
            className="max-w-4xl mx-auto"
          >
            {/* Category Tabs */}
            <div className="flex justify-center mb-8">
              <div className={`inline-flex rounded-2xl p-1 ${
                isDark ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <motion.button
                      key={category.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                        selectedCategory === category.id
                          ? 'bg-white dark:bg-gray-700 shadow-lg text-gray-900 dark:text-white'
                          : isDark
                          ? 'text-gray-400 hover:text-white'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${category.color}`} />
                      <span>{category.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Search Bar */}
            <motion.form
              onSubmit={handleSearch}
              className={`relative rounded-2xl shadow-2xl ${
                isDark ? 'bg-gray-800' : 'bg-white'
              }`}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col sm:flex-row">
                {/* Location Input */}
                <div className="flex-1 flex items-center px-6 py-4 border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-gray-700">
                  <FaMapMarkerAlt className="h-5 w-5 text-primary-600 mr-3 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Enter city or location"
                    className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
                  />
                </div>

                {/* Search Input */}
                <div className="flex-1 flex items-center px-6 py-4">
                  <FaSearch className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search for ${categories.find(c => c.id === selectedCategory)?.label.toLowerCase()}...`}
                    className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
                  />
                </div>

                {/* Search Button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-r-2xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <FaSearch className="h-5 w-5" />
                  <span className="hidden sm:inline">Search</span>
                </motion.button>
              </div>
            </motion.form>

            {/* Quick Stats */}
            <motion.div
              variants={itemVariants}
              className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto"
            >
              <div className="text-center">
                <div className={`text-3xl font-bold font-heading ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  500+
                </div>
                <div className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Available Rooms
                </div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold font-heading ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  200+
                </div>
                <div className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Mess Providers
                </div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold font-heading ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  50+
                </div>
                <div className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Services
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`w-6 h-10 border-2 rounded-full flex justify-center ${
            isDark ? 'border-gray-400' : 'border-gray-600'
          }`}
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`w-1 h-3 rounded-full mt-2 ${
              isDark ? 'bg-gray-400' : 'bg-gray-600'
            }`}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
