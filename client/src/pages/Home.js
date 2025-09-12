import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useCity } from '../context/CityContext';
import Hero from '../components/Hero';
import ListingGrid from '../components/ListingGrid';
import { 
  FaHome, 
  FaUtensils, 
  FaPlus, 
  FaShieldAlt, 
  FaStar, 
  FaArrowRight, 
  FaCheck, 
  FaUsers, 
  FaClock,
  FaHeart,
  FaGraduationCap
} from 'react-icons/fa';

const Home = () => {
  const { isDark } = useTheme();
  const { selectedCity } = useCity();
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [featuredMeals, setFeaturedMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const loadData = async () => {
      setIsLoading(true);
      
      // Mock data for featured rooms
      const mockRooms = [
        {
          id: 1,
          title: "Cozy PG near University",
          description: "Furnished single room with all amenities, perfect for students",
          price: 8000,
          rating: 4.5,
          location: "Near IIT Delhi",
          images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500"],
          amenities: ["WiFi", "AC", "Parking", "Meals"],
          roomType: "Single",
          propertyType: "PG",
          isAvailable: true
        },
        {
          id: 2,
          title: "Modern Hostel Room",
          description: "Shared accommodation with modern facilities and study area",
          price: 6000,
          rating: 4.2,
          location: "Near Delhi University",
          images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500"],
          amenities: ["WiFi", "Parking", "Common Room"],
          roomType: "Double",
          propertyType: "Hostel",
          isAvailable: true
        },
        {
          id: 3,
          title: "Luxury Apartment",
          description: "Spacious apartment with premium amenities and security",
          price: 12000,
          rating: 4.8,
          location: "Near NIT Delhi",
          images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500"],
          amenities: ["WiFi", "AC", "Parking", "Gym", "Security"],
          roomType: "Single",
          propertyType: "Apartment",
          isAvailable: true
        }
      ];

      // Mock data for featured meals
      const mockMeals = [
        {
          id: 1,
          title: "North Indian Mess Plan",
          description: "Delicious North Indian meals with fresh ingredients",
          price: 2500,
          rating: 4.3,
          location: "Near IIT Delhi",
          images: ["https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500"],
          category: "North Indian",
          mealTypes: ["Breakfast", "Lunch", "Dinner"],
          isAvailable: true
        },
        {
          id: 2,
          title: "South Indian Special",
          description: "Authentic South Indian cuisine with traditional recipes",
          price: 2000,
          rating: 4.6,
          location: "Near Delhi University",
          images: ["https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500"],
          category: "South Indian",
          mealTypes: ["Breakfast", "Lunch", "Dinner"],
          isAvailable: true
        }
      ];

      setTimeout(() => {
        setFeaturedRooms(mockRooms);
        setFeaturedMeals(mockMeals);
        setIsLoading(false);
      }, 1000);
    };

    loadData();
  }, []);

  const features = [
    {
      icon: FaHome,
      title: "Find Perfect Rooms",
      description: "Browse through verified accommodations with detailed photos and amenities",
      color: "text-blue-600"
    },
    {
      icon: FaUtensils,
      title: "Quality Mess Services",
      description: "Subscribe to reliable mess plans with diverse cuisines and flexible timings",
      color: "text-orange-600"
    },
    {
      icon: FaPlus,
      title: "Essential Services",
      description: "Access laundry, cleaning, and other services right from your doorstep",
      color: "text-green-600"
    },
    {
      icon: FaShieldAlt,
      title: "Secure & Verified",
      description: "All listings are verified and secure with 24/7 customer support",
      color: "text-purple-600"
    }
  ];

  const stats = [
    { number: "500+", label: "Available Rooms" },
    { number: "200+", label: "Mess Providers" },
    { number: "50+", label: "Services" },
    { number: "1000+", label: "Happy Students" }
  ];

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

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <section className={`py-20 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <motion.h2
              variants={itemVariants}
              className={`text-3xl sm:text-4xl font-heading font-bold mb-4 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              Everything You Need for
              <span className="block bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
                Student Life
              </span>
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className={`text-lg ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              } max-w-3xl mx-auto`}
            >
              From finding the perfect room to subscribing to quality mess services, 
              we've got everything covered for your student journey.
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className={`p-6 rounded-2xl text-center transition-all duration-300 ${
                    isDark 
                      ? 'bg-gray-700 hover:bg-gray-600' 
                      : 'bg-gray-50 hover:bg-white hover:shadow-lg'
                  }`}
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${
                    isDark ? 'bg-gray-600' : 'bg-primary-100'
                  }`}>
                    <Icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <h3 className={`text-xl font-heading font-semibold mb-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {feature.title}
                  </h3>
                  <p className={`text-sm ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`py-16 ${isDark ? 'bg-gray-900' : 'bg-primary-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center"
              >
                <div className={`text-4xl font-heading font-bold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {stat.number}
                </div>
                <div className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Rooms Section */}
      <section className={`py-20 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-12"
          >
            <motion.h2
              variants={itemVariants}
              className={`text-3xl sm:text-4xl font-heading font-bold mb-4 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              Featured Rooms
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className={`text-lg ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              } max-w-2xl mx-auto`}
            >
              Discover some of our most popular and highly-rated accommodations
            </motion.p>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`animate-pulse rounded-2xl ${
                    isDark ? 'bg-gray-700' : 'bg-gray-200'
                  } h-96`}
                />
              ))}
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {featuredRooms.slice(0, 3).map((room, index) => (
                <motion.div
                  key={room.id}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 ${
                    isDark ? 'bg-gray-700' : 'bg-white'
                  }`}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={room.images[0]}
                      alt={room.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-success-500 text-white">
                        Available
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className={`text-lg font-heading font-semibold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {room.title}
                      </h3>
                      <div className="text-right">
                        <div className={`text-2xl font-bold font-heading ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          ₹{room.price.toLocaleString()}
                        </div>
                        <div className={`text-sm ${
                          isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          /month
                        </div>
                      </div>
                    </div>
                    <p className={`text-sm mb-4 ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {room.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <FaHome className="h-4 w-4 text-primary-600" />
                        <span className={`text-sm font-medium ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {room.roomType}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FaStar className="h-4 w-4 text-yellow-400" />
                        <span className={`text-sm font-medium ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {room.rating}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <Link
                        to={`/rooms/${room.id}`}
                        className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all duration-200 text-center ${
                          isDark
                            ? 'bg-gray-600 text-white hover:bg-gray-500'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        View Details
                      </Link>
                      <Link
                        to={`/rooms/${room.id}`}
                        className="flex-1 py-2 px-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 text-center shadow-lg hover:shadow-xl"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="text-center mt-12"
          >
            <Link
              to="/rooms"
              className="inline-flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <span>View All Rooms</span>
              <FaArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 ${isDark ? 'bg-gray-900' : 'bg-gradient-to-r from-primary-600 to-primary-700'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl sm:text-4xl font-heading font-bold text-white mb-4"
            >
              Ready to Find Your Perfect Student Home?
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto"
            >
              Join thousands of students who have found their ideal accommodation and mess services with us.
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/register"
                className="px-8 py-3 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Get Started Now
              </Link>
              <Link
                to="/rooms"
                className="px-8 py-3 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-primary-600 transition-all duration-200"
              >
                Browse Rooms
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;