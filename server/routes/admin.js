const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth');
const Payment = require('../models/Payment');
const User = require('../models/User');
const { convertToRupees } = require('../utils/razorpay');

// Admin middleware - check if user is admin
const adminAuth = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
  next();
};

// Get all payments with filters and pagination
router.get('/payments', auth, adminAuth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      itemType, 
      userId, 
      startDate, 
      endDate, 
      search 
    } = req.query;

    const filter = {};
    
    if (status) filter.status = status;
    if (itemType) filter.itemType = itemType;
    if (userId) filter.userId = userId;
    
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    if (search) {
      filter.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { paymentId: { $regex: search, $options: 'i' } },
        { itemName: { $regex: search, $options: 'i' } },
        { receipt: { $regex: search, $options: 'i' } }
      ];
    }

    const payments = await Payment.find(filter)
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Payment.countDocuments(filter);

    // Get payment statistics
    const stats = await Payment.getStats();

    res.json({
      success: true,
      payments: payments.map(payment => ({
        id: payment._id,
        orderId: payment.orderId,
        paymentId: payment.paymentId,
        amount: payment.amount,
        currency: payment.currency,
        itemType: payment.itemType,
        itemName: payment.itemName,
        status: payment.status,
        paidAt: payment.paidAt,
        createdAt: payment.createdAt,
        receipt: payment.receipt,
        customerDetails: payment.customerDetails,
        userId: payment.userId
      })),
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      },
      stats: {
        totalAmount: stats.totalAmount,
        totalCount: stats.totalCount,
        completedAmount: stats.completedAmount,
        completedCount: stats.completedCount,
        pendingCount: stats.pendingCount,
        failedCount: stats.failedCount
      }
    });

  } catch (error) {
    console.error('Get admin payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get payment statistics
router.get('/stats', auth, adminAuth, async (req, res) => {
  try {
    const { period = 'all' } = req.query;
    
    let dateFilter = {};
    if (period === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      dateFilter.createdAt = { $gte: today };
    } else if (period === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      dateFilter.createdAt = { $gte: weekAgo };
    } else if (period === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      dateFilter.createdAt = { $gte: monthAgo };
    }

    const stats = await Payment.getStats(null, null, null, dateFilter);

    res.json({
      success: true,
      stats: {
        totalAmount: stats.totalAmount,
        totalCount: stats.totalCount,
        completedAmount: stats.completedAmount,
        completedCount: stats.completedCount,
        pendingCount: stats.pendingCount,
        failedCount: stats.failedCount,
        formattedTotalAmount: convertToRupees(stats.totalAmount),
        formattedCompletedAmount: convertToRupees(stats.completedAmount)
      }
    });

  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get user payment history (admin view)
router.get('/users/:userId/payments', auth, adminAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const payments = await Payment.find({ userId })
      .populate('itemId', 'name title')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Payment.countDocuments({ userId });

    res.json({
      success: true,
      payments: payments.map(payment => ({
        id: payment._id,
        orderId: payment.orderId,
        paymentId: payment.paymentId,
        amount: payment.amount,
        currency: payment.currency,
        itemType: payment.itemType,
        itemName: payment.itemName,
        status: payment.status,
        paidAt: payment.paidAt,
        createdAt: payment.createdAt,
        receipt: payment.receipt
      })),
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Get user payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get payment details (admin view)
router.get('/payments/:paymentId', auth, adminAuth, async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findById(paymentId)
      .populate('userId', 'name email phone')
      .populate('itemId', 'name title description');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.json({
      success: true,
      payment: {
        id: payment._id,
        orderId: payment.orderId,
        paymentId: payment.paymentId,
        amount: payment.amount,
        currency: payment.currency,
        itemType: payment.itemType,
        itemName: payment.itemName,
        status: payment.status,
        paidAt: payment.paidAt,
        createdAt: payment.createdAt,
        receipt: payment.receipt,
        customerDetails: payment.customerDetails,
        billingAddress: payment.billingAddress,
        userId: payment.userId,
        itemId: payment.itemId,
        webhookData: payment.webhookData
      }
    });

  } catch (error) {
    console.error('Get payment details error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Export payments data
router.get('/payments/export', auth, adminAuth, async (req, res) => {
  try {
    const { format = 'csv', startDate, endDate, status, itemType } = req.query;

    const filter = {};
    
    if (status) filter.status = status;
    if (itemType) filter.itemType = itemType;
    
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const payments = await Payment.find(filter)
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });

    if (format === 'csv') {
      const csvData = generateCSV(payments);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=payments.csv');
      res.send(csvData);
    } else {
      res.json({
        success: true,
        payments: payments.map(payment => ({
          id: payment._id,
          orderId: payment.orderId,
          paymentId: payment.paymentId,
          amount: payment.amount,
          currency: payment.currency,
          itemType: payment.itemType,
          itemName: payment.itemName,
          status: payment.status,
          paidAt: payment.paidAt,
          createdAt: payment.createdAt,
          customerName: payment.userId?.name || 'N/A',
          customerEmail: payment.userId?.email || 'N/A',
          customerPhone: payment.userId?.phone || 'N/A'
        }))
      });
    }

  } catch (error) {
    console.error('Export payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Generate CSV data
function generateCSV(payments) {
  const headers = [
    'Payment ID',
    'Order ID',
    'Amount',
    'Currency',
    'Item Type',
    'Item Name',
    'Status',
    'Customer Name',
    'Customer Email',
    'Customer Phone',
    'Created At',
    'Paid At'
  ];

  const rows = payments.map(payment => [
    payment._id,
    payment.orderId,
    payment.amount / 100, // Convert from paise to rupees
    payment.currency,
    payment.itemType,
    payment.itemName,
    payment.status,
    payment.userId?.name || 'N/A',
    payment.userId?.email || 'N/A',
    payment.userId?.phone || 'N/A',
    payment.createdAt.toISOString(),
    payment.paidAt ? payment.paidAt.toISOString() : 'N/A'
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');

  return csvContent;
}

module.exports = router;