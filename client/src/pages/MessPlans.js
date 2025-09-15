import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useCity } from '../context/CityContext';
import { API_ENDPOINTS } from '../config/api';
import ListingGrid from '../components/ListingGrid';

const MessPlans = () => {
  const { isDark } = useTheme();
  const { selectedCity, getCityDetails } = useCity();
  const navigate = useNavigate();
  const [messPlans, setMessPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessPlans();
  }, [selectedCity]);

  const fetchMessPlans = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams();
      if (selectedCity) {
        params.append('city', selectedCity.name);
        params.append('state', selectedCity.state);
      }
      
      const queryString = params.toString();
      const url = queryString ? `${API_ENDPOINTS.MESS.PLANS}?${queryString}` : API_ENDPOINTS.MESS.PLANS;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform API data to match component expectations
      const transformedPlans = data.plans.map(plan => ({
        id: plan._id,
        title: plan.name,
        description: plan.description,
        price: plan.price,
        rating: plan.rating || 4.0,
        location: `${plan.city.name}, ${plan.city.state}`,
        images: plan.images || ["https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500"],
        category: plan.planType,
        mealTypes: plan.mealTypes || ["Breakfast", "Lunch", "Dinner"],
        cuisine: plan.cuisine || ["Indian"],
        isAvailable: plan.isActive,
        createdAt: new Date(plan.createdAt),
        provider: plan.provider,
        source: 'API'
      }));
      
      // Enrich with city accommodations (mess/tiffin services)
      let accommodationMeals = [];
      try {
        if (selectedCity?.id) {
          const city = await getCityDetails(selectedCity.id);
          if (city?.accommodations?.length) {
            accommodationMeals = city.accommodations
              .filter(acc => /mess|tiffin/i.test(acc.type))
              .map((acc, idx) => ({
                id: `acc-meal-${selectedCity.id}-${idx}`,
                title: acc.name,
                description: `${acc.type}${acc.address ? ' • ' + acc.address : ''}`,
                price: 0,
                rating: 4.3,
                location: `${selectedCity.name}, ${selectedCity.state}`,
                images: acc.images && acc.images.length ? acc.images : ["https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500"],
                category: 'Local Mess',
                mealTypes: ["Breakfast", "Lunch", "Dinner"],
                cuisine: ["Indian"],
                isAvailable: true,
                createdAt: new Date(),
                source: 'CityData'
              }));
          }
        }
      } catch (e) {
        console.warn('Failed to enrich mess plans with city accommodations:', e);
      }

      // Add mock data alongside API data
      const mockMessPlans = [
        {
          id: 'mock-1',
          title: "North Indian Mess Plan (Mock)",
          description: "Delicious North Indian meals with fresh ingredients. Perfect for students who love traditional Indian cuisine.",
          price: 2500,
          rating: 4.3,
          location: selectedCity ? `${selectedCity.name}, India` : "Delhi, India",
          images: ["https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500"],
          category: "North Indian",
          mealTypes: ["Breakfast", "Lunch", "Dinner"],
          cuisine: ["North Indian", "Punjabi"],
          isAvailable: true,
          createdAt: new Date('2024-01-15'),
          source: 'Mock'
        },
        {
          id: 'mock-2',
          title: "South Indian Special (Mock)",
          description: "Authentic South Indian cuisine with traditional recipes. Fresh idlis, dosas, and sambhar daily.",
          price: 2000,
          rating: 4.6,
          location: selectedCity ? `${selectedCity.name}, India` : "Delhi, India",
          images: ["https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500"],
          category: "South Indian",
          mealTypes: ["Breakfast", "Lunch", "Dinner"],
          cuisine: ["South Indian", "Tamil"],
          isAvailable: true,
          createdAt: new Date('2024-01-10'),
          source: 'Mock'
        },
        {
          id: 'mock-3',
          title: "Gujarati Thali (Mock)",
          description: "Complete Gujarati thali with dal, sabzi, roti, rice, and sweet. Vegetarian meals with authentic flavors.",
          price: 1800,
          rating: 4.4,
          location: selectedCity ? `${selectedCity.name}, India` : "Delhi, India",
          images: ["https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500"],
          category: "Gujarati",
          mealTypes: ["Lunch", "Dinner"],
          cuisine: ["Gujarati", "Vegetarian"],
          isAvailable: true,
          createdAt: new Date('2024-01-20'),
          source: 'Mock'
        }
      ];
      
      // Combine API data with city accommodations and mock data
      setMessPlans([...transformedPlans, ...accommodationMeals, ...mockMessPlans]);
    } catch (error) {
      console.error('Error fetching mess plans:', error);
      
      // Fallback to mock data if API fails
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
        }
      ];
      
      setMessPlans(mockMessPlans);
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