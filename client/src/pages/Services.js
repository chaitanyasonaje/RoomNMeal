import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useCity } from '../context/CityContext';
import { API_ENDPOINTS } from '../config/api';
import ListingGrid from '../components/ListingGrid';

const Services = () => {
  const { isDark } = useTheme();
  const { selectedCity } = useCity();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, [selectedCity]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from API first
      const params = new URLSearchParams();
      if (selectedCity) {
        params.append('location', selectedCity.name);
      }
      
      const queryString = params.toString();
      const url = queryString ? `${API_ENDPOINTS.SERVICES}?${queryString}` : API_ENDPOINTS.SERVICES;
      
      let apiServices = [];
      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          // Transform API data to match component expectations
          apiServices = data.services.map(service => ({
            id: service._id,
            title: service.name,
            description: service.description,
            price: service.price,
            rating: service.rating?.average || 4.0,
            location: selectedCity ? `${selectedCity.name}, India` : "Delhi, India",
            images: service.images || ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500"],
            category: service.category,
            serviceType: service.type,
            isAvailable: service.availability?.isAvailable || true,
            createdAt: new Date(service.createdAt),
            provider: service.provider,
            source: 'API'
          }));
        }
      } catch (apiError) {
        console.log('API not available, using mock data only');
      }
      
      // Mock data for services
      const mockServices = [
        {
          id: 'mock-1',
          title: "Professional Laundry Service (Mock)",
          description: "Complete laundry service with pickup and delivery. We handle all your clothes with care and return them fresh and clean.",
          price: 150,
          rating: 4.5,
          location: selectedCity ? `${selectedCity.name}, India` : "Delhi, India",
          images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500"],
          category: "Laundry",
          serviceType: "laundry",
          isAvailable: true,
          createdAt: new Date('2024-01-15'),
          source: 'Mock'
        },
        {
          id: 'mock-2',
          title: "Room Cleaning Service (Mock)",
          description: "Professional room cleaning service for students. We keep your space clean and organized so you can focus on studies.",
          price: 200,
          rating: 4.3,
          location: selectedCity ? `${selectedCity.name}, India` : "Delhi, India",
          images: ["https://images.unsplash.com/photo-1581578731548-c6d0f7624a5e?w=500"],
          category: "Cleaning",
          serviceType: "cleaning",
          isAvailable: true,
          createdAt: new Date('2024-01-10'),
          source: 'Mock'
        },
        {
          id: 'mock-3',
          title: "Food Delivery Service (Mock)",
          description: "Quick food delivery from local restaurants. Order your favorite meals and get them delivered to your doorstep.",
          price: 50,
          rating: 4.4,
          location: selectedCity ? `${selectedCity.name}, India` : "Delhi, India",
          images: ["https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500"],
          category: "Food",
          serviceType: "food",
          isAvailable: true,
          createdAt: new Date('2024-01-20'),
          source: 'Mock'
        },
        {
          id: 'mock-4',
          title: "Campus Transport (Mock)",
          description: "Reliable transport service for campus commuting. Safe and comfortable rides to and from your college.",
          price: 100,
          rating: 4.6,
          location: selectedCity ? `${selectedCity.name}, India` : "Delhi, India",
          images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500"],
          category: "Transport",
          serviceType: "transport",
          isAvailable: true,
          createdAt: new Date('2024-01-12'),
          source: 'Mock'
        },
        {
          id: 'mock-5',
          title: "Laptop Repair Service (Mock)",
          description: "Professional laptop and computer repair service. Quick diagnosis and repair for all your tech needs.",
          price: 500,
          rating: 4.7,
          location: selectedCity ? `${selectedCity.name}, India` : "Delhi, India",
          images: ["https://images.unsplash.com/photo-1581578731548-c6d0f7624a5e?w=500"],
          category: "Maintenance",
          serviceType: "maintenance",
          isAvailable: true,
          createdAt: new Date('2024-01-08'),
          source: 'Mock'
        },
        {
          id: 'mock-6',
          title: "Tutoring Service (Mock)",
          description: "One-on-one tutoring for various subjects. Get help from experienced tutors for your academic needs.",
          price: 300,
          rating: 4.8,
          location: selectedCity ? `${selectedCity.name}, India` : "Delhi, India",
          images: ["https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500"],
          category: "Education",
          serviceType: "other",
          isAvailable: true,
          createdAt: new Date('2024-01-18'),
          source: 'Mock'
        }
      ];

      // Combine API data with mock data
      setServices([...apiServices, ...mockServices]);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceClick = (service) => {
    navigate(`/services/${service.id}`);
  };

  const handleBookService = (service) => {
    // Handle booking logic here
    console.log('Booking service:', service);
    // You can redirect to booking page or show booking modal
    navigate(`/services/${service.id}?action=book`);
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
            Loading services...
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
              Explore Essential Services
            </h1>
            <p className={`text-lg ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            } max-w-2xl mx-auto`}>
              Access laundry, cleaning, food delivery, and other essential services 
              right from your doorstep. {selectedCity && `Currently showing services in ${selectedCity.name}.`}
            </p>
          </motion.div>
          </div>
        </div>

        {/* Services Grid */}
      <ListingGrid
        items={services}
        type="services"
        onItemClick={handleServiceClick}
        onBookItem={handleBookService}
      />
    </div>
  );
};

export default Services;
