const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Payment types configuration
const PAYMENT_TYPES = {
  MESS_PLAN: 'mess_plan',
  ROOM_BOOKING: 'room_booking',
  SERVICE: 'service',
  SUBSCRIPTION: 'subscription'
};

// Currency configuration
const CURRENCY = 'INR';

// Payment status mapping
const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
};

/**
 * Create a Razorpay order
 * @param {Object} orderData - Order details
 * @param {number} orderData.amount - Amount in paise
 * @param {string} orderData.currency - Currency code
 * @param {string} orderData.receipt - Receipt ID
 * @param {Object} orderData.notes - Additional notes
 * @returns {Promise<Object>} Razorpay order response
 */
const createOrder = async (orderData) => {
  try {
    const options = {
      amount: orderData.amount, // Amount in paise
      currency: orderData.currency || CURRENCY,
      receipt: orderData.receipt,
      notes: orderData.notes || {}
    };

    const order = await razorpay.orders.create(options);
    return {
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        status: order.status,
        created_at: order.created_at
      }
    };
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    return {
      success: false,
      error: error.message || 'Failed to create order'
    };
  }
};

/**
 * Verify Razorpay payment signature
 * @param {string} razorpayOrderId - Razorpay order ID
 * @param {string} razorpayPaymentId - Razorpay payment ID
 * @param {string} razorpaySignature - Razorpay signature
 * @returns {boolean} Verification result
 */
const verifyPayment = (razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
  try {
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    return expectedSignature === razorpaySignature;
  } catch (error) {
    console.error('Payment verification error:', error);
    return false;
  }
};

/**
 * Verify webhook signature
 * @param {string} body - Webhook body
 * @param {string} signature - Webhook signature
 * @returns {boolean} Verification result
 */
const verifyWebhookSignature = (body, signature) => {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    return expectedSignature === signature;
  } catch (error) {
    console.error('Webhook verification error:', error);
    return false;
  }
};

/**
 * Get payment details from Razorpay
 * @param {string} paymentId - Razorpay payment ID
 * @returns {Promise<Object>} Payment details
 */
const getPaymentDetails = async (paymentId) => {
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    return {
      success: true,
      payment
    };
  } catch (error) {
    console.error('Get payment details error:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch payment details'
    };
  }
};

/**
 * Refund a payment
 * @param {string} paymentId - Razorpay payment ID
 * @param {number} amount - Refund amount in paise
 * @param {string} notes - Refund notes
 * @returns {Promise<Object>} Refund response
 */
const refundPayment = async (paymentId, amount, notes = '') => {
  try {
    const refund = await razorpay.payments.refund(paymentId, {
      amount: amount,
      notes: {
        reason: notes
      }
    });

    return {
      success: true,
      refund
    };
  } catch (error) {
    console.error('Refund error:', error);
    return {
      success: false,
      error: error.message || 'Failed to process refund'
    };
  }
};

/**
 * Get order details from Razorpay
 * @param {string} orderId - Razorpay order ID
 * @returns {Promise<Object>} Order details
 */
const getOrderDetails = async (orderId) => {
  try {
    const order = await razorpay.orders.fetch(orderId);
    return {
      success: true,
      order
    };
  } catch (error) {
    console.error('Get order details error:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch order details'
    };
  }
};

/**
 * Generate payment receipt data
 * @param {Object} payment - Payment document
 * @returns {Object} Receipt data
 */
const generateReceiptData = (payment) => {
  return {
    receiptNumber: payment.receipt,
    orderId: payment.orderId,
    paymentId: payment.paymentId,
    amount: payment.amount,
    currency: payment.currency,
    itemType: payment.itemType,
    itemName: payment.itemName,
    status: payment.status,
    paidAt: payment.paidAt,
    customerDetails: payment.customerDetails,
    billingAddress: payment.billingAddress,
    createdAt: payment.createdAt
  };
};

/**
 * Format amount for display
 * @param {number} amount - Amount in paise
 * @param {string} currency - Currency code
 * @returns {string} Formatted amount
 */
const formatAmount = (amount, currency = CURRENCY) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency
  }).format(amount / 100);
};

/**
 * Convert amount to paise
 * @param {number} amount - Amount in rupees
 * @returns {number} Amount in paise
 */
const convertToPaise = (amount) => {
  return Math.round(amount * 100);
};

/**
 * Convert amount from paise to rupees
 * @param {number} amount - Amount in paise
 * @returns {number} Amount in rupees
 */
const convertToRupees = (amount) => {
  return amount / 100;
};

module.exports = {
  razorpay,
  PAYMENT_TYPES,
  CURRENCY,
  PAYMENT_STATUS,
  createOrder,
  verifyPayment,
  verifyWebhookSignature,
  getPaymentDetails,
  refundPayment,
  getOrderDetails,
  generateReceiptData,
  formatAmount,
  convertToPaise,
  convertToRupees
};
