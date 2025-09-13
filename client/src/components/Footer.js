import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { FaHome, FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaArrowUp, FaHeart } from 'react-icons/fa';

const Footer = () => {
  const { isDark } = useTheme();
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  return (
    <footer className={`relative overflow-hidden ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900'
    } text-white`}>
      {/* Background Pattern */}
      <div className={`absolute inset-0 ${
        isDark 
          ? 'bg-gradient-to-br from-gray-800/20 to-gray-900/20' 
          : 'bg-gradient-to-br from-gray-700/20 to-gray-800/20'
      } opacity-30`}></div>
      
      <div className="relative">
        {/* Main Footer Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-r from-primary-500 to-primary-600 p-3 rounded-2xl"
                >
                  <FaHome className="h-8 w-8 text-white" />
                </motion.div>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent">
                  RoomNMeal
                </span>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Your trusted partner for student accommodation and mess services. 
                We connect students with quality living spaces and meal providers.
              </p>
              <div className="flex space-x-4">
                <motion.a 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  href="#" 
                  className="bg-white/10 hover:bg-primary-500 p-3 rounded-xl transition-all duration-300"
                >
                  <FaFacebook className="h-5 w-5" />
                </motion.a>
                <motion.a 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  href="#" 
                  className="bg-white/10 hover:bg-primary-500 p-3 rounded-xl transition-all duration-300"
                >
                  <FaTwitter className="h-5 w-5" />
                </motion.a>
                <motion.a 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  href="#" 
                  className="bg-white/10 hover:bg-primary-500 p-3 rounded-xl transition-all duration-300"
                >
                  <FaInstagram className="h-5 w-5" />
                </motion.a>
                <motion.a 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  href="#" 
                  className="bg-white/10 hover:bg-primary-500 p-3 rounded-xl transition-all duration-300"
                >
                  <FaLinkedin className="h-5 w-5" />
                </motion.a>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={itemVariants}>
              <h3 className="text-xl font-bold mb-6 text-white">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <motion.div whileHover={{ x: 5 }}>
                    <Link to="/" className="text-gray-300 hover:text-primary-400 transition-colors duration-200 flex items-center group">
                      <span className="w-2 h-2 bg-primary-500 rounded-full mr-3 group-hover:scale-150 transition-transform duration-200"></span>
                      Home
                    </Link>
                  </motion.div>
                </li>
                <li>
                  <motion.div whileHover={{ x: 5 }}>
                    <Link to="/rooms" className="text-gray-300 hover:text-primary-400 transition-colors duration-200 flex items-center group">
                      <span className="w-2 h-2 bg-primary-500 rounded-full mr-3 group-hover:scale-150 transition-transform duration-200"></span>
                      Find Rooms
                    </Link>
                  </motion.div>
                </li>
                <li>
                  <motion.div whileHover={{ x: 5 }}>
                    <Link to="/mess" className="text-gray-300 hover:text-primary-400 transition-colors duration-200 flex items-center group">
                      <span className="w-2 h-2 bg-primary-500 rounded-full mr-3 group-hover:scale-150 transition-transform duration-200"></span>
                      Mess Services
                    </Link>
                  </motion.div>
                </li>
                <li>
                  <motion.div whileHover={{ x: 5 }}>
                    <Link to="/services" className="text-gray-300 hover:text-primary-400 transition-colors duration-200 flex items-center group">
                      <span className="w-2 h-2 bg-primary-500 rounded-full mr-3 group-hover:scale-150 transition-transform duration-200"></span>
                      Additional Services
                    </Link>
                  </motion.div>
                </li>
                <li>
                  <motion.div whileHover={{ x: 5 }}>
                    <Link to="/faq" className="text-gray-300 hover:text-primary-400 transition-colors duration-200 flex items-center group">
                      <span className="w-2 h-2 bg-primary-500 rounded-full mr-3 group-hover:scale-150 transition-transform duration-200"></span>
                      FAQ & Help
                    </Link>
                  </motion.div>
                </li>
              </ul>
            </motion.div>

            {/* Services */}
            <motion.div variants={itemVariants}>
              <h3 className="text-xl font-bold mb-6 text-white">Our Services</h3>
              <ul className="space-y-3">
                <li>
                  <motion.div whileHover={{ x: 5 }}>
                    <span className="text-gray-300 flex items-center group">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3 group-hover:scale-150 transition-transform duration-200"></span>
                      Room Booking
                    </span>
                  </motion.div>
                </li>
                <li>
                  <motion.div whileHover={{ x: 5 }}>
                    <span className="text-gray-300 flex items-center group">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3 group-hover:scale-150 transition-transform duration-200"></span>
                      Mess Subscriptions
                    </span>
                  </motion.div>
                </li>
                <li>
                  <motion.div whileHover={{ x: 5 }}>
                    <span className="text-gray-300 flex items-center group">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3 group-hover:scale-150 transition-transform duration-200"></span>
                      Laundry Services
                    </span>
                  </motion.div>
                </li>
                <li>
                  <motion.div whileHover={{ x: 5 }}>
                    <span className="text-gray-300 flex items-center group">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3 group-hover:scale-150 transition-transform duration-200"></span>
                      Cleaning Services
                    </span>
                  </motion.div>
                </li>
                <li>
                  <motion.div whileHover={{ x: 5 }}>
                    <span className="text-gray-300 flex items-center group">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3 group-hover:scale-150 transition-transform duration-200"></span>
                      Maintenance Support
                    </span>
                  </motion.div>
                </li>
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div variants={itemVariants}>
              <h3 className="text-xl font-bold mb-6 text-white">Contact Us</h3>
              <div className="space-y-4">
                <motion.div 
                  whileHover={{ x: 5 }}
                  className="flex items-start space-x-3"
                >
                  <div className="bg-primary-500/20 p-2 rounded-lg mt-1">
                    <FaMapMarkerAlt className="h-4 w-4 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">
                      Shirpur, Maharashtra, India
                    </p>
                    <p className="text-gray-400 text-xs">Near Engineering College</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  whileHover={{ x: 5 }}
                  className="flex items-start space-x-3"
                >
                  <div className="bg-primary-500/20 p-2 rounded-lg mt-1">
                    <FaPhone className="h-4 w-4 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">+91 80100 83340</p>
                    <p className="text-gray-400 text-xs">24/7 Support</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  whileHover={{ x: 5 }}
                  className="flex items-start space-x-3"
                >
                  <div className="bg-primary-500/20 p-2 rounded-lg mt-1">
                    <FaEnvelope className="h-4 w-4 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">chaitanyasonaje0205@gmail.com</p>
                    <p className="text-gray-400 text-xs">Quick Response</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className={`border-t ${
            isDark ? 'border-gray-700/50' : 'border-gray-600/50'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h3 className="text-2xl font-bold mb-3 text-white">Stay Updated</h3>
              <p className="text-gray-300 mb-6 max-w-md mx-auto text-lg">
                Subscribe to our newsletter for the latest updates on new rooms, 
                special offers, and student accommodation tips.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={`flex-1 px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                    isDark 
                      ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-400' 
                      : 'border-gray-500 bg-gray-700 text-white placeholder-gray-300'
                  }`}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl whitespace-nowrap"
                >
                  Subscribe
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className={`border-t ${
            isDark ? 'border-gray-700/50' : 'border-gray-600/50'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center md:text-left mb-4 md:mb-0"
              >
                <p className="text-gray-400 text-sm">
                  © 2024 RoomNMeal. All rights reserved. Made with{' '}
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                  >
                    <FaHeart className="inline h-3 w-3 text-red-500 mx-1" />
                  </motion.span>
                  for students.
                </p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="flex items-center space-x-6 text-sm"
              >
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link to="/privacy" className="text-gray-400 hover:text-primary-400 transition-colors duration-200">
                    Privacy Policy
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link to="/terms" className="text-gray-400 hover:text-primary-400 transition-colors duration-200">
                    Terms of Service
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link to="/cookies" className="text-gray-400 hover:text-primary-400 transition-colors duration-200">
                    Cookie Policy
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={scrollToTop}
        className="fixed bottom-20 right-6 md:right-8 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-40"
        aria-label="Scroll to top"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
      >
        <FaArrowUp className="h-5 w-5" />
      </motion.button>
    </footer>
  );
};

export default Footer; 