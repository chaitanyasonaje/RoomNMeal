import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUsers, FaHome, FaUtensils, FaChartBar, FaCog, FaEye, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRooms: 0,
    totalBookings: 0,
    totalMessPlans: 0,
    pendingVerifications: 0,
    totalRevenue: 0
  });
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [messPlans, setMessPlans] = useState([]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, roomsRes, bookingsRes, messRes] = await Promise.all([
        axios.get('https://roomnmeal.onrender.com/api/admin/stats'),
        axios.get('https://roomnmeal.onrender.com/api/admin/users'),
        axios.get('https://roomnmeal.onrender.com/api/admin/rooms'),
        axios.get('https://roomnmeal.onrender.com/api/admin/bookings'),
        axios.get('https://roomnmeal.onrender.com/api/admin/mess-plans')
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data.users);
      setRooms(roomsRes.data.rooms);
      setBookings(bookingsRes.data.bookings);
      setMessPlans(messRes.data.messPlans);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyUser = async (userId, isVerified) => {
    try {
              await axios.put(`https://roomnmeal.onrender.com/api/admin/users/${userId}/verify`, { isVerified });
      setUsers(prev => prev.map(user => 
        user._id === userId ? { ...user, isVerified } : user
      ));
      toast.success(`User ${isVerified ? 'verified' : 'unverified'} successfully`);
    } catch (error) {
      toast.error('Failed to update user verification status');
    }
  };

  const handleToggleUserStatus = async (userId, isActive) => {
    try {
              await axios.put(`https://roomnmeal.onrender.com/api/admin/users/${userId}/status`, { isActive });
      setUsers(prev => prev.map(user => 
        user._id === userId ? { ...user, isActive } : user
      ));
      toast.success(`User ${isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleToggleRoomStatus = async (roomId, isActive) => {
    try {
              await axios.put(`https://roomnmeal.onrender.com/api/admin/rooms/${roomId}/status`, { isActive });
      setRooms(prev => prev.map(room => 
        room._id === roomId ? { ...room, isActive } : room
      ));
      toast.success(`Room ${isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      toast.error('Failed to update room status');
    }
  };

  const handleToggleMessStatus = async (messId, isActive) => {
    try {
              await axios.put(`https://roomnmeal.onrender.com/api/admin/mess-plans/${messId}/status`, { isActive });
      setMessPlans(prev => prev.map(mess => 
        mess._id === messId ? { ...mess, isActive } : mess
      ));
      toast.success(`Mess plan ${isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      toast.error('Failed to update mess plan status');
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'host': return 'bg-blue-100 text-blue-800';
      case 'messProvider': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your platform and monitor activity</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: FaChartBar },
              { id: 'users', name: 'Users', icon: FaUsers },
              { id: 'rooms', name: 'Rooms', icon: FaHome },
              { id: 'bookings', name: 'Bookings', icon: FaCog },
              { id: 'mess', name: 'Mess Plans', icon: FaUtensils }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <FaUsers className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Users</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <FaHome className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Rooms</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalRooms}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <FaCog className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-orange-100 rounded-lg">
                        <FaUtensils className="h-6 w-6 text-orange-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Mess Plans</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalMessPlans}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-yellow-100 rounded-lg">
                        <FaCheck className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Pending Verifications</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.pendingVerifications}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <FaChartBar className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                        <p className="text-2xl font-bold text-gray-900">₹{stats.totalRevenue}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">User Management</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verified</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                {user.profileImage ? (
                                  <img src={user.profileImage} alt={user.name} className="w-10 h-10 rounded-full" />
                                ) : (
                                  <FaUsers className="h-5 w-5 text-primary-600" />
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              user.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {user.isVerified ? 'Verified' : 'Pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleToggleUserStatus(user._id, !user.isActive)}
                                className={`px-3 py-1 rounded text-xs ${
                                  user.isActive 
                                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                }`}
                              >
                                {user.isActive ? 'Deactivate' : 'Activate'}
                              </button>
                              <button
                                onClick={() => handleVerifyUser(user._id, !user.isVerified)}
                                className={`px-3 py-1 rounded text-xs ${
                                  user.isVerified 
                                    ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
                                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                }`}
                              >
                                {user.isVerified ? 'Unverify' : 'Verify'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Rooms Tab */}
            {activeTab === 'rooms' && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Room Management</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Host</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {rooms.map((room) => (
                        <tr key={room._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                {room.images?.[0] ? (
                                  <img src={room.images[0]} alt={room.title} className="w-12 h-12 rounded-lg object-cover" />
                                ) : (
                                  <FaHome className="h-6 w-6 text-gray-400" />
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{room.title}</div>
                                <div className="text-sm text-gray-500">{room.location}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {room.host?.name || 'Unknown'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{room.price}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              room.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {room.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleToggleRoomStatus(room._id, !room.isActive)}
                              className={`px-3 py-1 rounded text-xs ${
                                room.isActive 
                                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                              }`}
                            >
                              {room.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Booking Management</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bookings.map((booking) => (
                        <tr key={booking._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">#{booking._id.slice(-8)}</div>
                            <div className="text-sm text-gray-500">{booking.room?.title}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {booking.user?.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{booking.amount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(booking.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Mess Plans Tab */}
            {activeTab === 'mess' && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Mess Plan Management</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {messPlans.map((plan) => (
                        <tr key={plan._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{plan.name}</div>
                            <div className="text-sm text-gray-500">{plan.description}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {plan.provider?.name || 'Unknown'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{plan.price}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              plan.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {plan.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleToggleMessStatus(plan._id, !plan.isActive)}
                              className={`px-3 py-1 rounded text-xs ${
                                plan.isActive 
                                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                              }`}
                            >
                              {plan.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 