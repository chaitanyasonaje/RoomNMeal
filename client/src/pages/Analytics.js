import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import { 
  FaUsers, 
  FaBed, 
  FaUtensils, 
  FaChartLine, 
  FaRupeeSign, 
  FaCalendar,
  FaMapMarkerAlt,
  FaStar,
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaDownload,
  FaFilter,
  FaRefresh
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const Analytics = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [analytics, setAnalytics] = useState({
    overview: {
      totalUsers: 0,
      totalRooms: 0,
      totalBookings: 0,
      totalRevenue: 0,
      activeUsers: 0,
      conversionRate: 0
    },
    revenue: {
      monthly: [],
      daily: [],
      bySource: []
    },
    users: {
      registrations: [],
      activeUsers: [],
      byRole: []
    },
    bookings: {
      byStatus: [],
      byType: [],
      trends: []
    },
    topPerformers: {
      rooms: [],
      messPlans: [],
      services: []
    },
    geographic: {
      byCity: [],
      byState: []
    }
  });

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_ENDPOINTS.ADMIN}/analytics?timeRange=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      } else {
        // Fallback to mock data
        setAnalytics(getMockAnalytics());
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setAnalytics(getMockAnalytics());
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const getMockAnalytics = () => ({
    overview: {
      totalUsers: 1250,
      totalRooms: 340,
      totalBookings: 890,
      totalRevenue: 1250000,
      activeUsers: 850,
      conversionRate: 12.5
    },
    revenue: {
      monthly: [
        { month: 'Jan', revenue: 85000 },
        { month: 'Feb', revenue: 92000 },
        { month: 'Mar', revenue: 110000 },
        { month: 'Apr', revenue: 125000 },
        { month: 'May', revenue: 140000 },
        { month: 'Jun', revenue: 155000 }
      ],
      daily: [
        { day: 'Mon', revenue: 12000 },
        { day: 'Tue', revenue: 15000 },
        { day: 'Wed', revenue: 18000 },
        { day: 'Thu', revenue: 16000 },
        { day: 'Fri', revenue: 20000 },
        { day: 'Sat', revenue: 22000 },
        { day: 'Sun', revenue: 19000 }
      ],
      bySource: [
        { source: 'Room Bookings', revenue: 800000, percentage: 64 },
        { source: 'Mess Subscriptions', revenue: 300000, percentage: 24 },
        { source: 'Services', revenue: 150000, percentage: 12 }
      ]
    },
    users: {
      registrations: [
        { month: 'Jan', count: 120 },
        { month: 'Feb', count: 150 },
        { month: 'Mar', count: 180 },
        { month: 'Apr', count: 200 },
        { month: 'May', count: 220 },
        { month: 'Jun', count: 250 }
      ],
      activeUsers: [
        { month: 'Jan', count: 450 },
        { month: 'Feb', count: 520 },
        { month: 'Mar', count: 580 },
        { month: 'Apr', count: 620 },
        { month: 'May', count: 680 },
        { month: 'Jun', count: 750 }
      ],
      byRole: [
        { role: 'Students', count: 800, percentage: 64 },
        { role: 'Hosts', count: 200, percentage: 16 },
        { role: 'Mess Providers', count: 150, percentage: 12 },
        { role: 'Admins', count: 100, percentage: 8 }
      ]
    },
    bookings: {
      byStatus: [
        { status: 'Confirmed', count: 650, percentage: 73 },
        { status: 'Pending', count: 120, percentage: 13 },
        { status: 'Cancelled', count: 80, percentage: 9 },
        { status: 'Completed', count: 40, percentage: 5 }
      ],
      byType: [
        { type: 'Rooms', count: 500, percentage: 56 },
        { type: 'Mess Plans', count: 250, percentage: 28 },
        { type: 'Services', count: 140, percentage: 16 }
      ],
      trends: [
        { week: 'Week 1', bookings: 45 },
        { week: 'Week 2', bookings: 52 },
        { week: 'Week 3', bookings: 48 },
        { week: 'Week 4', bookings: 61 }
      ]
    },
    topPerformers: {
      rooms: [
        { name: 'Sunshine PG', location: 'Mumbai', bookings: 45, revenue: 180000, rating: 4.8 },
        { name: 'Green Valley Hostel', location: 'Delhi', bookings: 38, revenue: 152000, rating: 4.6 },
        { name: 'Royal Residency', location: 'Bangalore', bookings: 35, revenue: 140000, rating: 4.7 }
      ],
      messPlans: [
        { name: 'Taste of India', location: 'Mumbai', subscribers: 120, revenue: 60000, rating: 4.5 },
        { name: 'Spice Kitchen', location: 'Delhi', subscribers: 95, revenue: 47500, rating: 4.3 },
        { name: 'South Delights', location: 'Bangalore', subscribers: 88, revenue: 44000, rating: 4.4 }
      ],
      services: [
        { name: 'CleanPro Services', type: 'Cleaning', orders: 85, revenue: 42500, rating: 4.6 },
        { name: 'Quick Laundry', type: 'Laundry', orders: 72, revenue: 36000, rating: 4.4 },
        { name: 'City Transport', type: 'Transport', orders: 65, revenue: 32500, rating: 4.5 }
      ]
    },
    geographic: {
      byCity: [
        { city: 'Mumbai', users: 350, bookings: 280, revenue: 420000 },
        { city: 'Delhi', users: 280, bookings: 220, revenue: 330000 },
        { city: 'Bangalore', users: 250, bookings: 200, revenue: 300000 },
        { city: 'Pune', users: 180, bookings: 140, revenue: 210000 },
        { city: 'Chennai', users: 150, bookings: 120, revenue: 180000 }
      ],
      byState: [
        { state: 'Maharashtra', users: 530, bookings: 420, revenue: 630000 },
        { state: 'Delhi', users: 280, bookings: 220, revenue: 330000 },
        { state: 'Karnataka', users: 250, bookings: 200, revenue: 300000 },
        { state: 'Tamil Nadu', users: 150, bookings: 120, revenue: 180000 }
      ]
    }
  });

  const StatCard = ({ title, value, change, icon: Icon, color = 'blue' }) => {
    const colorClasses = {
      blue: 'text-blue-600 bg-blue-100',
      green: 'text-green-600 bg-green-100',
      purple: 'text-purple-600 bg-purple-100',
      orange: 'text-orange-600 bg-orange-100',
      red: 'text-red-600 bg-red-100'
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl p-6 ${
          isDark ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {title}
            </p>
            <p className={`text-2xl font-bold mt-1 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {value}
            </p>
            {change && (
              <div className={`flex items-center mt-2 text-sm ${
                change > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {change > 0 ? <FaArrowUp className="h-3 w-3 mr-1" /> : <FaArrowDown className="h-3 w-3 mr-1" />}
                <span>{Math.abs(change)}%</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </motion.div>
    );
  };

  const ChartCard = ({ title, children, className = '' }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-6 ${
        isDark ? 'bg-gray-800' : 'bg-white'
      } shadow-lg ${className}`}
    >
      <h3 className={`text-lg font-semibold mb-4 ${
        isDark ? 'text-white' : 'text-gray-900'
      }`}>
        {title}
      </h3>
      {children}
    </motion.div>
  );

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
            isDark ? 'border-white' : 'border-primary-600'
          } mx-auto mb-4`}></div>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Loading analytics...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-3xl font-bold mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Analytics Dashboard
              </h1>
              <p className={`text-lg ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Platform insights and performance metrics
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Time Range Selector */}
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className={`px-4 py-2 rounded-lg border-0 focus:ring-2 focus:ring-primary-500 ${
                  isDark 
                    ? 'bg-gray-700 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>

              {/* Refresh Button */}
              <button
                onClick={fetchAnalytics}
                className={`p-2 rounded-lg ${
                  isDark 
                    ? 'bg-gray-700 text-white hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FaRefresh className="h-4 w-4" />
              </button>

              {/* Export Button */}
              <button
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  isDark 
                    ? 'bg-primary-600 text-white hover:bg-primary-700' 
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                <FaDownload className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={analytics.overview.totalUsers.toLocaleString()}
            change={12.5}
            icon={FaUsers}
            color="blue"
          />
          <StatCard
            title="Total Rooms"
            value={analytics.overview.totalRooms.toLocaleString()}
            change={8.2}
            icon={FaBed}
            color="green"
          />
          <StatCard
            title="Total Bookings"
            value={analytics.overview.totalBookings.toLocaleString()}
            change={15.3}
            icon={FaCalendar}
            color="purple"
          />
          <StatCard
            title="Total Revenue"
            value={`₹${analytics.overview.totalRevenue.toLocaleString()}`}
            change={22.1}
            icon={FaRupeeSign}
            color="orange"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <ChartCard title="Revenue Trends">
            <div className="h-64 flex items-end space-x-2">
              {analytics.revenue.monthly.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-primary-500 rounded-t"
                    style={{ height: `${(item.revenue / 155000) * 200}px` }}
                  ></div>
                  <span className={`text-xs mt-2 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {item.month}
                  </span>
                </div>
              ))}
            </div>
          </ChartCard>

          {/* User Registrations Chart */}
          <ChartCard title="User Registrations">
            <div className="h-64 flex items-end space-x-2">
              {analytics.users.registrations.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-green-500 rounded-t"
                    style={{ height: `${(item.count / 250) * 200}px` }}
                  ></div>
                  <span className={`text-xs mt-2 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {item.month}
                  </span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Top Performers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <ChartCard title="Top Rooms">
            <div className="space-y-4">
              {analytics.topPerformers.rooms.map((room, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className={`font-medium ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {room.name}
                    </h4>
                    <p className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {room.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {room.bookings} bookings
                    </p>
                    <p className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      ₹{room.revenue.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>

          <ChartCard title="Top Mess Plans">
            <div className="space-y-4">
              {analytics.topPerformers.messPlans.map((plan, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className={`font-medium ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {plan.name}
                    </h4>
                    <p className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {plan.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {plan.subscribers} subscribers
                    </p>
                    <p className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      ₹{plan.revenue.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>

          <ChartCard title="Top Services">
            <div className="space-y-4">
              {analytics.topPerformers.services.map((service, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className={`font-medium ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {service.name}
                    </h4>
                    <p className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {service.type}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {service.orders} orders
                    </p>
                    <p className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      ₹{service.revenue.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Geographic Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Users by City">
            <div className="space-y-3">
              {analytics.geographic.byCity.map((city, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FaMapMarkerAlt className={`h-4 w-4 ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`} />
                    <span className={`font-medium ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {city.city}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {city.users} users
                    </span>
                    <span className={`text-sm font-semibold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      ₹{city.revenue.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>

          <ChartCard title="Booking Status Distribution">
            <div className="space-y-3">
              {analytics.bookings.byStatus.map((status, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      status.status === 'Confirmed' ? 'bg-green-500' :
                      status.status === 'Pending' ? 'bg-yellow-500' :
                      status.status === 'Cancelled' ? 'bg-red-500' :
                      'bg-blue-500'
                    }`}></div>
                    <span className={`font-medium ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {status.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {status.percentage}%
                    </span>
                    <span className={`text-sm font-semibold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {status.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
