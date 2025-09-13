import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const PaymentModal = ({ 
  isOpen, 
  onClose, 
  amount, 
  type, 
  relatedId, 
  description, 
  onSuccess, 
  onFailure,
  bookingData,
  setBookingData,
  service
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('razorpay');

  useEffect(() => {
    if (isOpen) {
      // Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [isOpen]);

  const handlePayment = async () => {
    setLoading(true);
    setError('');

    try {
      // Fetch public key
      const keyResp = await axios.get(`${API_BASE_URL}/api/payments/public-key`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const publicKey = keyResp.data.key;

      // Create payment order
      const orderResponse = await axios.post(
        `${API_BASE_URL}/api/payments/create-order`,
        {
          amount,
          currency: 'INR',
          receipt: `${type}_${Date.now()}`,
          type,
          relatedId
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      const { order, transactionId } = orderResponse.data;

      // Initialize Razorpay
      const options = {
        key: publicKey || process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_dummy',
        amount: order.amount,
        currency: order.currency,
        name: 'RoomNMeal',
        description: description,
        order_id: order.id,
        handler: async (response) => {
          try {
            // Verify payment
            const verifyResponse = await axios.post(
              `${API_BASE_URL}/api/payments/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                transactionId
              },
              {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
              }
            );

            onSuccess(verifyResponse.data);
            onClose();
          } catch (error) {
            console.error('Payment verification failed:', error);
            setError('Payment verification failed. Please contact support.');
            onFailure(error);
          }
        },
        prefill: {
          name: localStorage.getItem('userName') || '',
          email: localStorage.getItem('userEmail') || '',
          contact: localStorage.getItem('userPhone') || ''
        },
        theme: {
          color: '#3B82F6'
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            onClose();
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('Payment creation failed:', error);
      setError('Payment creation failed. Please try again.');
      onFailure(error);
    } finally {
      setLoading(false);
    }
  };

  const handleWalletPayment = async () => {
    setLoading(true);
    setError('');

    try {
      // Check if user has sufficient wallet balance
      const balanceResponse = await axios.get(
        `${API_BASE_URL}/api/payments/wallet/balance`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      const { balance } = balanceResponse.data;

      if (balance < amount) {
        setError('Insufficient wallet balance. Please recharge your wallet.');
        return;
      }

      // Process wallet payment
      const paymentResponse = await axios.post(
        `${API_BASE_URL}/api/payments/wallet/pay`,
        {
          amount,
          type,
          relatedId,
          description
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      onSuccess(paymentResponse.data);
      onClose();

    } catch (error) {
      console.error('Wallet payment failed:', error);
      setError('Wallet payment failed. Please try again.');
      onFailure(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Payment</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-600 mb-2">Amount to pay:</p>
          <p className="text-2xl font-bold text-green-600">₹{amount}</p>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>

        {/* Service Booking Form */}
        {type === 'service_booking' && service && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Booking Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={bookingData?.quantity || 1}
                  onChange={(e) => setBookingData({...bookingData, quantity: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit
                </label>
                <select
                  value={bookingData?.unit || 'items'}
                  onChange={(e) => setBookingData({...bookingData, unit: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="items">Items</option>
                  <option value="kg">Kilograms</option>
                  <option value="hours">Hours</option>
                  <option value="room">Room</option>
                  <option value="trip">Trip</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Special Instructions
                </label>
                <textarea
                  value={bookingData?.specialInstructions || ''}
                  onChange={(e) => setBookingData({...bookingData, specialInstructions: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Any special requirements or instructions..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scheduled Date
                </label>
                <input
                  type="date"
                  value={bookingData?.scheduledDate || ''}
                  onChange={(e) => setBookingData({...bookingData, scheduledDate: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scheduled Time
                </label>
                <input
                  type="time"
                  value={bookingData?.scheduledTime || ''}
                  onChange={(e) => setBookingData({...bookingData, scheduledTime: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Address
                </label>
                <textarea
                  value={bookingData?.deliveryAddress || ''}
                  onChange={(e) => setBookingData({...bookingData, deliveryAddress: e.target.value})}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter delivery address..."
                />
              </div>
            </div>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Method
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="razorpay"
                checked={paymentMethod === 'razorpay'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2"
              />
              <span>Pay Online (Credit/Debit Card, UPI, Net Banking)</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="wallet"
                checked={paymentMethod === 'wallet'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2"
              />
              <span>Pay from Wallet</span>
            </label>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={paymentMethod === 'wallet' ? handleWalletPayment : handlePayment}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Processing...' : `Pay ₹${amount}`}
          </button>
        </div>

        <div className="mt-4 text-xs text-gray-500">
          <p>• Your payment is secured by Razorpay</p>
          <p>• You will receive a confirmation email</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal; 