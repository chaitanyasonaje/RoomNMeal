import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHome, FaUtensils, FaComments, FaPlus, FaEye, FaEdit, FaCalendar, FaUsers, FaMoneyBillWave } from 'react-icons/fa';
import axios from 'axios';
import BookingCard from '../components/BookingCard';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    bookings: { total: 0, pending: 0, confirmed: 0, active: 0, completed: 0 },
    subscriptions: { total: 0, active: 0, paused: 0 },
    rooms: 0,
    messPlans: 0,
    earnings: 0
  });
  const [bookings, setBookings] = useState([]);
  const [recentSubscriptions, setRecentSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      if (user?.role === 'student') {
        const [bookingsRes, subscriptionsRes, statsRes] = await Promise.all([
          axios.get('/api/bookings/my-bookings', { headers }),
          axios.get('/api/mess/my-subscriptions', { headers }),
          axios.get('/api/bookings/stats/dashboard', { headers })
        ]);
        
        setBookings(bookingsRes.data.bookings);
        setRecentSubscriptions(subscriptionsRes.data.subscriptions.slice(0, 3));
        setStats({
          ...stats,
          bookings: statsRes.data.stats,
          subscriptions: { total: subscriptionsRes.data.subscriptions.length }
        });
      } else if (user?.role === 'host') {
        const [bookingsRes, roomsRes, statsRes] = await Promise.all([
          axios.get('/api/bookings/my-bookings', { headers }),
          axios.get('/api/rooms/host/my-rooms', { headers }),
          axios.get('/api/bookings/stats/dashboard', { headers })
        ]);
        
        setBookings(bookingsRes.data.bookings);
        setStats({
          ...stats,
          bookings: statsRes.data.stats,
          rooms: roomsRes.data.rooms.length
        });
      } else if (user?.role === 'messProvider') {
        const [plansRes, subscriptionsRes] = await Promise.all([
          axios.get('/api/mess/plans', { headers }),
          axios.get('/api/mess/my-subscriptions', { headers })
        ]);
        
        setRecentSubscriptions(subscriptionsRes.data.subscriptions.slice(0, 3));
        setStats({
          ...stats,
          messPlans: plansRes.data.plans.length,
          subscriptions: { total: subscriptionsRes.data.subscriptions.length }
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
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
    fetchDashboardData(); // Refresh stats
  };

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    let greeting = '';
    
    if (hour < 12) greeting = 'Good morning';
    else if (hour < 18) greeting = 'Good afternoon';
    else greeting = 'Good evening';
    
    return `${greeting}, ${user?.name}!`;
  };

  const getQuickActions = () => {
    switch (user?.role) {
      case 'student':
        return [
          { title: 'Find Rooms', icon: FaHome, link: '/rooms', color: 'bg-blue-500' },
          { title: 'Mess Services', icon: FaUtensils, link: '/mess', color: 'bg-green-500' },
          { title: 'Chat', icon: FaComments, link: '/chat', color: 'bg-purple-500' }
        ];
      case 'host':
        return [
          { title: 'Add Room', icon: FaPlus, link: '/rooms/add', color: 'bg-blue-500' },
          { title: 'My Rooms', icon: FaEye, link: '/rooms/host', color: 'bg-green-500' },
          { title: 'Chat', icon: FaComments, link: '/chat', color: 'bg-purple-500' }
        ];
      case 'messProvider':
        return [
          { title: 'Add Mess Plan', icon: FaPlus, link: '/mess/add', color: 'bg-blue-500' },
          { title: 'My Plans', icon: FaEye, link: '/mess/provider', color: 'bg-green-500' },
          { title: 'Chat', icon: FaComments, link: '/chat', color: 'bg-purple-500' }
        ];
      default:
        return [];
    }
  };

  const getStatsCards = () => {
    if (user?.role === 'student') {
      return [
        {
          title: 'Total Bookings',
          value: stats.bookings.total,
          icon: FaCalendar,
          color: 'bg-blue-500',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-600'
        },
        {
          title: 'Active Subscriptions',
          value: stats.subscriptions.total,
          icon: FaUtensils,
          color: 'bg-green-500',
          bgColor: 'bg-green-100',
          textColor: 'text-green-600'
        },
        {
          title: 'Pending Bookings',
          value: stats.bookings.pending,
          icon: FaCalendar,
          color: 'bg-yellow-500',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-600'
        },
        {
          title: 'Active Bookings',
          value: stats.bookings.active,
          icon: FaHome,
          color: 'bg-purple-500',
          bgColor: 'bg-purple-100',
          textColor: 'text-purple-600'
        }
      ];
    } else if (user?.role === 'host') {
      return [
        {
          title: 'Total Rooms',
          value: stats.rooms,
          icon: FaHome,
          color: 'bg-blue-500',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-600'
        },
        {
          title: 'Total Bookings',
          value: stats.bookings.total,
          icon: FaCalendar,
          color: 'bg-green-500',
          bgColor: 'bg-green-100',
          textColor: 'text-green-600'
        },
        {
          title: 'Pending Bookings',
          value: stats.bookings.pending,
          icon: FaCalendar,
          color: 'bg-yellow-500',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-600'
        },
        {
          title: 'Active Bookings',
          value: stats.bookings.active,
          icon: FaUsers,
          color: 'bg-purple-500',
          bgColor: 'bg-purple-100',
          textColor: 'text-purple-600'
        }
      ];
    } else if (user?.role === 'messProvider') {
      return [
        {
          title: 'Mess Plans',
          value: stats.messPlans,
          icon: FaUtensils,
          color: 'bg-green-500',
          bgColor: 'bg-green-100',
          textColor: 'text-green-600'
        },
        {
          title: 'Active Subscriptions',
          value: stats.subscriptions.total,
          icon: FaUsers,
          color: 'bg-blue-500',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-600'
        }
      ];
    }
    return [];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{getWelcomeMessage()}</h1>
          <p className="text-gray-600 mt-2">Here's what's happening with your account</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {getStatsCards().map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {getQuickActions().map((action, index) => (
                <Link
                  key={index}
                  to={action.link}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className={`p-3 rounded-full ${action.color}`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="ml-3 font-medium text-gray-900">{action.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Bookings */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
              <Link to="/bookings" className="text-primary-600 hover:text-primary-700 text-sm">
                View all →
              </Link>
            </div>
            <div className="p-6">
              {bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.slice(0, 3).map((booking) => (
                    <BookingCard
                      key={booking._id}
                      booking={booking}
                      userRole={user.role}
                      onStatusUpdate={handleBookingUpdate}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FaCalendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No bookings yet</p>
                  {user?.role === 'student' && (
                    <Link to="/rooms" className="mt-2 inline-block text-primary-600 hover:text-primary-700">
                      Find rooms to book →
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Recent Subscriptions or Additional Info */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                {user?.role === 'student' ? 'Recent Subscriptions' : 'Recent Activity'}
              </h2>
              <Link to={user?.role === 'student' ? '/mess' : '/dashboard'} className="text-primary-600 hover:text-primary-700 text-sm">
                View all →
              </Link>
            </div>
            <div className="p-6">
              {user?.role === 'student' ? (
                recentSubscriptions.length > 0 ? (
                  <div className="space-y-4">
                    {recentSubscriptions.map((subscription) => (
                      <div key={subscription._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{subscription.messPlan?.planName}</p>
                          <p className="text-sm text-gray-600">₹{subscription.totalAmount}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          subscription.status === 'active' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {subscription.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FaUtensils className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No subscriptions yet</p>
                    <Link to="/mess" className="mt-2 inline-block text-primary-600 hover:text-primary-700">
                      Browse mess plans →
                    </Link>
                  </div>
                )
              ) : (
                <div className="text-center py-8">
                  <FaMoneyBillWave className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Earnings and analytics coming soon</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 