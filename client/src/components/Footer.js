import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <FaHome className="h-8 w-8 text-primary-400" />
              <span className="text-xl font-bold">RoomNMeal</span>
            </div>
            <p className="text-gray-300 mb-4">
              Your trusted platform for student accommodation and services. 
              Find the perfect room, subscribe to quality mess services, and 
              enjoy a comfortable student life.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaFacebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaTwitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaInstagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/rooms" className="text-gray-300 hover:text-white transition-colors">
                  Find Rooms
                </Link>
              </li>
              <li>
                <Link to="/mess" className="text-gray-300 hover:text-white transition-colors">
                  Mess Services
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-300 hover:text-white transition-colors">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <FaMapMarkerAlt className="h-4 w-4 text-primary-400" />
                <span className="text-gray-300">Shirpur, Maharashtra</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaPhone className="h-4 w-4 text-primary-400" />
                <span className="text-gray-300">+91 80100 83340</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="h-4 w-4 text-primary-400" />
                <span className="text-gray-300">chaitanyasonaje0205@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 RoomNMeal. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 