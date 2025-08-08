const express = require('express');
const Razorpay = require('razorpay');
const { auth } = require('../middlewares/auth');
const crypto = require('crypto');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Booking = require('../models/Booking');
const MessSubscription = require('../models/MessSubscription');

const router = express.Router();

// Initialize Razorpay with fallback for development
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret'
});

// Create payment order
router.post('/create-order', auth, async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, type, relatedId } = req.body;

    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt,
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);

    // Create transaction record
    const transaction = new Transaction({
      user: req.user._id,
      type,
      amount,
      currency,
      status: 'pending',
      paymentMethod: 'razorpay',
      razorpayOrderId: order.id,
      description: `Payment for ${type}`,
      relatedBooking: type === 'room_booking' ? relatedId : undefined,
      relatedSubscription: type === 'mess_subscription' ? relatedId : undefined
    });

    await transaction.save();

    res.json({ 
      order,
      transactionId: transaction._id 
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(500).json({ message: 'Payment creation failed' });
  }
});

// Verify payment
router.post('/verify', auth, async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      transactionId 
    } = req.body;

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      // Update transaction
      const transaction = await Transaction.findById(transactionId);
      if (transaction) {
        transaction.status = 'completed';
        transaction.razorpayPaymentId = razorpay_payment_id;
        transaction.razorpaySignature = razorpay_signature;
        await transaction.save();

        // Update related booking or subscription
        if (transaction.relatedBooking) {
          const booking = await Booking.findById(transaction.relatedBooking);
          if (booking) {
            booking.paidAmount += transaction.amount;
            booking.paymentStatus = booking.paidAmount >= booking.totalAmount ? 'completed' : 'partial';
            booking.transactions.push(transaction._id);
            await booking.save();
          }
        }

        if (transaction.relatedSubscription) {
          const subscription = await MessSubscription.findById(transaction.relatedSubscription);
          if (subscription) {
            subscription.paidAmount += transaction.amount;
            subscription.paymentStatus = subscription.paidAmount >= subscription.totalAmount ? 'completed' : 'partial';
            subscription.transactions.push(transaction._id);
            await subscription.save();
          }
        }

        res.json({ 
          message: 'Payment verified successfully',
          transaction: transaction
        });
      } else {
        res.status(404).json({ message: 'Transaction not found' });
      }
    } else {
      // Update transaction as failed
      if (transactionId) {
        await Transaction.findByIdAndUpdate(transactionId, {
          status: 'failed',
          failureReason: 'Invalid signature'
        });
      }
      res.status(400).json({ message: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: 'Payment verification failed' });
  }
});

// Wallet recharge
router.post('/wallet/recharge', auth, async (req, res) => {
  try {
    const { amount, paymentMethod = 'razorpay' } = req.body;

    if (paymentMethod === 'razorpay') {
      // Create Razorpay order for wallet recharge
      const options = {
        amount: amount * 100,
        currency: 'INR',
        receipt: `wallet_recharge_${Date.now()}`,
        payment_capture: 1
      };

      const order = await razorpay.orders.create(options);

      const transaction = new Transaction({
        user: req.user._id,
        type: 'wallet_recharge',
        amount,
        currency: 'INR',
        status: 'pending',
        paymentMethod: 'razorpay',
        razorpayOrderId: order.id,
        description: 'Wallet recharge',
        walletBalance: {
          before: req.user.wallet.balance,
          after: req.user.wallet.balance + amount
        }
      });

      await transaction.save();

      res.json({ 
        order,
        transactionId: transaction._id 
      });
    } else {
      // Direct wallet recharge (for cash payments)
      const transaction = new Transaction({
        user: req.user._id,
        type: 'wallet_recharge',
        amount,
        currency: 'INR',
        status: 'completed',
        paymentMethod: 'cash',
        description: 'Wallet recharge (cash)',
        walletBalance: {
          before: req.user.wallet.balance,
          after: req.user.wallet.balance + amount
        }
      });

      await transaction.save();

      // Update user wallet
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { 'wallet.balance': amount },
        $push: { 'wallet.transactions': transaction._id }
      });

      res.json({ 
        message: 'Wallet recharged successfully',
        transaction: transaction
      });
    }
  } catch (error) {
    console.error('Wallet recharge error:', error);
    res.status(500).json({ message: 'Wallet recharge failed' });
  }
});

