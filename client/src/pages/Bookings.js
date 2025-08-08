import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaFilter, FaSearch, FaCalendar, FaHome, FaUser } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import BookingCard from '../components/BookingCard';

const Bookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    search: ''
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('https://roomnmeal.onrender.com/api/bookings/my-bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(response.data.bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingUpdate = (updatedBooking) => {
    setBookings(prev => 
      prev.map(booking => 
        booking._id === updatedBooking._id ? updatedBooking : booking
      )
    );
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = filters.status === 'all' || booking.status === filters.status;
    const matchesSearch = filters.search === '' || 
      booking.room?.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
      (user?.role === 'student' ? booking.host?.name?.toLowerCase().includes(filters.search.toLowerCase()) : 
       booking.student?.name?.toLowerCase().includes(filters.search.toLowerCase()));
    
    return matchesStatus && matchesSearch;
  });

  const getStatusCounts = () => {
    const counts = { all: bookings.length };
    bookings.forEach(booking => {
      counts[booking.status] = (counts[booking.status] || 0) + 1;
    });
    return counts;
  };

  const statusCounts = getStatusCounts();

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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">My Bookings</h1>
          <p className="text-gray-600 text-base mt-1">
            {user?.role === 'student'
              ? 'Manage your room bookings and track their status'
              : 'Manage bookings for your properties'}
          </p>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status} className="bg-white rounded-lg shadow p-4 text-center">
              <div className={`text-2xl font-bold ${
                status === 'all' ? 'text-gray-900' :
                status === 'pending' ? 'text-yellow-600' :
                status === 'confirmed' ? 'text-blue-600' :
                status === 'active' ? 'text-green-600' :
                status === 'completed' ? 'text-gray-600' :
                'text-red-600'
              }`}>
                {count}
              </div>
              <div className="text-xs text-gray-600 capitalize mt-1">{status === 'all' ? 'Total' : status}</div>
            </div>
          ))}
        </div>
        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder={`Search ${user?.role === 'student' ? 'rooms or hosts' : 'students or rooms'}...`}
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="md:w-48">
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        {/* Bookings List */}
        <div className="space-y-6">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                userRole={user.role}
                onStatusUpdate={handleBookingUpdate}
              />
            ))
          ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <FaCalendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filters.status !== 'all' || filters.search
                  ? 'No bookings match your filters'
                  : 'No bookings yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {filters.status !== 'all' || filters.search
                  ? 'Try adjusting your search or filter criteria'
                  : user?.role === 'student'
                    ? 'Start by browsing available rooms and making your first booking'
                    : 'Bookings will appear here once students book your rooms'}
              </p>
              {user?.role === 'student' && (
                <a
                  href="/rooms"
                  className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <FaHome className="mr-2" />
                  Browse Rooms
                </a>
              )}
            </div>
          )}
        </div>
        {/* Quick Actions */}
        {user?.role === 'student' && bookings.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-4">
              <a
                href="/rooms"
                className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <FaHome className="mr-2" />
                Find More Rooms
              </a>
              <a
                href="/mess"
                className="flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
              >
                <FaUser className="mr-2" />
                Browse Mess Plans
              </a>
              <a
                href="/chat"
                className="flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
              >
                <FaCalendar className="mr-2" />
                Chat with Hosts
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings; 