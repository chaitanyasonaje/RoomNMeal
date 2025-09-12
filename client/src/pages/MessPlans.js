import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useCity } from '../context/CityContext';
import ListingGrid from '../components/ListingGrid';

const MessPlans = () => {
  const { isDark } = useTheme();
  const { selectedCity } = useCity();
  const navigate = useNavigate();
  const [messPlans, setMessPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessPlans();
  }, [selectedCity]);

  const fetchMessPlans = async () => {
    try {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data for mess plans
      const mockMessPlans = [
        {
          id: 1,
          title: "North Indian Mess Plan",
          description: "Delicious North Indian meals with fresh ingredients. Perfect for students who love traditional Indian cuisine.",
          price: 2500,
          rating: 4.3,
          location: selectedCity ? `${selectedCity.name}, India` : "Delhi, India",
          images: ["https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500"],
          category: "North Indian",
          mealTypes: ["Breakfast", "Lunch", "Dinner"],
          cuisine: ["North Indian", "Punjabi"],
          isAvailable: true,
          createdAt: new Date('2024-01-15')
        },
        {
          id: 2,
          title: "South Indian Special",
          description: "Authentic South Indian cuisine with traditional recipes. Fresh idlis, dosas, and sambhar daily.",
          price: 2000,
          rating: 4.6,
          location: selectedCity ? `${selectedCity.name}, India` : "Delhi, India",
          images: ["https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500"],
          category: "South Indian",
          mealTypes: ["Breakfast", "Lunch", "Dinner"],
          cuisine: ["South Indian", "Tamil"],
          isAvailable: true,
          createdAt: new Date('2024-01-10')
        },
        {
          id: 3,
          title: "Gujarati Thali",
          description: "Complete Gujarati thali with dal, sabzi, roti, rice, and sweet. Vegetarian meals with authentic flavors.",
          price: 1800,
          rating: 4.4,
          location: selectedCity ? `${selectedCity.name}, India` : "Delhi, India",
          images: ["https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500"],
          category: "Gujarati",
          mealTypes: ["Lunch", "Dinner"],
          cuisine: ["Gujarati", "Vegetarian"],
          isAvailable: true,
          createdAt: new Date('2024-01-20')
        },
        {
          id: 4,
          title: "Jain Mess Plan",
          description: "Pure vegetarian Jain meals without onion and garlic. Perfect for students following Jain dietary restrictions.",
          price: 2200,
          rating: 4.5,
          location: selectedCity ? `${selectedCity.name}, India` : "Delhi, India",
          images: ["https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500"],
          category: "Jain",
          mealTypes: ["Breakfast", "Lunch", "Dinner"],
          cuisine: ["Jain", "Vegetarian"],
          isAvailable: true,
          createdAt: new Date('2024-01-12')
        },
        {
          id: 5,
          title: "Punjabi Dhaba Style",
          description: "Hearty Punjabi meals with rich gravies, fresh rotis, and traditional recipes. Perfect for students who love spicy food.",
          price: 2800,
          rating: 4.7,
          location: selectedCity ? `${selectedCity.name}, India` : "Delhi, India",
          images: ["https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500"],
          category: "Punjabi",
          mealTypes: ["Lunch", "Dinner"],
          cuisine: ["Punjabi", "North Indian"],
          isAvailable: false,
          createdAt: new Date('2024-01-08')
        },
        {
          id: 6,
          title: "Bengali Home Food",
          description: "Traditional Bengali cuisine with fish curry, rice, and Bengali sweets. A taste of home for Bengali students.",
          price: 2600,
          rating: 4.2,
          location: selectedCity ? `${selectedCity.name}, India` : "Delhi, India",
          images: ["https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500"],
          category: "Bengali",
          mealTypes: ["Lunch", "Dinner"],
          cuisine: ["Bengali", "Fish"],
          isAvailable: true,
          createdAt: new Date('2024-01-18')
        }
      ];

      setMessPlans(mockMessPlans);
    } catch (error) {
      console.error('Error fetching mess plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMessPlanClick = (messPlan) => {
    navigate(`/mess/${messPlan.id}`);
  };

  const handleSubscribeMessPlan = (messPlan) => {
    // Handle subscription logic here
    console.log('Subscribing to mess plan:', messPlan);
    // You can redirect to subscription page or show subscription modal
    navigate(`/mess/${messPlan.id}?action=subscribe`);
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
            isDark ? 'border-white' : 'border-primary-600'
          } mx-auto mb-4`}></div>
          <p className={`text-lg ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Loading mess plans...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header Section */}
      <div className={`py-12 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className={`text-3xl sm:text-4xl font-heading font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Discover Delicious Meals
            </h1>
            <p className={`text-lg ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            } max-w-2xl mx-auto`}>
              Subscribe to quality mess plans with diverse cuisines and flexible timings. 
              {selectedCity && ` Currently showing mess plans in ${selectedCity.name}.`}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Mess Plans Grid */}
      <ListingGrid
        items={messPlans}
        type="meals"
        onItemClick={handleMessPlanClick}
        onBookItem={handleSubscribeMessPlan}
      />
    </div>
  );
};

export default MessPlans;