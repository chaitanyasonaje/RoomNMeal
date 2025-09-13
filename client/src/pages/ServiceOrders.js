import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import { 
  FaSearch, 
  FaFilter, 
  FaCalendar, 
  FaClock, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaMessage, 
  FaStar, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaExclamationCircle,
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus,
  FaSortAmountDown
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const ServiceOrders = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, sortBy, sortOrder]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);
      
      const response = await fetch(`${API_ENDPOINTS.SERVICES}/orders/my-orders?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      } else {
        // Fallback to mock data
        const mockOrders = [
          {
            _id: 'order1',
            service: {
              _id: 'service1',
              name: 'Professional Laundry Service',
              type: 'laundry',
              images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400']
            },
            provider: {
              _id: 'provider1',
              name: 'CleanPro Services',
              profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
              phone: '+91 98765 43210'
            },
            orderDetails: {
              quantity: 5,
              unit: 'kg',
              specialInstructions: 'Please handle delicate items with care',
              pickupAddress: {
                address: '123 Main Street, Mumbai',
                city: 'Mumbai',
                state: 'Maharashtra',
                pincode: '400001'
              },
              deliveryAddress: {
                address: '123 Main Street, Mumbai',
                city: 'Mumbai',
                state: 'Maharashtra',
                pincode: '400001'
              },
              scheduledDate: new Date('2024-01-20'),
              scheduledTime: '10:00 AM'
            },
            pricing: {
              unitPrice: 150,
              quantity: 5,
              subtotal: 750,
              tax: 0,
              discount: 0,
              total: 750,
              currency: 'INR'
            },
            status: 'confirmed',
            payment: {
              method: 'wallet',
              status: 'completed',
              paidAt: new Date('2024-01-19')
            },
            timeline: {
              orderedAt: new Date('2024-01-19'),
              confirmedAt: new Date('2024-01-19'),
              startedAt: null,
              completedAt: null,
              cancelledAt: null
            },
            communication: {
              messages: [
                {
                  sender: 'provider1',
                  message: 'Thank you for your order! We will pick up your clothes at the scheduled time.',
                  timestamp: new Date('2024-01-19'),
                  type: 'text'
                }
              ],
              lastMessageAt: new Date('2024-01-19')
            },
            rating: {
              rating: null,
              comment: null,
              createdAt: null
            },
            createdAt: new Date('2024-01-19')
          },
          {
            _id: 'order2',
            service: {
              _id: 'service2',
              name: 'Room Cleaning Service',
              type: 'cleaning',
              images: ['https://images.unsplash.com/photo-1581578731548-c8d0f7624a5e?w=400']
            },
            provider: {
              _id: 'provider2',
              name: 'Sparkle Clean',
              profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
              phone: '+91 98765 43211'
            },
            orderDetails: {
              quantity: 1,
              unit: 'room',
              specialInstructions: 'Focus on kitchen and bathroom areas',
              pickupAddress: null,
              deliveryAddress: {
                address: '456 Park Avenue, Mumbai',
                city: 'Mumbai',
                state: 'Maharashtra',
                pincode: '400002'
              },
              scheduledDate: new Date('2024-01-18'),
              scheduledTime: '2:00 PM'
            },
            pricing: {
              unitPrice: 200,
              quantity: 1,
              subtotal: 200,
              tax: 0,
              discount: 0,
              total: 200,
              currency: 'INR'
            },
            status: 'completed',
            payment: {
              method: 'razorpay',
              status: 'completed',
              paidAt: new Date('2024-01-17')
            },
            timeline: {
              orderedAt: new Date('2024-01-17'),
              confirmedAt: new Date('2024-01-17'),
              startedAt: new Date('2024-01-18'),
              completedAt: new Date('2024-01-18'),
              cancelledAt: null
            },
            communication: {
              messages: [
                {
                  sender: 'provider2',
                  message: 'Your room cleaning has been completed successfully!',
                  timestamp: new Date('2024-01-18'),
                  type: 'text'
                }
              ],
              lastMessageAt: new Date('2024-01-18')
            },
            rating: {
              rating: 5,
              comment: 'Excellent service! Very thorough cleaning.',
              createdAt: new Date('2024-01-18')
            },
            createdAt: new Date('2024-01-17')
          }
        ];
        setOrders(mockOrders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load service orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.SERVICES}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setOrders(prev => prev.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        ));
        toast.success('Order status updated successfully');
      } else {
        throw new Error('Status update failed');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update order status');
    }
  };

  const handleRateService = async (orderId, rating, comment) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.SERVICES}/orders/${orderId}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ rating, comment })
      });

      if (response.ok) {
        setOrders(prev => prev.map(order => 
          order._id === orderId ? { 
            ...order, 
            rating: { rating, comment, createdAt: new Date() }
          } : order
        ));
        toast.success('Service rated successfully');
      } else {
        throw new Error('Rating failed');
      }
    } catch (error) {
      console.error('Error rating service:', error);
      toast.error('Failed to rate service');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'confirmed': return 'text-blue-600 bg-blue-100';
      case 'in_progress': return 'text-purple-600 bg-purple-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      case 'refunded': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FaClock className="h-4 w-4" />;
      case 'confirmed': return <FaCheckCircle className="h-4 w-4" />;
      case 'in_progress': return <FaExclamationCircle className="h-4 w-4" />;
      case 'completed': return <FaCheckCircle className="h-4 w-4" />;
      case 'cancelled': return <FaTimesCircle className="h-4 w-4" />;
      case 'refunded': return <FaTimesCircle className="h-4 w-4" />;
      default: return <FaClock className="h-4 w-4" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.provider.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
            Loading service orders...
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
          <h1 className={`text-3xl font-bold mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Service Orders
          </h1>
          <p className={`text-lg ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Manage and track your service orders
          </p>
        </div>

        {/* Filters and Search */}
        <div className={`rounded-2xl p-6 mb-8 ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border-0 focus:ring-2 focus:ring-primary-500 ${
                  isDark 
                    ? 'bg-gray-700 text-white placeholder-gray-400' 
                    : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`px-4 py-2 rounded-lg border-0 focus:ring-2 focus:ring-primary-500 ${
                isDark 
                  ? 'bg-gray-700 text-white' 
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`px-4 py-2 rounded-lg border-0 focus:ring-2 focus:ring-primary-500 ${
                isDark 
                  ? 'bg-gray-700 text-white' 
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <option value="createdAt">Order Date</option>
              <option value="status">Status</option>
              <option value="total">Amount</option>
            </select>

            {/* Sort Order */}
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg border-0 focus:ring-2 focus:ring-primary-500 ${
                isDark 
                  ? 'bg-gray-700 text-white hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              <FaSortAmountDown className="h-4 w-4" />
              <span>{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
            </button>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <div className={`text-center py-12 ${
              isDark ? 'bg-gray-800' : 'bg-white'
            } rounded-2xl`}>
              <FaCalendar className={`h-16 w-16 mx-auto mb-4 ${
                isDark ? 'text-gray-600' : 'text-gray-400'
              }`} />
              <h3 className={`text-xl font-semibold mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                No service orders found
              </h3>
              <p className={`text-lg ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {searchQuery ? 'Try adjusting your search criteria' : 'Start by booking a service'}
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl p-6 ${
                  isDark ? 'bg-gray-800' : 'bg-white'
                } shadow-lg hover:shadow-xl transition-shadow`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Service Info */}
                  <div className="lg:col-span-2">
                    <div className="flex items-start space-x-4">
                      <img
                        src={order.service.images[0]}
                        alt={order.service.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className={`text-xl font-semibold mb-2 ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          {order.service.name}
                        </h3>
                        <div className="flex items-center space-x-4 mb-2">
                          <div className="flex items-center space-x-1">
                            <FaMapMarkerAlt className={`h-4 w-4 ${
                              isDark ? 'text-gray-400' : 'text-gray-600'
                            }`} />
                            <span className={`text-sm ${
                              isDark ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              {order.orderDetails.deliveryAddress?.city || 'Pickup Service'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FaCalendar className={`h-4 w-4 ${
                              isDark ? 'text-gray-400' : 'text-gray-600'
                            }`} />
                            <span className={`text-sm ${
                              isDark ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              {formatDate(order.orderDetails.scheduledDate)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FaClock className={`h-4 w-4 ${
                              isDark ? 'text-gray-400' : 'text-gray-600'
                            }`} />
                            <span className={`text-sm ${
                              isDark ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              {order.orderDetails.scheduledTime}
                            </span>
                          </div>
                        </div>
                        <div className={`text-sm ${
                          isDark ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          Quantity: {order.orderDetails.quantity} {order.orderDetails.unit}
                        </div>
                        {order.orderDetails.specialInstructions && (
                          <div className={`text-sm mt-2 ${
                            isDark ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            <strong>Instructions:</strong> {order.orderDetails.specialInstructions}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="space-y-4">
                    {/* Status */}
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Status
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="capitalize">{order.status.replace('_', ' ')}</span>
                      </span>
                    </div>

                    {/* Amount */}
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Total Amount
                      </span>
                      <span className={`text-lg font-bold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        ₹{order.pricing.total.toLocaleString()}
                      </span>
                    </div>

                    {/* Payment Status */}
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Payment
                      </span>
                      <span className={`text-sm ${
                        order.payment.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {order.payment.status}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderModal(true);
                        }}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        <FaEye className="h-4 w-4" />
                        <span>View Details</span>
                      </button>
                      
                      {order.status === 'completed' && !order.rating.rating && (
                        <button
                          onClick={() => {
                            const rating = prompt('Rate this service (1-5):');
                            const comment = prompt('Add a comment (optional):');
                            if (rating && rating >= 1 && rating <= 5) {
                              handleRateService(order._id, parseInt(rating), comment);
                            }
                          }}
                          className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                        >
                          <FaStar className="h-4 w-4" />
                          <span>Rate</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      {showOrderModal && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setShowOrderModal(false)}
          onStatusUpdate={handleStatusUpdate}
          onRateService={handleRateService}
        />
      )}
    </div>
  );
};

// Order Detail Modal Component
const OrderDetailModal = ({ order, onClose, onStatusUpdate, onRateService }) => {
  const { isDark } = useTheme();
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleRateSubmit = () => {
    if (rating >= 1 && rating <= 5) {
      onRateService(order._id, rating, comment);
      setShowRatingModal(false);
      setRating(0);
      setComment('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-2xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Order Details
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg ${
                isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>

          {/* Order Content */}
          <div className="space-y-6">
            {/* Service Info */}
            <div className="flex items-start space-x-4">
              <img
                src={order.service.images[0]}
                alt={order.service.name}
                className="w-24 h-24 rounded-lg object-cover"
              />
              <div>
                <h3 className={`text-xl font-semibold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {order.service.name}
                </h3>
                <div className={`text-sm ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Order ID: {order._id}
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className={`font-semibold mb-3 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Order Information
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Quantity
                    </span>
                    <span className={`text-sm ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {order.orderDetails.quantity} {order.orderDetails.unit}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Scheduled Date
                    </span>
                    <span className={`text-sm ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {new Date(order.orderDetails.scheduledDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Scheduled Time
                    </span>
                    <span className={`text-sm ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {order.orderDetails.scheduledTime}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className={`font-semibold mb-3 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Pricing
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Unit Price
                    </span>
                    <span className={`text-sm ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      ₹{order.pricing.unitPrice}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Subtotal
                    </span>
                    <span className={`text-sm ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      ₹{order.pricing.subtotal}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span className={`text-sm ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      Total
                    </span>
                    <span className={`text-sm ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      ₹{order.pricing.total}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Provider Info */}
            <div>
              <h4 className={`font-semibold mb-3 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Service Provider
              </h4>
              <div className="flex items-center space-x-3">
                <img
                  src={order.provider.profileImage}
                  alt={order.provider.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className={`font-medium ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {order.provider.name}
                  </div>
                  <div className={`text-sm ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {order.provider.phone}
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            {order.communication.messages.length > 0 && (
              <div>
                <h4 className={`font-semibold mb-3 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Messages
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {order.communication.messages.map((message, index) => (
                    <div key={index} className={`p-3 rounded-lg ${
                      isDark ? 'bg-gray-700' : 'bg-gray-100'
                    }`}>
                      <div className={`text-sm ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {message.message}
                      </div>
                      <div className={`text-xs mt-1 ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {new Date(message.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-4">
              {order.status === 'completed' && !order.rating.rating && (
                <button
                  onClick={() => setShowRatingModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  <FaStar className="h-4 w-4" />
                  <span>Rate Service</span>
                </button>
              )}
              
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
          <div className={`max-w-md w-full rounded-2xl p-6 ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className={`text-xl font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Rate Service
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Rating (1-5)
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`text-2xl ${
                        star <= rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      <FaStar />
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Comment (Optional)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 rounded-lg border-0 focus:ring-2 focus:ring-primary-500 ${
                    isDark 
                      ? 'bg-gray-700 text-white placeholder-gray-400' 
                      : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Share your experience..."
                />
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={handleRateSubmit}
                  disabled={rating < 1}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 transition-colors"
                >
                  Submit Rating
                </button>
                <button
                  onClick={() => setShowRatingModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceOrders;
