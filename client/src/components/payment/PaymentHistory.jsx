import React, { useState, useEffect } from 'react';
import { FaReceipt, FaDownload, FaFilter, FaSearch, FaCalendarAlt } from 'react-icons/fa';
import Button from '../ui/Button';
import Typography from '../ui/Typography';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Input from '../ui/Input';
import Layout from '../ui/Layout';
import { useTheme } from '../../context/ThemeContext';

const PaymentHistory = () => {
  const { isDark } = useTheme();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    itemType: '',
    startDate: '',
    endDate: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  });

  // Fetch payment history
  const fetchPayments = async (page = 1) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...filters
      });

      const response = await fetch(`/api/payments/history?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const result = await response.json();

      if (result.success) {
        setPayments(result.payments);
        setPagination(result.pagination);
      } else {
        throw new Error(result.message || 'Failed to fetch payment history');
      }
    } catch (error) {
      console.error('Fetch payments error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePageChange = (page) => {
    fetchPayments(page);
  };

  const downloadReceipt = async (paymentId) => {
    try {
      const response = await fetch(`/api/payments/${paymentId}/receipt`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const result = await response.json();

      if (result.success) {
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

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { variant: 'success', text: 'Completed' },
      pending: { variant: 'warning', text: 'Pending' },
      failed: { variant: 'error', text: 'Failed' },
      cancelled: { variant: 'error', text: 'Cancelled' },
      refunded: { variant: 'secondary', text: 'Refunded' }
    };

    const config = statusConfig[status] || { variant: 'secondary', text: status };
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const getItemTypeDisplay = (itemType) => {
    const typeMap = {
      mess_plan: 'Mess Plan',
      room_booking: 'Room Booking',
      service: 'Service',
      subscription: 'Subscription'
    };
    return typeMap[itemType] || itemType;
  };

  if (loading && payments.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <Typography variant="body" className="text-gray-600">
            Loading payment history...
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <Layout.Container>
      <div className="mb-6">
        <Typography variant="heading-2" className="mb-2">
          Payment History
        </Typography>
        <Typography variant="body" className="text-gray-600">
          View and manage your payment transactions
        </Typography>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              label="Search"
              placeholder="Search payments..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              icon={<FaSearch className="h-4 w-4" />}
            />

            <div>
              <label className="form-label">Status</label>
              <select
                className="form-input"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            <div>
              <label className="form-label">Item Type</label>
              <select
                className="form-input"
                value={filters.itemType}
                onChange={(e) => handleFilterChange('itemType', e.target.value)}
              >
                <option value="">All Types</option>
                <option value="mess_plan">Mess Plan</option>
                <option value="room_booking">Room Booking</option>
                <option value="service">Service</option>
                <option value="subscription">Subscription</option>
              </select>
            </div>

            <div>
              <label className="form-label">Date Range</label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  className="form-input flex-1"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                />
                <input
                  type="date"
                  className="form-input flex-1"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                />
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Payment List */}
      {error && (
        <Card className="mb-6">
          <Card.Body>
            <div className="text-center text-red-600">
              <Typography variant="body">{error}</Typography>
            </div>
          </Card.Body>
        </Card>
      )}

      {payments.length === 0 ? (
        <Card>
          <Card.Body>
            <div className="text-center py-12">
              <Typography variant="heading-4" className="mb-2 text-gray-500">
                No payments found
              </Typography>
              <Typography variant="body" className="text-gray-400">
                You haven't made any payments yet.
              </Typography>
            </div>
          </Card.Body>
        </Card>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => (
            <Card key={payment.id}>
              <Card.Body>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Typography variant="heading-4">
                        {payment.itemName}
                      </Typography>
                      {getStatusBadge(payment.status)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Type:</span> {getItemTypeDisplay(payment.itemType)}
                      </div>
                      <div>
                        <span className="font-medium">Amount:</span> ₹{(payment.amount / 100).toLocaleString('en-IN')}
                      </div>
                      <div>
                        <span className="font-medium">Date:</span> {new Date(payment.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="mt-2 text-xs text-gray-500">
                      <div>Order ID: {payment.orderId}</div>
                      {payment.paymentId && <div>Payment ID: {payment.paymentId}</div>}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {payment.status === 'completed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadReceipt(payment.id)}
                        icon={<FaDownload className="h-4 w-4" />}
                      >
                        Receipt
                      </Button>
                    )}
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.current - 1)}
            disabled={pagination.current === 1}
          >
            Previous
          </Button>
          
          <span className="px-4 py-2 text-sm text-gray-600">
            Page {pagination.current} of {pagination.pages}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.current + 1)}
            disabled={pagination.current === pagination.pages}
          >
            Next
          </Button>
        </div>
      )}
    </Layout.Container>
  );
};

export default PaymentHistory;
