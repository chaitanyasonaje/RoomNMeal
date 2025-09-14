import React, { useEffect, useState } from 'react';
import { FaCreditCard, FaShieldAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Button from '../ui/Button';
import Typography from '../ui/Typography';
import Card from '../ui/Card';
import { useTheme } from '../../context/ThemeContext';

const RazorpayCheckout = ({
  orderData,
  onSuccess,
  onError,
  onClose,
  isOpen = false
}) => {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpay = () => {
      return new Promise((resolve, reject) => {
        // Check if Razorpay is already loaded
        if (window.Razorpay) {
          resolve();
          return;
        }

        // Check if script is already being loaded
        const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
        if (existingScript) {
          existingScript.addEventListener('load', resolve);
          existingScript.addEventListener('error', reject);
          return;
        }

        // Create and load script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const initializeRazorpay = async () => {
      try {
        await loadRazorpay();
        setRazorpayLoaded(true);
      } catch (error) {
        console.error('Failed to load Razorpay:', error);
        setError('Failed to load payment gateway');
      }
    };

    if (isOpen && !razorpayLoaded) {
      initializeRazorpay();
    }
  }, [isOpen, razorpayLoaded]);

  const handlePayment = async () => {
    if (!razorpayLoaded || !window.Razorpay) {
      setError('Payment gateway not loaded. Please try again.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'RoomNMeal',
        description: orderData.description || 'Payment for RoomNMeal services',
        image: '/favicon.ico',
        order_id: orderData.orderId,
        handler: async (response) => {
          try {
            // Call verify payment API
            const verifyResponse = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature
              })
            });

            const result = await verifyResponse.json();

            if (result.success) {
              onSuccess(result);
            } else {
              throw new Error(result.message || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            onError(error.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: orderData.customerDetails?.name || '',
          email: orderData.customerDetails?.email || '',
          contact: orderData.customerDetails?.phone || ''
        },
        notes: {
          itemType: orderData.itemType,
          itemId: orderData.itemId,
          ...orderData.notes
        },
        theme: {
          color: isDark ? '#3b82f6' : '#2563eb'
        },
        modal: {
          ondismiss: () => {
            onClose();
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment initiation error:', error);
      setError(error.message || 'Failed to initiate payment');
      onError(error.message || 'Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full">
        <Card.Body>
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
              <FaCreditCard className="h-8 w-8 text-primary-600" />
            </div>
            <Typography variant="heading-3" className="mb-2">
              Complete Payment
            </Typography>
            <Typography variant="body" className="text-gray-600">
              Secure payment powered by Razorpay
            </Typography>
          </div>

          {/* Payment Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <Typography variant="body-sm" className="text-gray-600">
                Item
              </Typography>
              <Typography variant="body-sm" className="font-medium">
                {orderData.itemName}
              </Typography>
            </div>
            <div className="flex justify-between items-center mb-2">
              <Typography variant="body-sm" className="text-gray-600">
                Amount
              </Typography>
              <Typography variant="body-sm" className="font-medium">
                ₹{(orderData.amount / 100).toLocaleString('en-IN')}
              </Typography>
            </div>
            <div className="flex justify-between items-center">
              <Typography variant="body-sm" className="text-gray-600">
                Order ID
              </Typography>
              <Typography variant="body-sm" className="font-mono text-xs">
                {orderData.orderId}
              </Typography>
            </div>
          </div>

          {/* Security Features */}
          <div className="flex items-center justify-center space-x-6 mb-6">
            <div className="flex items-center space-x-2">
              <FaShieldAlt className="h-4 w-4 text-green-600" />
              <Typography variant="caption" className="text-gray-600">
                SSL Secured
              </Typography>
            </div>
            <div className="flex items-center space-x-2">
              <FaCheckCircle className="h-4 w-4 text-green-600" />
              <Typography variant="caption" className="text-gray-600">
                PCI DSS
              </Typography>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <div className="flex items-center">
                <FaTimesCircle className="h-4 w-4 text-red-600 mr-2" />
                <Typography variant="body-sm" className="text-red-600">
                  {error}
                </Typography>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              variant="secondary"
              size="lg"
              className="flex-1"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="lg"
              className="flex-1"
              onClick={handlePayment}
              loading={loading}
              disabled={!razorpayLoaded || loading}
            >
              {loading ? 'Processing...' : 'Pay Now'}
            </Button>
          </div>

          {/* Payment Methods */}
          <div className="mt-4 text-center">
            <Typography variant="caption" className="text-gray-500">
              Pay with Credit/Debit Card, UPI, Net Banking, Wallets
            </Typography>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default RazorpayCheckout;