// Get user transactions
router.get('/transactions', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, type, status } = req.query;
    const skip = (page - 1) * limit;

    const filter = { user: req.user._id };
    if (type) filter.type = type;
    if (status) filter.status = status;

    const transactions = await Transaction.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('relatedBooking', 'room')
      .populate('relatedSubscription', 'messPlan');

    const total = await Transaction.countDocuments(filter);

    res.json({
      transactions,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
});

// Process refund
router.post('/refund', auth, async (req, res) => {
  try {
    const { transactionId, amount, reason } = req.body;

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.status !== 'completed') {
      return res.status(400).json({ message: 'Transaction is not completed' });
    }

    // Process refund through Razorpay if it was a Razorpay payment
    if (transaction.paymentMethod === 'razorpay' && transaction.razorpayPaymentId) {
      const refund = await razorpay.payments.refund(transaction.razorpayPaymentId, {
        amount: amount * 100,
        notes: {
          reason: reason
        }
      });

      transaction.status = 'refunded';
      transaction.refundAmount = amount;
      transaction.refundReason = reason;
      await transaction.save();

      // Update user wallet if refunding to wallet
      if (req.body.refundToWallet) {
        await User.findByIdAndUpdate(req.user._id, {
          $inc: { 'wallet.balance': amount },
          $push: { 'wallet.transactions': transaction._id }
        });
      }

      res.json({ 
        message: 'Refund processed successfully',
        refund: refund,
        transaction: transaction
      });
    } else {
      // Handle wallet/cash refunds
      transaction.status = 'refunded';
      transaction.refundAmount = amount;
      transaction.refundReason = reason;
      await transaction.save();

      // Update user wallet
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { 'wallet.balance': amount },
        $push: { 'wallet.transactions': transaction._id }
      });

      res.json({ 
        message: 'Refund processed successfully',
        transaction: transaction
      });
    }
  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({ message: 'Refund processing failed' });
  }
});

// Get wallet balance
router.get('/wallet/balance', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('wallet');
    res.json({ 
      balance: user.wallet.balance,
      currency: 'INR'
    });
  } catch (error) {
    console.error('Get wallet balance error:', error);
    res.status(500).json({ message: 'Failed to fetch wallet balance' });
  }
});

// Pay from wallet
router.post('/wallet/pay', auth, async (req, res) => {
  try {
    const { amount, type, relatedId, description } = req.body;

    const user = await User.findById(req.user._id);
    if (user.wallet.balance < amount) {
      return res.status(400).json({ message: 'Insufficient wallet balance' });
    }

    // Create transaction record
    const transaction = new Transaction({
      user: req.user._id,
      type,
      amount,
      currency: 'INR',
      status: 'completed',
      paymentMethod: 'wallet',
      description: description,
      relatedBooking: type === 'room_booking' ? relatedId : undefined,
      relatedSubscription: type === 'mess_subscription' ? relatedId : undefined,
      walletBalance: {
        before: user.wallet.balance,
        after: user.wallet.balance - amount
      }
    });

    await transaction.save();

    // Update user wallet
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'wallet.balance': -amount },
      $push: { 'wallet.transactions': transaction._id }
    });

    // Update related booking or subscription
    if (type === 'room_booking' && relatedId) {
      const booking = await Booking.findById(relatedId);
      if (booking) {
        booking.paidAmount += amount;
        booking.paymentStatus = booking.paidAmount >= booking.totalAmount ? 'completed' : 'partial';
        booking.transactions.push(transaction._id);
        await booking.save();
      }
    }

    if (type === 'mess_subscription' && relatedId) {
      const subscription = await MessSubscription.findById(relatedId);
      if (subscription) {
        subscription.paidAmount += amount;
        subscription.paymentStatus = subscription.paidAmount >= subscription.totalAmount ? 'completed' : 'partial';
        subscription.transactions.push(transaction._id);
        await subscription.save();
      }
    }

    res.json({ 
      message: 'Payment successful',
      transaction: transaction,
      newBalance: user.wallet.balance - amount
    });
  } catch (error) {
    console.error('Wallet payment error:', error);
    res.status(500).json({ message: 'Wallet payment failed' });
  }
});

module.exports = router; 