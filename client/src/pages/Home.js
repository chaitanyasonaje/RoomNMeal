import React from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaHome, FaUtensils, FaComments, FaShieldAlt, FaStar } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Perfect Student Home
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Discover rooms, subscribe to mess services, and enjoy a comfortable student life in Shirpur
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/rooms" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Find Rooms
              </Link>
              <Link to="/mess" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors">
                Mess Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose RoomNMeal?
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need for a comfortable student life in one place
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHome className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Accommodation</h3>
              <p className="text-gray-600">
                Find verified rooms and PGs near your college with all essential amenities
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUtensils className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Mess Services</h3>
              <p className="text-gray-600">
                Subscribe to quality meal plans from verified mess providers
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaComments className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Communication</h3>
              <p className="text-gray-600">
                Chat directly with hosts and service providers for any queries
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-lg text-gray-600">
              Comprehensive solutions for all your student accommodation needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Room Booking */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-primary-600 p-6">
                <FaHome className="h-12 w-12 text-white mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Room Booking</h3>
                <p className="text-primary-100">
                  Find and book verified rooms, PGs, and hostels near your college
                </p>
              </div>
              <div className="p-6">
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <FaStar className="h-4 w-4 text-primary-600 mr-2" />
                    Verified accommodations
                  </li>
                  <li className="flex items-center">
                    <FaStar className="h-4 w-4 text-primary-600 mr-2" />
                    Detailed photos and amenities
                  </li>
                  <li className="flex items-center">
                    <FaStar className="h-4 w-4 text-primary-600 mr-2" />
                    Secure online booking
                  </li>
                </ul>
                <Link to="/rooms" className="mt-6 inline-block bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                  Browse Rooms
                </Link>
              </div>
            </div>

            {/* Mess Services */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-green-600 p-6">
                <FaUtensils className="h-12 w-12 text-white mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Mess Services</h3>
                <p className="text-green-100">
                  Subscribe to quality meal plans from trusted mess providers
                </p>
              </div>
              <div className="p-6">
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <FaStar className="h-4 w-4 text-green-600 mr-2" />
                    Hygienic food preparation
                  </li>
                  <li className="flex items-center">
                    <FaStar className="h-4 w-4 text-green-600 mr-2" />
                    Flexible meal plans
                  </li>
                  <li className="flex items-center">
                    <FaStar className="h-4 w-4 text-green-600 mr-2" />
                    Online payment options
                  </li>
                </ul>
                <Link to="/mess" className="mt-6 inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  View Mess Plans
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Find Your Perfect Student Home?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of students who trust RoomNMeal for their accommodation needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Get Started
            </Link>
            <Link to="/rooms" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors">
              Browse Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 