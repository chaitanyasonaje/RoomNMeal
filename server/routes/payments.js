const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { auth } = require('../middlewares/auth');
const Payment = require('../models/Payment');
const User = require('../models/User');
const MessPlan = require('../models/MessPlan');
const Room = require('../models/Room');
const Service = require('../models/Service');
const Booking = require('../models/Booking');
const MessSubscription = require('../models/MessSubscription');
const {
  createOrder,
  verifyPayment,
  getPaymentDetails,
  refundPayment,
  generateReceiptData,
  convertToPaise,
  convertToRupees,
  formatAmount,
  PAYMENT_TYPES,
  CURRENCY
} = require('../utils/razorpay');

// Validation middleware
const validatePaymentRequest = [
  body('itemType').isIn(Object.values(PAYMENT_TYPES)).withMessage('Invalid item type'),
  body('itemId').isMongoId().withMessage('Invalid item ID'),
  body('amount').isNumeric().isFloat({ min: 1 }).withMessage('Amount must be at least 1'),
  body('customerDetails.name').notEmpty().withMessage('Customer name is required'),
  body('customerDetails.email').isEmail().withMessage('Valid email is required'),
  body('customerDetails.phone').isMobilePhone('en-IN').withMessage('Valid phone number is required')
];

// Create payment order
router.post('/create-order', auth, validatePaymentRequest, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { itemType, itemId, amount, customerDetails, billingAddress, notes } = req.body;
    const userId = req.user.id;

    // Convert amount to paise
    const amountInPaise = convertToPaise(amount);

    // Validate item exists and get details
    let itemDetails;
    switch (itemType) {
      case PAYMENT_TYPES.MESS_PLAN:
        itemDetails = await MessPlan.findById(itemId);
        if (!itemDetails) {
          return res.status(404).json({
            success: false,
            message: 'Mess plan not found'
          });
        }
        break;
      case PAYMENT_TYPES.ROOM_BOOKING:
        itemDetails = await Room.findById(itemId);
        if (!itemDetails) {
          return res.status(404).json({
            success: false,
            message: 'Room not found'
          });
        }
        break;
      case PAYMENT_TYPES.SERVICE:
        itemDetails = await Service.findById(itemId);
        if (!itemDetails) {
          return res.status(404).json({
            success: false,
            message: 'Service not found'
          });
        }
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid item type'
        });
    }

    // Generate receipt ID
    const receipt = `receipt_${itemType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create Razorpay order
    const orderResult = await createOrder({
      amount: amountInPaise,
      currency: CURRENCY,
      receipt: receipt,
      notes: {
        itemType,
        itemId: itemId.toString(),
        userId: userId.toString(),
        ...notes
      }
    });

    if (!orderResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create payment order',
        error: orderResult.error
      });
    }

    // Save payment record to database
    const payment = new Payment({
      userId,
      orderId: orderResult.order.id,
      amount: amountInPaise,
      currency: CURRENCY,
      itemType,
      itemId,
      itemName: itemDetails.name || itemDetails.title,
      receipt,
      notes: notes || '',
      customerDetails,
      billingAddress: billingAddress || {},
      razorpayOrderId: orderResult.order.id,
      status: 'pending'
    });

    await payment.save();

    res.json({
      success: true,
      message: 'Order created successfully',
      order: {
        id: orderResult.order.id,
        amount: orderResult.order.amount,
        currency: orderResult.order.currency,
        receipt: orderResult.order.receipt,
        key: process.env.RAZORPAY_KEY_ID
      },
      payment: {
        id: payment._id,
        orderId: payment.orderId,
        amount: payment.amount,
        itemType: payment.itemType,
        itemName: payment.itemName
      }
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Verify payment
router.post('/verify', auth, async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;
    const userId = req.user.id;

    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing required payment details'
      });
    }

    // Find payment record
    const payment = await Payment.findOne({
      orderId,
      userId,
      status: 'pending'
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }

    // Verify payment signature
    const isVerified = verifyPayment(orderId, paymentId, signature);

    if (!isVerified) {
      // Update payment status to failed
      payment.status = 'failed';
      payment.razorpayPaymentId = paymentId;
      payment.razorpaySignature = signature;
      await payment.save();

      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }

    // Get payment details from Razorpay
    const paymentDetails = await getPaymentDetails(paymentId);
    
    if (!paymentDetails.success) {
      payment.status = 'failed';
      payment.razorpayPaymentId = paymentId;
      payment.razorpaySignature = signature;
      await payment.save();

      return res.status(500).json({
        success: false,
        message: 'Failed to fetch payment details'
      });
    }

    // Update payment record
    payment.status = 'completed';
    payment.paymentId = paymentId;
    payment.razorpayPaymentId = paymentId;
    payment.razorpaySignature = signature;
    payment.paidAt = new Date();
    payment.webhookData = paymentDetails.payment;

    await payment.save();

    // Create booking/subscription based on item type
    let bookingResult;
    switch (payment.itemType) {
      case PAYMENT_TYPES.MESS_PLAN:
        bookingResult = await createMessSubscription(payment);
        break;
      case PAYMENT_TYPES.ROOM_BOOKING:
        bookingResult = await createRoomBooking(payment);
        break;
      case PAYMENT_TYPES.SERVICE:
        bookingResult = await createServiceOrder(payment);
        break;
    }

    res.json({
      success: true,
      message: 'Payment verified successfully',
      payment: {
        id: payment._id,
        orderId: payment.orderId,
        paymentId: payment.paymentId,
        amount: payment.amount,
        status: payment.status,
        paidAt: payment.paidAt,
        itemType: payment.itemType,
        itemName: payment.itemName
      },
      booking: bookingResult
    });

  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get payment history
router.get('/history', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, itemType, startDate, endDate } = req.query;
    const userId = req.user.id;

    const filter = { userId };
    
    if (status) filter.status = status;
    if (itemType) filter.itemType = itemType;
    
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const payments = await Payment.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('itemId', 'name title');

    const total = await Payment.countDocuments(filter);

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
    console.error('Get payment history error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get payment details
router.get('/:paymentId', auth, async (req, res) => {
  try {
    const { paymentId } = req.params;
    const userId = req.user.id;

    const payment = await Payment.findOne({
      _id: paymentId,
      userId
    }).populate('itemId', 'name title description');

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
        itemDetails: payment.itemId
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

// Generate receipt
router.get('/:paymentId/receipt', auth, async (req, res) => {
  try {
    const { paymentId } = req.params;
    const userId = req.user.id;

    const payment = await Payment.findOne({
      _id: paymentId,
      userId,
      status: 'completed'
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found or not completed'
      });
    }

    const receiptData = generateReceiptData(payment);

    res.json({
      success: true,
      receipt: receiptData
    });

  } catch (error) {
    console.error('Generate receipt error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Helper functions for creating bookings/subscriptions
async function createMessSubscription(payment) {
  try {
    const messPlan = await MessPlan.findById(payment.itemId);
    if (!messPlan) throw new Error('Mess plan not found');

    const subscription = new MessSubscription({
      userId: payment.userId,
      messPlanId: payment.itemId,
      paymentId: payment._id,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      status: 'active',
      amount: payment.amount
    });

    await subscription.save();
    return { type: 'mess_subscription', id: subscription._id };
  } catch (error) {
    console.error('Create mess subscription error:', error);
    throw error;
  }
}

async function createRoomBooking(payment) {
  try {
    const room = await Room.findById(payment.itemId);
    if (!room) throw new Error('Room not found');

    const booking = new Booking({
      userId: payment.userId,
      roomId: payment.itemId,
      paymentId: payment._id,
      checkIn: new Date(),
      checkOut: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      status: 'confirmed',
      amount: payment.amount
    });

    await booking.save();
    return { type: 'room_booking', id: booking._id };
  } catch (error) {
    console.error('Create room booking error:', error);
    throw error;
  }
}

async function createServiceOrder(payment) {
  try {
    const service = await Service.findById(payment.itemId);
    if (!service) throw new Error('Service not found');

    // Create service order (you may need to create a ServiceOrder model)
    const serviceOrder = {
      userId: payment.userId,
      serviceId: payment.itemId,
      paymentId: payment._id,
      status: 'confirmed',
      amount: payment.amount,
      createdAt: new Date()
    };

    // For now, return the service order data
    // You can implement ServiceOrder model if needed
    return { type: 'service_order', data: serviceOrder };
  } catch (error) {
    console.error('Create service order error:', error);
    throw error;
  }
}

module.exports = router;