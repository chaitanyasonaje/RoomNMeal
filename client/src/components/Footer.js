import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaArrowUp, FaHeart } from 'react-icons/fa';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 to-gray-900/20 opacity-30"></div>
      
      <div className="relative">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto container-padding py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-3 rounded-2xl">
                  <FaHome className="h-8 w-8 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent">
                  RoomNMeal
                </span>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Your trusted partner for student accommodation and mess services. 
                We connect students with quality living spaces and meal providers.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="bg-white/10 hover:bg-primary-500 p-3 rounded-xl transition-all duration-300 hover:scale-110">
                  <FaFacebook className="h-5 w-5" />
                </a>
                <a href="#" className="bg-white/10 hover:bg-primary-500 p-3 rounded-xl transition-all duration-300 hover:scale-110">
                  <FaTwitter className="h-5 w-5" />
                </a>
                <a href="#" className="bg-white/10 hover:bg-primary-500 p-3 rounded-xl transition-all duration-300 hover:scale-110">
                  <FaInstagram className="h-5 w-5" />
                </a>
                <a href="#" className="bg-white/10 hover:bg-primary-500 p-3 rounded-xl transition-all duration-300 hover:scale-110">
                  <FaLinkedin className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/" className="text-gray-300 hover:text-primary-400 transition-colors duration-200 flex items-center group">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mr-3 group-hover:scale-150 transition-transform duration-200"></span>
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/rooms" className="text-gray-300 hover:text-primary-400 transition-colors duration-200 flex items-center group">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mr-3 group-hover:scale-150 transition-transform duration-200"></span>
                    Find Rooms
                  </Link>
                </li>
                <li>
                  <Link to="/mess" className="text-gray-300 hover:text-primary-400 transition-colors duration-200 flex items-center group">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mr-3 group-hover:scale-150 transition-transform duration-200"></span>
                    Mess Services
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="text-gray-300 hover:text-primary-400 transition-colors duration-200 flex items-center group">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mr-3 group-hover:scale-150 transition-transform duration-200"></span>
                    Additional Services
                  </Link>
                </li>
                <li>
                  <Link to="/chat" className="text-gray-300 hover:text-primary-400 transition-colors duration-200 flex items-center group">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mr-3 group-hover:scale-150 transition-transform duration-200"></span>
                    Support Chat
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white">Our Services</h3>
              <ul className="space-y-3">
                <li>
                  <span className="text-gray-300 flex items-center group">
                    <span className="w-2 h-2 bg-success-500 rounded-full mr-3 group-hover:scale-150 transition-transform duration-200"></span>
                    Room Booking
                  </span>
                </li>
                <li>
                  <span className="text-gray-300 flex items-center group">
                    <span className="w-2 h-2 bg-success-500 rounded-full mr-3 group-hover:scale-150 transition-transform duration-200"></span>
                    Mess Subscriptions
                  </span>
                </li>
                <li>
                  <span className="text-gray-300 flex items-center group">
                    <span className="w-2 h-2 bg-success-500 rounded-full mr-3 group-hover:scale-150 transition-transform duration-200"></span>
                    Laundry Services
                  </span>
                </li>
                <li>
                  <span className="text-gray-300 flex items-center group">
                    <span className="w-2 h-2 bg-success-500 rounded-full mr-3 group-hover:scale-150 transition-transform duration-200"></span>
                    Cleaning Services
                  </span>
                </li>
                <li>
                  <span className="text-gray-300 flex items-center group">
                    <span className="w-2 h-2 bg-success-500 rounded-full mr-3 group-hover:scale-150 transition-transform duration-200"></span>
                    Maintenance Support
                  </span>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white">Contact Us</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-primary-500/20 p-2 rounded-lg mt-1">
                    <FaMapMarkerAlt className="h-4 w-4 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">
                      Shirpur, Maharashtra, India
                    </p>
                    <p className="text-gray-400 text-xs">Near Engineering College</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-primary-500/20 p-2 rounded-lg mt-1">
                    <FaPhone className="h-4 w-4 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">+91 98765 43210</p>
                    <p className="text-gray-400 text-xs">24/7 Support</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-primary-500/20 p-2 rounded-lg mt-1">
                    <FaEnvelope className="h-4 w-4 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">support@roomnmeal.com</p>
                    <p className="text-gray-400 text-xs">Quick Response</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-700/50">
          <div className="max-w-7xl mx-auto container-padding py-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-3 text-white">Stay Updated</h3>
              <p className="text-gray-300 mb-6 max-w-md mx-auto">
                Subscribe to our newsletter for the latest updates on new rooms, 
                special offers, and student accommodation tips.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
                <button className="btn-primary whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-700/50">
          <div className="max-w-7xl mx-auto container-padding py-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-center md:text-left mb-4 md:mb-0">
                <p className="text-gray-400 text-sm">
                  © 2024 RoomNMeal. All rights reserved. Made with{' '}
                  <FaHeart className="inline h-3 w-3 text-red-500 mx-1" />
                  for students.
                </p>
              </div>
              <div className="flex items-center space-x-6 text-sm">
                <Link to="/privacy" className="text-gray-400 hover:text-primary-400 transition-colors duration-200">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="text-gray-400 hover:text-primary-400 transition-colors duration-200">
                  Terms of Service
                </Link>
                <Link to="/cookies" className="text-gray-400 hover:text-primary-400 transition-colors duration-200">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-24 right-6 md:right-8 bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-40"
        aria-label="Scroll to top"
      >
        <FaArrowUp className="h-5 w-5" />
      </button>
    </footer>
  );
};

export default Footer; 