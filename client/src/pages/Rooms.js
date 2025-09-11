import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCity } from '../context/CityContext';
import { FaSearch, FaFilter, FaStar, FaMapMarkerAlt, FaBed, FaBath, FaWifi, FaParking, FaSnowflake, FaShower, FaHeart, FaShare, FaEye, FaUtensils, FaCheck, FaTimes } from 'react-icons/fa';
import { getMockData } from '../data/mockData';
import { PageLoading } from '../components/LoadingSpinner';

const Rooms = () => {
  const { selectedCity } = useCity();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: '',
    minRent: '',
    maxRent: '',
    propertyType: '',
    roomType: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, [selectedCity, filters]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let filteredRooms = getMockData.rooms() || [];
      
      // Apply city filter
      if (selectedCity) {
        filteredRooms = getMockData.getRoomsByCity(selectedCity.name) || [];
      }
      
      // Apply other filters
      if (filters.minRent) {
        filteredRooms = filteredRooms.filter(room => room.rent >= parseInt(filters.minRent));
      }
      if (filters.maxRent) {
        filteredRooms = filteredRooms.filter(room => room.rent <= parseInt(filters.maxRent));
      }
      if (filters.propertyType) {
        filteredRooms = filteredRooms.filter(room => room.propertyType === filters.propertyType);
      }
      if (filters.roomType) {
        filteredRooms = filteredRooms.filter(room => room.roomType === filters.roomType);
      }
      
      setRooms(filteredRooms);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const filteredRooms = rooms.filter(room => {
    if (filters.city && !room.address?.city?.toLowerCase().includes(filters.city.toLowerCase())) {
      return false;
    }
    if (filters.minRent && room.rent < parseInt(filters.minRent)) {
      return false;
    }
    if (filters.maxRent && room.rent > parseInt(filters.maxRent)) {
      return false;
    }
    if (filters.propertyType && room.propertyType !== filters.propertyType) {
      return false;
    }
    if (filters.roomType && room.roomType !== filters.roomType) {
      return false;
    }
    return true;
  });

  const getAmenityIcon = (amenity) => {
    const iconMap = {
      'WiFi': <FaWifi className="h-4 w-4" />,
      'Parking': <FaParking className="h-4 w-4" />,
      'AC': <FaSnowflake className="h-4 w-4" />,
      'Attached Bathroom': <FaShower className="h-4 w-4" />,
      'Food': <FaUtensils className="h-4 w-4" />,
    };
    return iconMap[amenity] || <FaCheck className="h-4 w-4" />;
  };

  if (loading) {
    return <PageLoading text="Loading amazing rooms for you..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 py-6">
      <div className="max-w-7xl mx-auto container-padding">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="heading-2 mb-3">
            Find Your Perfect Room
            {selectedCity && (
              <span className="block text-primary-600 text-xl mt-2">
                in {selectedCity.name}
              </span>
            )}
          </h1>
          <p className="text-body text-gray-600 max-w-2xl mx-auto">
            Discover verified accommodations near your college with modern amenities and comfortable living spaces
            {selectedCity && (
              <span className="block mt-2 text-sm text-primary-600">
                {selectedCity.collegesCount}+ colleges • {selectedCity.techCompaniesCount}+ companies
              </span>
            )}
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="md:hidden mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full btn-secondary flex items-center justify-center gap-2"
          >
            <FaFilter />
            <span>{showFilters ? 'Hide' : 'Show'} Filters</span>
          </button>
        </div>

        {/* Filters */}
        <div className={`bg-white rounded-2xl shadow-soft mb-8 overflow-hidden transition-all duration-300 ${
          showFilters ? 'max-h-96' : 'max-h-0 md:max-h-none'
        }`}>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="form-label">City</label>
                <input
                  type="text"
                  name="city"
                  value={filters.city}
                  onChange={handleFilterChange}
                  className="input-field"
                  placeholder="Enter city"
                />
              </div>
              <div>
                <label className="form-label">Min Rent</label>
                <input
                  type="number"
                  name="minRent"
                  value={filters.minRent}
                  onChange={handleFilterChange}
                  className="input-field"
                  placeholder="Min rent"
                />
              </div>
              <div>
                <label className="form-label">Max Rent</label>
                <input
                  type="number"
                  name="maxRent"
                  value={filters.maxRent}
                  onChange={handleFilterChange}
                  className="input-field"
                  placeholder="Max rent"
                />
              </div>
              <div>
                <label className="form-label">Property Type</label>
                <select
                  name="propertyType"
                  value={filters.propertyType}
                  onChange={handleFilterChange}
                  className="input-field"
                >
                  <option value="">All Types</option>
                  <option value="PG">PG</option>
                  <option value="Hostel">Hostel</option>
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                </select>
              </div>
              <div>
                <label className="form-label">Room Type</label>
                <select
                  name="roomType"
                  value={filters.roomType}
                  onChange={handleFilterChange}
                  className="input-field"
                >
                  <option value="">All Rooms</option>
                  <option value="Single">Single</option>
                  <option value="Double">Double</option>
                  <option value="Triple">Triple</option>
                  <option value="Quad">Quad</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <div className="text-sm text-gray-600 mb-2 sm:mb-0">
            Showing <span className="font-semibold text-primary-600">{filteredRooms.length}</span> of{' '}
            <span className="font-semibold text-gray-900">{rooms.length}</span> rooms
          </div>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200">
              <FaShare className="h-4 w-4 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200">
              <FaHeart className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Rooms Grid */}
        {filteredRooms.length > 0 ? (
          <div className="grid-auto-fit">
            {filteredRooms.map((room, index) => (
              <div 
                key={room._id} 
                className="card-hover overflow-hidden group animate-fade-in-up"
                style={{'--animation-delay': `${index * 0.1}s`}}
              >
                {/* Room Image */}
                <div className="relative h-56 bg-gray-200 overflow-hidden">
                  {room.images && room.images.length > 0 ? (
                    <img
                      src={room.images[0]}
                      alt={room.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <FaBed className="h-16 w-16" />
                    </div>
                  )}
                  
                  {/* Price Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/90 backdrop-blur-sm text-primary-600 px-3 py-2 rounded-xl text-sm font-bold shadow-soft">
                      ₹{room.rent.toLocaleString()}/month
                    </span>
                  </div>

                  {/* Quick Actions */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="bg-white/90 backdrop-blur-sm p-2 rounded-xl hover:bg-white transition-colors duration-200">
                      <FaHeart className="h-4 w-4 text-red-500" />
                    </button>
                    <button className="bg-white/90 backdrop-blur-sm p-2 rounded-xl hover:bg-white transition-colors duration-200">
                      <FaShare className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>

                  {/* Property Type Badge */}
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-primary-600 text-white px-3 py-1 rounded-lg text-xs font-medium">
                      {room.propertyType}
                    </span>
                  </div>
                </div>

                {/* Room Details */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                      {room.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {room.description?.substring(0, 120)}...
                  </p>
                  
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <FaMapMarkerAlt className="h-4 w-4 mr-2 text-primary-500" />
                    <span className="truncate">{room.address?.city}, {room.address?.state}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <FaBed className="h-4 w-4 mr-1 text-primary-500" />
                      <span>{room.roomType}</span>
                    </div>
                    <div className="flex items-center">
                      <FaBath className="h-4 w-4 mr-1 text-primary-500" />
                      <span>{room.propertyType}</span>
                    </div>
                  </div>
                  
                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(room.ratings?.average || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-600 ml-2">
                      ({room.ratings?.count || 0} reviews)
                    </span>
                  </div>
                  
                  {/* Amenities */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {room.amenities?.slice(0, 4).map((amenity, index) => (
                      <span key={index} className="flex items-center gap-1 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">
                        {getAmenityIcon(amenity)}
                        {amenity}
                      </span>
                    ))}
                    {room.amenities?.length > 4 && (
                      <span className="text-gray-500 text-xs flex items-center">
                        +{room.amenities.length - 4} more
                      </span>
                    )}
                  </div>
                  
                  {/* Action Button */}
                  <Link 
                    to={`/rooms/${room._id}`} 
                    className="btn-primary w-full text-center group"
                  >
                    <FaEye className="mr-2 group-hover:scale-110 transition-transform duration-200" />
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-soft p-12 max-w-md mx-auto">
              <FaSearch className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">No rooms found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your filters to find more rooms that match your preferences
              </p>
              <button
                onClick={() => setFilters({ city: '', minRent: '', maxRent: '', propertyType: '', roomType: '' })}
                className="btn-outline"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rooms; 