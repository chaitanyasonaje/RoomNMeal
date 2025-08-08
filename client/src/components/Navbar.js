import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHome, FaUser, FaSignOutAlt, FaBars, FaTimes, FaWallet, FaComments, FaBed, FaUtensils } from 'react-icons/fa';

const navLinks = [
  { to: '/', label: 'Home', icon: <FaHome /> },
  { to: '/rooms', label: 'Rooms', icon: <FaBed /> },
  { to: '/mess', label: 'Mess', icon: <FaUtensils /> },
  { to: '/chat', label: 'Chat', icon: <FaComments /> },
];

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Top Navbar for desktop */}
      <nav className="bg-white shadow-lg sticky top-0 z-50 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <FaHome className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">RoomNMeal</span>
            </Link>
            {/* Desktop Navigation */}
            <div className="flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center gap-2 text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium transition-colors"
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}
              {isAuthenticated && (
                <Link to="/wallet" className="flex items-center gap-2 text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium">
                  <FaWallet />
                  <span>Wallet</span>
                </Link>
              )}
              {isAuthenticated ? (
                <div className="relative group">
                  <button className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium">
                    <FaUser className="h-5 w-5" />
                    <span>{user?.name}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Admin Panel</Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/login" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium">Login</Link>
                  <Link to="/register" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-base font-medium">Register</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Bottom Navbar for mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-t md:hidden border-t border-gray-200">
        <div className="flex justify-between items-center px-2 py-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="flex flex-col items-center justify-center flex-1 py-2 text-xs text-gray-700 hover:text-primary-600 transition-colors"
            >
              <span className="text-lg mb-1">{link.icon}</span>
              {link.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <Link to="/profile" className="flex flex-col items-center justify-center flex-1 py-2 text-xs text-gray-700 hover:text-primary-600 transition-colors">
              <span className="text-lg mb-1"><FaUser /></span>
              Profile
            </Link>
          ) : (
            <Link to="/login" className="flex flex-col items-center justify-center flex-1 py-2 text-xs text-gray-700 hover:text-primary-600 transition-colors">
              <span className="text-lg mb-1"><FaUser /></span>
              Login
            </Link>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar; 