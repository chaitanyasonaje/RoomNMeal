const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const { verifyWebhookSignature, PAYMENT_STATUS } = require('../utils/razorpay');

// Middleware to parse raw body for webhook verification
router.use(express.raw({ type: 'application/json' }));

// Razorpay webhook handler
router.post('/razorpay', async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const body = req.body;

    // Verify webhook signature
    const isVerified = verifyWebhookSignature(body, signature);

    if (!isVerified) {
      console.error('Webhook signature verification failed');
      return res.status(400).json({
        success: false,
        message: 'Invalid signature'
      });
    }

    const event = JSON.parse(body);
    console.log('Webhook received:', event.event);

    // Handle different webhook events
    switch (event.event) {
      case 'payment.captured':
        await handlePaymentCaptured(event);
        break;
      case 'payment.failed':
        await handlePaymentFailed(event);
        break;
      case 'order.paid':
        await handleOrderPaid(event);
        break;
      case 'refund.created':
        await handleRefundCreated(event);
        break;
      case 'refund.processed':
        await handleRefundProcessed(event);
        break;
      default:
        console.log('Unhandled webhook event:', event.event);
    }

    res.json({
      success: true,
      message: 'Webhook processed successfully'
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Webhook processing failed',
      error: error.message
    });
  }
});

// Handle payment captured event
async function handlePaymentCaptured(event) {
  try {
    const { payment } = event.payload.payment.entity;
    const orderId = payment.order_id;

    // Find payment record
    const paymentRecord = await Payment.findOne({
      razorpayOrderId: orderId,
      status: PAYMENT_STATUS.PENDING
    });

    if (!paymentRecord) {
      console.log('Payment record not found for order:', orderId);
      return;
    }

    // Update payment record
    paymentRecord.status = PAYMENT_STATUS.COMPLETED;
    paymentRecord.paymentId = payment.id;
    paymentRecord.razorpayPaymentId = payment.id;
    paymentRecord.paidAt = new Date(payment.created_at * 1000);
    paymentRecord.webhookData = event.payload;

    await paymentRecord.save();

    console.log('Payment captured and updated:', paymentRecord._id);

    // TODO: Send confirmation email/SMS
    // TODO: Update related booking/subscription status

  } catch (error) {
    console.error('Handle payment captured error:', error);
  }
}

// Handle payment failed event
async function handlePaymentFailed(event) {
  try {
    const { payment } = event.payload.payment.entity;
    const orderId = payment.order_id;

    // Find payment record
    const paymentRecord = await Payment.findOne({
      razorpayOrderId: orderId,
      status: PAYMENT_STATUS.PENDING
    });

    if (!paymentRecord) {
      console.log('Payment record not found for order:', orderId);
      return;
    }

    // Update payment record
    paymentRecord.status = PAYMENT_STATUS.FAILED;
    paymentRecord.razorpayPaymentId = payment.id;
    paymentRecord.webhookData = event.payload;

    await paymentRecord.save();

    console.log('Payment failed and updated:', paymentRecord._id);

    // TODO: Send failure notification
    // TODO: Release any reserved inventory

  } catch (error) {
    console.error('Handle payment failed error:', error);
  }
}

// Handle order paid event
async function handleOrderPaid(event) {
  try {
    const { order } = event.payload.order.entity;
    const orderId = order.id;

    // Find payment record
    const paymentRecord = await Payment.findOne({
      razorpayOrderId: orderId,
      status: PAYMENT_STATUS.PENDING
    });

    if (!paymentRecord) {
      console.log('Payment record not found for order:', orderId);
      return;
    }

    // Update payment record
    paymentRecord.status = PAYMENT_STATUS.COMPLETED;
    paymentRecord.paidAt = new Date(order.created_at * 1000);
    paymentRecord.webhookData = event.payload;

    await paymentRecord.save();

    console.log('Order paid and updated:', paymentRecord._id);

  } catch (error) {
    console.error('Handle order paid error:', error);
  }
}

// Handle refund created event
async function handleRefundCreated(event) {
  try {
    const { refund } = event.payload.refund.entity;
    const paymentId = refund.payment_id;

    // Find payment record
    const paymentRecord = await Payment.findOne({
      razorpayPaymentId: paymentId
    });

    if (!paymentRecord) {
      console.log('Payment record not found for payment:', paymentId);
      return;
    }

    // Update payment record
    paymentRecord.status = PAYMENT_STATUS.REFUNDED;
    paymentRecord.refundedAt = new Date(refund.created_at * 1000);
    paymentRecord.refundAmount = refund.amount;
    paymentRecord.webhookData = event.payload;

    await paymentRecord.save();

    console.log('Refund created and updated:', paymentRecord._id);

    // TODO: Send refund notification
    // TODO: Update related booking/subscription status

  } catch (error) {
    console.error('Handle refund created error:', error);
  }
}

// Handle refund processed event
async function handleRefundProcessed(event) {
  try {
    const { refund } = event.payload.refund.entity;
    const paymentId = refund.payment_id;

    // Find payment record
    const paymentRecord = await Payment.findOne({
      razorpayPaymentId: paymentId
    });

    if (!paymentRecord) {
      console.log('Payment record not found for payment:', paymentId);
      return;
    }

    // Update payment record
    paymentRecord.status = PAYMENT_STATUS.REFUNDED;
    paymentRecord.refundedAt = new Date(refund.processed_at * 1000);
    paymentRecord.refundAmount = refund.amount;
    paymentRecord.webhookData = event.payload;

    await paymentRecord.save();

    console.log('Refund processed and updated:', paymentRecord._id);

  } catch (error) {
    console.error('Handle refund processed error:', error);
  }
}

// Test webhook endpoint (for development)
router.post('/test', async (req, res) => {
  try {
    console.log('Test webhook received:', req.body);
    res.json({
      success: true,
      message: 'Test webhook received successfully'
    });
  } catch (error) {
    console.error('Test webhook error:', error);
    res.status(500).json({
      success: false,
      message: 'Test webhook failed',
      error: error.message
    });
  }
});

module.exports = router;
