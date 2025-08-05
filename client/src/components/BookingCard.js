import React, { useState } from 'react';
import { FaCalendar, FaMapMarkerAlt, FaUser, FaPhone, FaEnvelope, FaStar, FaCheckCircle, FaTimesCircle, FaClock, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';
import axios from 'axios';

const BookingCard = ({ booking, userRole, onStatusUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'confirmed': return 'text-blue-600 bg-blue-100';
      case 'active': return 'text-green-600 bg-green-100';
      case 'completed': return 'text-gray-600 bg-gray-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FaClock className="w-4 h-4" />;
      case 'confirmed': return <FaCheckCircle className="w-4 h-4" />;
      case 'active': return <FaCheckCircle className="w-4 h-4" />;
      case 'completed': return <FaCheckCircle className="w-4 h-4" />;
      case 'cancelled': return <FaTimesCircle className="w-4 h-4" />;
      default: return <FaClock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateDuration = () => {
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    const diffTime = Math.abs(checkOut - checkIn);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleStatusUpdate = async (newStatus) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`https://roomnmeal-backend.onrender.com/api/bookings/${booking._id}/status`, {
        status: newStatus,
        reason: newStatus === 'cancelled' ? cancelReason : undefined
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Booking status updated successfully!');
      onStatusUpdate(response.data.booking);
      setShowCancelModal(false);
      setCancelReason('');
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error(error.response?.data?.message || 'Failed to update booking status');
    } finally {
      setLoading(false);
    }
  };

  const canUpdateStatus = () => {
    if (userRole === 'admin') return true;
    
    if (userRole === 'host') {
      return ['pending', 'confirmed', 'active'].includes(booking.status);
    }
    
    if (userRole === 'student') {
      return ['pending', 'confirmed'].includes(booking.status);
    }
    
    return false;
  };

  const getActionButtons = () => {
    const buttons = [];

    if (userRole === 'host') {
      if (booking.status === 'pending') {
        buttons.push(
          <button
            key="confirm"
            onClick={() => handleStatusUpdate('confirmed')}
            disabled={loading}
            className="btn-primary text-sm px-3 py-1"
          >
            {loading ? <FaSpinner className="animate-spin" /> : 'Confirm'}
          </button>
        );
      }
      if (booking.status === 'confirmed') {
        buttons.push(
          <button
            key="activate"
            onClick={() => handleStatusUpdate('active')}
            disabled={loading}
            className="btn-primary text-sm px-3 py-1"
          >
            {loading ? <FaSpinner className="animate-spin" /> : 'Activate'}
          </button>
        );
      }
      if (booking.status === 'active') {
        buttons.push(
          <button
            key="complete"
            onClick={() => handleStatusUpdate('completed')}
            disabled={loading}
            className="btn-primary text-sm px-3 py-1"
          >
            {loading ? <FaSpinner className="animate-spin" /> : 'Complete'}
          </button>
        );
      }
    }

    if (['pending', 'confirmed'].includes(booking.status)) {
      buttons.push(
        <button
          key="cancel"
          onClick={() => setShowCancelModal(true)}
          disabled={loading}
          className="btn-outline text-sm px-3 py-1 border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
        >
          Cancel
        </button>
      );
    }

    return buttons;
  };

  const otherUser = userRole === 'student' ? booking.host : booking.student;

  return (
    <>
      <div className="card hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {booking.room.title}
            </h3>
            <p className="text-gray-600 text-sm flex items-center">
              <FaMapMarkerAlt className="mr-1" />
              {booking.room.address?.street}, {booking.room.address?.city}
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getStatusColor(booking.status)}`}>
            {getStatusIcon(booking.status)}
            <span className="capitalize">{booking.status}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <FaCalendar className="mr-2" />
              <span>Check-in: {formatDate(booking.checkIn)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <FaCalendar className="mr-2" />
              <span>Check-out: {formatDate(booking.checkOut)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <FaUser className="mr-2" />
              <span>Duration: {calculateDuration()} days</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <FaUser className="mr-2" />
              <span>{userRole === 'student' ? 'Host' : 'Student'}: {otherUser.name}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <FaPhone className="mr-2" />
              <span>{otherUser.phone}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <FaEnvelope className="mr-2" />
              <span>{otherUser.email}</span>
            </div>
          </div>
        </div>

        {/* Additional Services */}
        {booking.additionalServices && (
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Additional Services:</h4>
            <div className="flex flex-wrap gap-2">
              {booking.additionalServices.meals?.included && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  Meals
                </span>
              )}
              {booking.additionalServices.laundry?.included && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  Laundry
                </span>
              )}
              {booking.additionalServices.tea?.included && (
                <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                  Tea Service
                </span>
              )}
            </div>
          </div>
        )}

        {/* Special Requests */}
        {booking.specialRequests && (
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-1">Special Requests:</h4>
            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
              {booking.specialRequests}
            </p>
          </div>
        )}

        {/* Payment Info */}
        <div className="border-t pt-4 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Amount:</span>
            <span className="text-lg font-semibold text-primary-600">₹{booking.totalAmount}</span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-sm text-gray-600">Payment Status:</span>
            <span className={`text-sm px-2 py-1 rounded ${
              booking.paymentStatus === 'completed' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {booking.paymentStatus}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        {canUpdateStatus() && (
          <div className="flex space-x-2">
            {getActionButtons()}
          </div>
        )}

        {/* Cancellation Info */}
        {booking.status === 'cancelled' && booking.cancellationReason && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
            <h4 className="font-medium text-red-800 mb-1">Cancellation Reason:</h4>
            <p className="text-sm text-red-700">{booking.cancellationReason}</p>
            {booking.refundAmount > 0 && (
              <p className="text-sm text-red-700 mt-1">
                Refund Amount: ₹{booking.refundAmount}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cancel Booking</h3>
            <div className="mb-4">
              <label className="form-label">Cancellation Reason:</label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="input-field h-24 resize-none"
                placeholder="Please provide a reason for cancellation..."
                required
              />
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowCancelModal(false)}
                className="btn-secondary flex-1"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={() => handleStatusUpdate('cancelled')}
                className="btn-primary flex-1 bg-red-600 hover:bg-red-700"
                disabled={loading || !cancelReason.trim()}
              >
                {loading ? <FaSpinner className="animate-spin" /> : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingCard; 