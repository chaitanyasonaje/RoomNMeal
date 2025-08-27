import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCity } from '../context/CityContext';
import { FaHome, FaUser, FaSignOutAlt, FaBars, FaTimes, FaWallet, FaComments, FaBed, FaUtensils, FaPlus, FaMapMarkerAlt, FaChevronDown } from 'react-icons/fa';
import NotificationBell from './NotificationBell';
import CitySelector from './CitySelector';

const navLinks = [
  { to: '/', label: 'Home', icon: <FaHome /> },
  { to: '/rooms', label: 'Rooms', icon: <FaBed /> },
  { to: '/mess', label: 'Mess', icon: <FaUtensils /> },
  { to: '/services', label: 'Services', icon: <FaPlus /> },
  { to: '/chat', label: 'Chat', icon: <FaComments /> },
];

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { selectedCity, selectCity } = useCity();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCitySelectorOpen, setIsCitySelectorOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCitySelect = (city) => {
    selectCity(city);
  };

  return (
    <>
      {/* Top Navbar for desktop */}
      <nav className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-soft sticky top-0 z-50 hidden md:block border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-800 dark:to-primary-900 p-3 rounded-2xl group-hover:shadow-glow transition-all duration-300">
                {/* Optionally add a logo image here */}
                <FaHome className="h-8 w-8 text-white dark:text-primary-200" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-300 dark:to-primary-700 bg-clip-text text-transparent">
                RoomNMeal
              </span>
            </Link>

            {/* City Selector */}
            <button
              onClick={() => setIsCitySelectorOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 text-sm font-medium text-gray-700"
            >
              <FaMapMarkerAlt className="h-4 w-4 text-primary-600" />
              <span>{selectedCity ? selectedCity.name : 'Select City'}</span>
              <FaChevronDown className="h-3 w-3 text-gray-500" />
            </button>
            
            {/* Desktop Navigation */}
            <div className="flex items-center space-x-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="nav-link"
                >
                  <span className="text-lg">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
              
              {isAuthenticated && (
                <Link to="/wallet" className="nav-link">
                  <FaWallet className="text-lg" />
                  <span>Wallet</span>
                </Link>
              )}
              
              {isAuthenticated && <NotificationBell />}
              
              {isAuthenticated ? (
                <div className="relative group ml-2">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 px-4 py-2 rounded-xl text-base font-medium transition-all duration-200 hover:bg-primary-50">
                    <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span className="hidden lg:block">{user?.name}</span>
                  </button>
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-large py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 border border-gray-100">
                    <Link to="/profile" className="block px-4 py-3 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200 rounded-lg mx-2">
                      Profile Settings
                    </Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin" className="block px-4 py-3 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200 rounded-lg mx-2">
                        Admin Panel
                      </Link>
                    )}
                    <div className="border-t border-gray-100 my-2"></div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 rounded-lg mx-2"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3 ml-4">
                  <Link to="/login" className="nav-link">Sign In</Link>
                  <Link to="/register" className="btn-primary">Get Started</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Bottom Navbar for mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-t border-t border-gray-200 dark:border-gray-800 md:hidden">
        <div className="flex justify-between items-center px-2 py-2">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="flex flex-col items-center justify-center flex-1 py-3 text-xs text-gray-600 dark:text-primary-200 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/30 mx-1"
            >
              <span className="text-xl mb-1">{link.icon}</span>
              <span className="font-medium">{link.label}</span>
            </Link>
          ))}
          {isAuthenticated ? (
            <Link to="/profile" className="flex flex-col items-center justify-center flex-1 py-3 text-xs text-gray-600 dark:text-primary-200 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/30 mx-1">
              <span className="text-xl mb-1"><FaUser /></span>
              <span className="font-medium">Profile</span>
            </Link>
          ) : (
            <Link to="/login" className="flex flex-col items-center justify-center flex-1 py-3 text-xs text-gray-600 dark:text-primary-200 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/30 mx-1">
              <span className="text-xl mb-1"><FaUser /></span>
              <span className="font-medium">Sign In</span>
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 md:hidden">
          <div className="absolute bottom-20 left-4 right-4 bg-white rounded-2xl shadow-large p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Menu</h3>
              <button
                onClick={toggleMenu}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
              >
                <FaTimes className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={toggleMenu}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-colors duration-200"
                >
                  <span className="text-lg">{link.icon}</span>
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* City Selector Modal */}
      <CitySelector
        isOpen={isCitySelectorOpen}
        onClose={() => setIsCitySelectorOpen(false)}
        onCitySelect={handleCitySelect}
      />
    </>
  );
};

export default Navbar; 