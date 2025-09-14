import React, { useState, useEffect } from 'react';
import { FaCreditCard, FaCheckCircle, FaTimesCircle, FaReceipt, FaDownload } from 'react-icons/fa';
import Button from '../ui/Button';
import Typography from '../ui/Typography';
import Card from '../ui/Card';
import RazorpayCheckout from './RazorpayCheckout';
import { useTheme } from '../../context/ThemeContext';

const PaymentModal = ({
  isOpen,
  onClose,
  onSuccess,
  onFailure,
  amount,
  type,
  relatedId,
  description,
  itemName,
  customerDetails
}) => {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, success, failed

  // Create payment order when modal opens
  useEffect(() => {
    if (isOpen && amount && type && relatedId) {
      createPaymentOrder();
    }
  }, [isOpen, amount, type, relatedId]);

  const createPaymentOrder = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          itemType: type,
          itemId: relatedId,
          amount: amount,
          customerDetails: customerDetails || {
            name: localStorage.getItem('userName') || '',
            email: localStorage.getItem('userEmail') || '',
            phone: localStorage.getItem('userPhone') || ''
          },
          notes: {
            description: description || `Payment for ${itemName || type}`
          }
        })
      });

      const result = await response.json();

      if (result.success) {
        setOrderData({
          ...result.order,
          itemType: type,
          itemId: relatedId,
          itemName: itemName || result.payment.itemName,
          description: description,
          customerDetails: customerDetails
        });
        setShowCheckout(true);
      } else {
        throw new Error(result.message || 'Failed to create payment order');
      }
    } catch (error) {
      console.error('Create order error:', error);
      setError(error.message || 'Failed to create payment order');
      onFailure && onFailure(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (result) => {
    setPaymentStatus('success');
    setShowCheckout(false);
    onSuccess && onSuccess(result);
  };

  const handlePaymentError = (error) => {
    setPaymentStatus('failed');
    setError(error);
    onFailure && onFailure(error);
  };

  const handleClose = () => {
    setOrderData(null);
    setShowCheckout(false);
    setError(null);
    setPaymentStatus('pending');
    onClose();
  };

  const downloadReceipt = async () => {
    if (!orderData?.orderId) return;

    try {
      const response = await fetch(`/api/payments/${orderData.orderId}/receipt`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const result = await response.json();

      if (result.success) {
        // Create and download receipt
        const receiptData = result.receipt;
        const receiptContent = generateReceiptContent(receiptData);
        
        const blob = new Blob([receiptContent], { type: 'text/html' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `receipt-${receiptData.receiptNumber}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Download receipt error:', error);
    }
  };

  const generateReceiptContent = (receiptData) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Payment Receipt - RoomNMeal</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 20px; }
          .receipt-details { margin: 20px 0; }
          .receipt-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 5px 0; border-bottom: 1px solid #eee; }
          .total { font-weight: bold; font-size: 18px; color: #2563eb; }
          .footer { margin-top: 30px; text-align: center; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>RoomNMeal</h1>
          <h2>Payment Receipt</h2>
        </div>
        <div class="receipt-details">
          <div class="receipt-row">
            <span>Receipt Number:</span>
            <span>${receiptData.receiptNumber}</span>
          </div>
          <div class="receipt-row">
            <span>Order ID:</span>
            <span>${receiptData.orderId}</span>
          </div>
          <div class="receipt-row">
            <span>Payment ID:</span>
            <span>${receiptData.paymentId}</span>
          </div>
          <div class="receipt-row">
            <span>Item:</span>
            <span>${receiptData.itemName}</span>
          </div>
          <div class="receipt-row">
            <span>Amount:</span>
            <span>₹${(receiptData.amount / 100).toLocaleString('en-IN')}</span>
          </div>
          <div class="receipt-row">
            <span>Status:</span>
            <span>${receiptData.status}</span>
          </div>
          <div class="receipt-row">
            <span>Paid At:</span>
            <span>${new Date(receiptData.paidAt).toLocaleString()}</span>
          </div>
        </div>
        <div class="footer">
          <p>Thank you for your payment!</p>
          <p>RoomNMeal - Your trusted accommodation partner</p>
        </div>
      </body>
      </html>
    `;
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <Card className="max-w-md w-full">
          <Card.Body>
            {loading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                <Typography variant="body" className="text-gray-600">
                  Creating payment order...
                </Typography>
              </div>
            )}

            {error && (
              <div className="text-center py-8">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <FaTimesCircle className="h-8 w-8 text-red-600" />
                </div>
                <Typography variant="heading-4" className="mb-2 text-red-600">
                  Payment Failed
                </Typography>
                <Typography variant="body" className="text-gray-600 mb-4">
                  {error}
                </Typography>
                <Button
                  variant="primary"
                  onClick={createPaymentOrder}
                  className="mr-2"
                >
                  Try Again
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleClose}
                >
                  Close
                </Button>
              </div>
            )}

            {paymentStatus === 'success' && (
              <div className="text-center py-8">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <FaCheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <Typography variant="heading-4" className="mb-2 text-green-600">
                  Payment Successful!
                </Typography>
                <Typography variant="body" className="text-gray-600 mb-4">
                  Your payment has been processed successfully.
                </Typography>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={downloadReceipt}
                    icon={<FaDownload className="h-4 w-4" />}
                  >
                    Download Receipt
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleClose}
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}

            {!loading && !error && paymentStatus === 'pending' && !showCheckout && (
              <div className="text-center py-8">
                <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <FaCreditCard className="h-8 w-8 text-primary-600" />
                </div>
                <Typography variant="heading-4" className="mb-2">
                  Ready to Pay
                </Typography>
                <Typography variant="body" className="text-gray-600 mb-4">
                  Amount: ₹{amount.toLocaleString('en-IN')}
                </Typography>
                <div className="flex space-x-2">
                  <Button
                    variant="primary"
                    onClick={() => setShowCheckout(true)}
                    disabled={!orderData}
                  >
                    Proceed to Payment
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleClose}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </Card.Body>
        </Card>
      </div>

      {/* Razorpay Checkout Modal */}
      {showCheckout && orderData && (
        <RazorpayCheckout
          orderData={orderData}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
          onClose={() => setShowCheckout(false)}
          isOpen={showCheckout}
        />
      )}
    </>
  );
};

export default PaymentModal;
