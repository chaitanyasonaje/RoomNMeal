import React, { useState, useEffect } from 'react';
import { FaDownload, FaFilter, FaSearch, FaEye, FaRefresh } from 'react-icons/fa';
import Button from '../ui/Button';
import Typography from '../ui/Typography';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Input from '../ui/Input';
import Layout from '../ui/Layout';
import { useTheme } from '../../context/ThemeContext';

const PaymentManagement = () => {
  const { isDark } = useTheme();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    itemType: '',
    userId: '',
    startDate: '',
    endDate: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  });
  const [stats, setStats] = useState({
    totalAmount: 0,
    totalCount: 0,
    completedAmount: 0,
    completedCount: 0,
    pendingCount: 0,
    failedCount: 0
  });

  // Fetch payments
  const fetchPayments = async (page = 1) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...filters
      });

      const response = await fetch(`/api/admin/payments?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const result = await response.json();

      if (result.success) {
        setPayments(result.payments);
        setPagination(result.pagination);
        setStats(result.stats || stats);
      } else {
        throw new Error(result.message || 'Failed to fetch payments');
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
            Loading payments...
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <Layout.Container>
      <div className="mb-6">
        <Typography variant="heading-2" className="mb-2">
          Payment Management
        </Typography>
        <Typography variant="body" className="text-gray-600">
          Manage and monitor all payment transactions
        </Typography>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <Card.Body>
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body-sm" className="text-gray-600 mb-1">
                  Total Revenue
                </Typography>
                <Typography variant="heading-3" className="text-green-600">
                  ₹{(stats.totalAmount / 100).toLocaleString('en-IN')}
                </Typography>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <FaDownload className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body-sm" className="text-gray-600 mb-1">
                  Total Payments
                </Typography>
                <Typography variant="heading-3" className="text-blue-600">
                  {stats.totalCount}
                </Typography>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FaEye className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body-sm" className="text-gray-600 mb-1">
                  Completed
                </Typography>
                <Typography variant="heading-3" className="text-green-600">
                  {stats.completedCount}
                </Typography>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <FaRefresh className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body-sm" className="text-gray-600 mb-1">
                  Pending
                </Typography>
                <Typography variant="heading-3" className="text-yellow-600">
                  {stats.pendingCount}
                </Typography>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <FaFilter className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
              <label className="form-label">User ID</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter user ID"
                value={filters.userId}
                onChange={(e) => handleFilterChange('userId', e.target.value)}
              />
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

      {/* Error Message */}
      {error && (
        <Card className="mb-6">
          <Card.Body>
            <div className="text-center text-red-600">
              <Typography variant="body">{error}</Typography>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Payments Table */}
      {payments.length === 0 ? (
        <Card>
          <Card.Body>
            <div className="text-center py-12">
              <Typography variant="heading-4" className="mb-2 text-gray-500">
                No payments found
              </Typography>
              <Typography variant="body" className="text-gray-400">
                No payments match your current filters.
              </Typography>
            </div>
          </Card.Body>
        </Card>
      ) : (
        <Card>
          <Card.Body>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Payment ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">User</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Item</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-mono text-sm text-gray-600">
                          {payment.orderId}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            {payment.customerDetails?.name || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {payment.customerDetails?.email || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            {payment.itemName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {getItemTypeDisplay(payment.itemType)}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-gray-900">
                          ₹{(payment.amount / 100).toLocaleString('en-IN')}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(payment.status)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-600">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-3 px-4">
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card.Body>
        </Card>
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

export default PaymentManagement;
