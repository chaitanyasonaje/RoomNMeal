import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useCity } from '../context/CityContext';
import { API_ENDPOINTS } from '../config/api';
import ListingGrid from '../components/ListingGrid';

const Rooms = () => {
  const { isDark } = useTheme();
  const { selectedCity } = useCity();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRooms();
  }, [selectedCity]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from API first
      const params = new URLSearchParams();
      if (selectedCity) {
        params.append('city', selectedCity.name);
        params.append('state', selectedCity.state);
      }
      
      const queryString = params.toString();
      const url = queryString ? `${API_ENDPOINTS.ROOMS.LIST}?${queryString}` : API_ENDPOINTS.ROOMS.LIST;
      
      let apiRooms = [];
      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          // Transform API data to match component expectations
          apiRooms = data.rooms.map(room => ({
            id: room._id,
            title: room.title,
            description: room.description,
            price: room.price,
            rating: room.rating || 4.0,
            location: `${room.location.city}, ${room.location.state}`,
            images: room.images || ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500"],
            category: room.roomType,
            amenities: room.amenities || [],
            isAvailable: room.isAvailable,
            createdAt: new Date(room.createdAt),
            host: room.host,
            source: 'API'
          }));
        }
      } catch (apiError) {
        console.log('API not available, using mock data only');
      }
      
      // Mock data for rooms
      const mockRooms = [
        {
          id: 'mock-1',
          title: "Cozy PG near University (Mock)",
          description: "Furnished single room with all amenities, perfect for students. Located in a safe neighborhood with easy access to public transport.",
          price: 8000,
          rating: 4.5,
          location: selectedCity ? `${selectedCity.name}, India` : "Delhi, India",
          images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500"],
          amenities: ["WiFi", "AC", "Parking", "Meals", "Security"],
          roomType: "Single",
          propertyType: "PG",
          category: "PG",
          source: 'Mock',
          isAvailable: true,
          createdAt: new Date('2024-01-15')
        },
        {
          id: 'mock-2',
          title: "Modern Hostel Room",
          description: "Shared accommodation with modern facilities and study area. Perfect for students who prefer community living.",
          price: 6000,
          rating: 4.2,
          location: selectedCity ? `${selectedCity.name}, India` : "Delhi, India",
          images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500"],
          amenities: ["WiFi", "Parking", "Common Room", "Study Area"],
          roomType: "Double",
          propertyType: "Hostel",
          category: "Hostel",
          isAvailable: true,
          createdAt: new Date('2024-01-10')
        },
        {
          id: 3,
          title: "Luxury Apartment",
          description: "Spacious apartment with premium amenities and security. Ideal for students who want privacy and comfort.",
          price: 12000,
          rating: 4.8,
          location: selectedCity ? `${selectedCity.name}, India` : "Delhi, India",
          images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500"],
          amenities: ["WiFi", "AC", "Parking", "Gym", "Security", "Lift"],
          roomType: "Single",
          propertyType: "Apartment",
          category: "Apartment",
          isAvailable: true,
          createdAt: new Date('2024-01-20')
        },
        {
          id: 4,
          title: "Budget-Friendly PG",
          description: "Affordable accommodation with basic amenities. Great for students on a tight budget.",
          price: 4500,
          rating: 4.0,
          location: selectedCity ? `${selectedCity.name}, India` : "Delhi, India",
          images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500"],
          amenities: ["WiFi", "Parking"],
          roomType: "Triple",
          propertyType: "PG",
          category: "PG",
          isAvailable: true,
          createdAt: new Date('2024-01-05')
        },
        {
          id: 5,
          title: "Furnished House",
          description: "Complete house with multiple rooms, perfect for group of students. All furniture and appliances included.",
          price: 15000,
          rating: 4.6,
          location: selectedCity ? `${selectedCity.name}, India` : "Delhi, India",
          images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500"],
          amenities: ["WiFi", "AC", "Parking", "Kitchen", "Garden"],
          roomType: "Quad",
          propertyType: "House",
          category: "House",
          isAvailable: false,
          createdAt: new Date('2024-01-12')
        },
        {
          id: 6,
          title: "Student Hostel Premium",
          description: "Premium hostel accommodation with all modern amenities and 24/7 security.",
          price: 9000,
          rating: 4.4,
          location: selectedCity ? `${selectedCity.name}, India` : "Delhi, India",
          images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500"],
          amenities: ["WiFi", "AC", "Parking", "Common Room", "Cafeteria", "Security"],
          roomType: "Double",
          propertyType: "Hostel",
          category: "Hostel",
          isAvailable: true,
          createdAt: new Date('2024-01-18')
        },
        {
          id: 7,
          title: "Studio Apartment",
          description: "Compact studio apartment with all essential amenities. Perfect for single students.",
          price: 10000,
          rating: 4.3,
          location: selectedCity ? `${selectedCity.name}, India` : "Delhi, India",
          images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500"],
          amenities: ["WiFi", "AC", "Parking", "Kitchenette"],
          roomType: "Single",
          propertyType: "Apartment",
          category: "Apartment",
          isAvailable: true,
          createdAt: new Date('2024-01-08')
        },
        {
          id: 8,
          title: "Shared Apartment",
          description: "Shared apartment with individual rooms and common areas. Great for students who want privacy with social interaction.",
          price: 7000,
          rating: 4.1,
          location: selectedCity ? `${selectedCity.name}, India` : "Delhi, India",
          images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500"],
          amenities: ["WiFi", "AC", "Parking", "Common Kitchen", "Living Room"],
          roomType: "Double",
          propertyType: "Apartment",
          category: "Apartment",
          isAvailable: true,
          createdAt: new Date('2024-01-14')
        }
      ];

      // Combine API data with mock data
      setRooms([...apiRooms, ...mockRooms]);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoomClick = (room) => {
    navigate(`/rooms/${room.id}`);
  };

  const handleBookRoom = (room) => {
    // Handle booking logic here
    console.log('Booking room:', room);
    // You can redirect to booking page or show booking modal
    navigate(`/rooms/${room.id}?action=book`);
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
            Loading rooms...
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
              Find Your Perfect Room
            </h1>
            <p className={`text-lg ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            } max-w-2xl mx-auto`}>
              Discover comfortable and affordable accommodations tailored for students. 
              {selectedCity && ` Currently showing rooms in ${selectedCity.name}.`}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Rooms Grid */}
      <ListingGrid
        items={rooms}
        type="rooms"
        onItemClick={handleRoomClick}
        onBookItem={handleBookRoom}
      />
    </div>
  );
};

export default Rooms;