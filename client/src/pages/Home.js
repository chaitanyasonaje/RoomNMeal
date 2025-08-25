import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCity } from '../context/CityContext';
import { FaSearch, FaHome, FaUtensils, FaComments, FaShieldAlt, FaStar, FaArrowRight, FaCheck, FaMapMarkerAlt, FaUsers, FaClock, FaHeart, FaMapPin, FaBuilding, FaGraduationCap } from 'react-icons/fa';

const Home = () => {
  const { selectedCity } = useCity();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-700/10 to-primary-800/10 opacity-20"></div>
        </div>
        
        <div className="relative section-padding">
          <div className="max-w-6xl mx-auto text-center">
            <div className={`animate-fade-in-up ${isVisible ? 'animate' : ''}`}>
              <h1 className="heading-1 text-white mb-6">
                Find Your Perfect
                <span className="block bg-gradient-to-r from-accent-400 to-accent-500 bg-clip-text text-transparent">
                  Student Home
                </span>
              </h1>
              <p className="text-body text-primary-100 mb-8 max-w-3xl mx-auto">
                Discover premium rooms, subscribe to quality mess services, and enjoy a comfortable student life {selectedCity ? `in ${selectedCity.name}` : 'across India'}. 
                Everything you need for your academic journey in one place.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link to="/rooms" className="btn-primary text-lg px-8 py-4 group">
                  <span>Find Rooms</span>
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
                <Link to="/mess" className="btn-outline text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary-600">
                  <span>Mess Services</span>
                </Link>
              </div>
            </div>

            {/* Stats Section */}
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-fade-in-up ${isVisible ? 'animate' : ''}`} style={{animationDelay: '0.2s'}}>
              <div className="card-glass text-center">
                <div className="text-3xl font-bold text-white mb-2">500+</div>
                <div className="text-primary-100">Happy Students</div>
              </div>
              <div className="card-glass text-center">
                <div className="text-3xl font-bold text-white mb-2">100+</div>
                <div className="text-primary-100">Verified Rooms</div>
              </div>
              <div className="card-glass text-center">
                <div className="text-3xl font-bold text-white mb-2">50+</div>
                <div className="text-primary-100">Mess Providers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* City Information Section */}
      {selectedCity && (
        <section className="section-padding bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="heading-2 mb-4">Welcome to {selectedCity.name}</h2>
              <p className="text-body max-w-3xl mx-auto text-gray-600">
                {selectedCity.description}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card-hover text-center group">
                <div className="bg-gradient-to-br from-primary-100 to-primary-200 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <FaGraduationCap className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="heading-3 mb-2">{selectedCity.collegesCount}+</h3>
                <p className="text-body text-gray-600">Colleges & Universities</p>
              </div>
              
              <div className="card-hover text-center group">
                <div className="bg-gradient-to-br from-success-100 to-success-200 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <FaBuilding className="h-8 w-8 text-success-600" />
                </div>
                <h3 className="heading-3 mb-2">{selectedCity.techCompaniesCount}+</h3>
                <p className="text-body text-gray-600">Tech Companies</p>
              </div>
              
              <div className="card-hover text-center group">
                <div className="bg-gradient-to-br from-accent-100 to-accent-200 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <FaMapPin className="h-8 w-8 text-accent-600" />
                </div>
                <h3 className="heading-3 mb-2">Tier {selectedCity.tier}</h3>
                <p className="text-body text-gray-600">City Category</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="section-padding bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">Why Choose RoomNMeal?</h2>
            <p className="text-body max-w-3xl mx-auto">
              Everything you need for a comfortable and successful student life, all in one comprehensive platform
            </p>
          </div>
          
          <div className="grid-feature">
            <div className={`card-hover text-center group animate-fade-in-up ${isVisible ? 'animate' : ''}`} style={{animationDelay: '0.1s'}}>
              <div className="bg-gradient-to-br from-primary-100 to-primary-200 w-20 h-20 rounded-3xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                <FaHome className="h-10 w-10 text-primary-600" />
              </div>
              <h3 className="heading-3 mb-4">Premium Accommodation</h3>
              <p className="text-body mb-6">
                Find verified rooms and PGs near your college with all essential amenities, 
                modern facilities, and secure environments.
              </p>
              <div className="space-y-2 text-left">
                <div className="flex items-center text-sm text-gray-600">
                  <FaCheck className="h-4 w-4 text-success-500 mr-2" />
                  Verified properties
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FaCheck className="h-4 w-4 text-success-500 mr-2" />
                  Detailed photos & amenities
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FaCheck className="h-4 w-4 text-success-500 mr-2" />
                  Secure online booking
                </div>
              </div>
            </div>

            <div className={`card-hover text-center group animate-fade-in-up ${isVisible ? 'animate' : ''}`} style={{animationDelay: '0.2s'}}>
              <div className="bg-gradient-to-br from-success-100 to-success-200 w-20 h-20 rounded-3xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                <FaUtensils className="h-10 w-10 text-success-600" />
              </div>
              <h3 className="heading-3 mb-4">Quality Mess Services</h3>
              <p className="text-body mb-6">
                Subscribe to hygienic meal plans from trusted mess providers with 
                flexible options and nutritional balance.
              </p>
              <div className="space-y-2 text-left">
                <div className="flex items-center text-sm text-gray-600">
                  <FaCheck className="h-4 w-4 text-success-500 mr-2" />
                  Hygienic food preparation
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FaCheck className="h-4 w-4 text-success-500 mr-2" />
                  Flexible meal plans
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FaCheck className="h-4 w-4 text-success-500 mr-2" />
                  Online payment options
                </div>
              </div>
            </div>

            <div className={`card-hover text-center group animate-fade-in-up ${isVisible ? 'animate' : ''}`} style={{animationDelay: '0.3s'}}>
              <div className="bg-gradient-to-br from-accent-100 to-accent-200 w-20 h-20 rounded-3xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                <FaComments className="h-10 w-10 text-accent-600" />
              </div>
              <h3 className="heading-3 mb-4">Seamless Communication</h3>
              <p className="text-body mb-6">
                Chat directly with hosts and service providers for any queries, 
                instant support, and real-time updates.
              </p>
              <div className="space-y-2 text-left">
                <div className="flex items-center text-sm text-gray-600">
                  <FaCheck className="h-4 w-4 text-success-500 mr-2" />
                  Real-time chat support
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FaCheck className="h-4 w-4 text-success-500 mr-2" />
                  Instant notifications
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FaCheck className="h-4 w-4 text-success-500 mr-2" />
                  Direct provider contact
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">Our Comprehensive Services</h2>
            <p className="text-body max-w-3xl mx-auto">
              From accommodation to daily meals, we provide end-to-end solutions for all your student needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Room Booking */}
            <div className={`card-hover overflow-hidden group animate-fade-in-left ${isVisible ? 'animate' : ''}`} style={{animationDelay: '0.1s'}}>
              <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-8 text-white">
                <div className="flex items-center justify-between mb-4">
                  <FaHome className="h-12 w-12 text-white" />
                  <FaHeart className="h-6 w-6 text-primary-200 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Room Booking</h3>
                <p className="text-primary-100 text-lg">
                  Find and book verified rooms, PGs, and hostels near your college
                </p>
              </div>
              <div className="p-8">
                <div className="space-y-4 mb-6">
                  <div className="flex items-center text-gray-700">
                    <FaStar className="h-5 w-5 text-primary-500 mr-3" />
                    <span>Verified accommodations with detailed photos</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <FaMapMarkerAlt className="h-5 w-5 text-primary-500 mr-3" />
                    <span>Prime locations near educational institutions</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <FaShieldAlt className="h-5 w-5 text-primary-500 mr-3" />
                    <span>Secure online booking and payment</span>
                  </div>
                </div>
                <Link to="/rooms" className="btn-primary w-full text-center group">
                  <span>Browse Rooms</span>
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
            </div>

            {/* Mess Services */}
            <div className={`card-hover overflow-hidden group animate-fade-in-right ${isVisible ? 'animate' : ''}`} style={{animationDelay: '0.2s'}}>
              <div className="bg-gradient-to-br from-success-600 to-success-700 p-8 text-white">
                <div className="flex items-center justify-between mb-4">
                  <FaUtensils className="h-12 w-12 text-white" />
                  <FaClock className="h-6 w-6 text-success-200 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Mess Services</h3>
                <p className="text-success-100 text-lg">
                  Subscribe to quality meal plans from trusted mess providers
                </p>
              </div>
              <div className="p-8">
                <div className="space-y-4 mb-6">
                  <div className="flex items-center text-gray-700">
                    <FaStar className="h-5 w-5 text-success-500 mr-3" />
                    <span>Hygienic food preparation standards</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <FaUsers className="h-5 w-5 text-success-500 mr-3" />
                    <span>Flexible meal plans and schedules</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <FaShieldAlt className="h-5 w-5 text-success-500 mr-3" />
                    <span>Online payment and subscription management</span>
                  </div>
                </div>
                <Link to="/mess" className="btn-success w-full text-center group">
                  <span>View Mess Plans</span>
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800/10 to-gray-900/10 opacity-30"></div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="heading-2 text-white mb-6">
            Ready to Find Your Perfect Student Home?
          </h2>
          <p className="text-body text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of students who trust RoomNMeal for their accommodation needs. 
            Start your journey today and experience the difference.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary text-lg px-8 py-4 group">
              <span>Get Started Today</span>
              <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <Link to="/rooms" className="btn-outline text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-gray-900">
              <span>Browse Now</span>
            </Link>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-gray-400">Support Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">100%</div>
              <div className="text-gray-400">Secure Payments</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">Instant</div>
              <div className="text-gray-400">Booking Confirmation</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 