import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaFilter, FaStar, FaMapMarkerAlt, FaBed, FaBath } from 'react-icons/fa';
import axios from 'axios';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: '',
    minRent: '',
    maxRent: '',
    propertyType: '',
    roomType: ''
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://roomnmeal.onrender.com/api/rooms');
      setRooms(response.data.rooms);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-5xl mx-auto px-2 sm:px-4 lg:px-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Find Your Perfect Room</h1>
          <p className="text-gray-600 text-base">Discover verified accommodations near your college</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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

        {/* Results */}
        <div className="mb-2 text-sm text-gray-600 text-center">
          Showing {filteredRooms.length} of {rooms.length} rooms
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRooms.map((room) => (
            <div key={room._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow flex flex-col">
              {/* Room Image */}
              <div className="h-44 bg-gray-200 relative">
                {room.images && room.images.length > 0 ? (
                  <img
                    src={room.images[0]}
                    alt={room.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <FaBed className="h-12 w-12" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className="bg-primary-600 text-white px-2 py-1 rounded text-xs font-medium">
                    ₹{room.rent}/month
                  </span>
                </div>
              </div>

              {/* Room Details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{room.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{room.description?.substring(0, 100)}...</p>
                <div className="flex items-center text-gray-500 text-xs mb-2">
                  <FaMapMarkerAlt className="h-4 w-4 mr-1" />
                  <span>{room.address?.city}, {room.address?.state}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                  <div className="flex items-center"><FaBed className="h-4 w-4 mr-1" />{room.roomType}</div>
                  <div className="flex items-center"><FaBath className="h-4 w-4 mr-1" />{room.propertyType}</div>
                </div>
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(room.ratings?.average || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                  <span className="text-xs text-gray-600 ml-2">({room.ratings?.count || 0} reviews)</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {room.amenities?.slice(0, 3).map((amenity, index) => (
                    <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">{amenity}</span>
                  ))}
                  {room.amenities?.length > 3 && (
                    <span className="text-gray-500 text-xs">+{room.amenities.length - 3} more</span>
                  )}
                </div>
                <Link to={`/rooms/${room._id}`} className="w-full btn-primary text-center mt-2">View Details</Link>
              </div>
            </div>
          ))}
        </div>

        {filteredRooms.length === 0 && (
          <div className="text-center py-12">
            <FaSearch className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No rooms found</h3>
            <p className="text-gray-600">Try adjusting your filters to find more rooms</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rooms; 