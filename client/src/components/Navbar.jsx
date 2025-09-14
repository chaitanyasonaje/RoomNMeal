import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaHome, 
  FaBed, 
  FaUtensils, 
  FaPlus, 
  FaComments, 
  FaUser, 
  FaBars, 
  FaTimes,
  FaWallet,
  FaMapMarkerAlt,
  FaChevronDown,
  FaClipboardList
} from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useCity } from '../context/CityContext';
import CitySelector from './CitySelector';
import Button from './ui/Button';
import Typography from './ui/Typography';
import Badge from './ui/Badge';

const navLinks = [
  { to: '/', label: 'Home', icon: FaHome },
  { to: '/rooms', label: 'Rooms', icon: FaBed },
  { to: '/mess', label: 'Meals', icon: FaUtensils },
  { to: '/services', label: 'Services', icon: FaPlus },
  { to: '/chat', label: 'Chat', icon: FaComments },
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCitySelectorOpen, setIsCitySelectorOpen] = useState(false);
  const { theme, toggleTheme, isDark } = useTheme();
  const { user, logout, isAuthenticated } = useAuth();
  const { selectedCity } = useCity();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Header - Only Logo and Controls */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 ${
          isDark 
            ? 'bg-gray-900/95 backdrop-blur-md border-b border-gray-800' 
            : 'bg-white/95 backdrop-blur-md border-b border-gray-200'
        }`}
      >
        <div className="flex justify-between items-center px-4 py-3">
          {/* Mobile Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-2 rounded-xl">
              <FaHome className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-heading font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              RoomNMeal
            </span>
          </Link>

          {/* Mobile Right Side */}
          <div className="flex items-center space-x-2">
            {/* City Selector */}
            <button
              onClick={() => setIsCitySelectorOpen(true)}
              className={`p-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                isDark
                  ? 'bg-gray-800 text-gray-300'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              <FaMapMarkerAlt className="h-4 w-4 text-primary-600" />
            </button>

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isDark
                  ? 'bg-gray-800 text-yellow-400'
                  : 'bg-gray-100 text-gray-600'
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? '☀️' : '🌙'}
            </motion.button>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleMobileMenu}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isDark
                  ? 'bg-gray-800 text-gray-300'
                  : 'bg-gray-100 text-gray-600'
              }`}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <FaTimes className="h-5 w-5" /> : <FaBars className="h-5 w-5" />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={toggleMobileMenu}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-heading font-semibold text-gray-900 dark:text-white">
                    Menu
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleMobileMenu}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                  >
                    <FaTimes className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  </motion.button>
                </div>

                <div className="space-y-2">
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={toggleMobileMenu}
                        className={`flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 rounded-xl transition-colors duration-200 ${
                          isActive(link.to) ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : ''
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{link.label}</span>
                      </Link>
                    );
                  })}
                  
                  {isAuthenticated && (
                    <>
                      <Link
                        to="/wallet"
                        onClick={toggleMobileMenu}
                        className={`flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 rounded-xl transition-colors duration-200 ${
                          isActive('/wallet') ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : ''
                        }`}
                      >
                        <FaWallet className="h-5 w-5" />
                        <span className="font-medium">Wallet</span>
                      </Link>
                      
                      <Link
                        to="/service-orders"
                        onClick={toggleMobileMenu}
                        className={`flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 rounded-xl transition-colors duration-200 ${
                          isActive('/service-orders') ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : ''
                        }`}
                      >
                        <FaClipboardList className="h-5 w-5" />
                        <span className="font-medium">Service Orders</span>
                      </Link>
                      
                      <Link
                        to="/payments"
                        onClick={toggleMobileMenu}
                        className={`flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 rounded-xl transition-colors duration-200 ${
                          isActive('/payments') ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : ''
                        }`}
                      >
                        <FaCreditCard className="h-5 w-5" />
                        <span className="font-medium">Payments</span>
                      </Link>
                      
                      <Link
                        to="/profile"
                        onClick={toggleMobileMenu}
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 rounded-xl transition-colors duration-200"
                      >
                        <FaUser className="h-5 w-5" />
                        <span className="font-medium">Profile</span>
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-colors duration-200 w-full text-left"
                      >
                        <FaUser className="h-5 w-5" />
                        <span className="font-medium">Sign Out</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Mobile Navigation */}
      <motion.nav 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed bottom-0 left-0 right-0 z-40 ${
          isDark 
            ? 'bg-gray-900/95 backdrop-blur-md border-t border-gray-800' 
            : 'bg-white/95 backdrop-blur-md border-t border-gray-200'
        }`}
      >
        <div className="flex justify-around items-center px-2 py-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <motion.div
                key={link.to}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={link.to}
                  className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium transition-all duration-200 rounded-lg mx-1 ${
                    isActive(link.to)
                      ? 'text-primary-600 bg-primary-100 dark:text-primary-400 dark:bg-primary-900/30'
                      : isDark
                      ? 'text-gray-400 hover:text-white'
                      : 'text-gray-500 hover:text-primary-600'
                  }`}
                >
                  <Icon className="h-5 w-5 mb-1" />
                  <span>{link.label}</span>
                </Link>
              </motion.div>
            );
          })}
          {isAuthenticated ? (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/wallet"
                className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium transition-all duration-200 rounded-lg mx-1 ${
                  isActive('/wallet')
                    ? 'text-primary-600 bg-primary-100 dark:text-primary-400 dark:bg-primary-900/30'
                    : isDark
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-500 hover:text-primary-600'
                }`}
              >
                <FaWallet className="h-5 w-5 mb-1" />
                <span>Wallet</span>
              </Link>
            </motion.div>
          ) : (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/login"
                className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium transition-all duration-200 rounded-lg mx-1 ${
                  isActive('/login')
                    ? 'text-primary-600 bg-primary-100 dark:text-primary-400 dark:bg-primary-900/30'
                    : isDark
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-500 hover:text-primary-600'
                }`}
              >
                <FaUser className="h-5 w-5 mb-1" />
                <span>Sign In</span>
              </Link>
            </motion.div>
          )}
        </div>
      </motion.nav>

      {/* City Selector Modal */}
      <CitySelector
        isOpen={isCitySelectorOpen}
        onClose={() => setIsCitySelectorOpen(false)}
        onCitySelect={(city) => {
          // Handle city selection
          console.log('City selected:', city);
          setIsCitySelectorOpen(false);
        }}
      />
    </>
  );
};

export default Navbar;