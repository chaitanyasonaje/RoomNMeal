const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['room_booking', 'mess_subscription', 'laundry_service', 'tea_service', 'wallet_recharge', 'refund'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['razorpay', 'wallet', 'cash'],
    required: true
  },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  description: String,
  relatedBooking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  relatedSubscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MessSubscription'
  },
  walletBalance: {
    before: Number,
    after: Number
  },
  metadata: {
    type: Map,
    of: String
  },
  failureReason: String,
  refundAmount: {
    type: Number,
    default: 0
  },
  refundReason: String
}, {
  timestamps: true
});

transactionSchema.methods.updateStatus = function(status, failureReason = null) {
  this.status = status;
  if (failureReason) {
    this.failureReason = failureReason;
  }
  return this.save();
};

transactionSchema.methods.processRefund = function(amount, reason) {
  this.status = 'refunded';
  this.refundAmount = amount;
  this.refundReason = reason;
  return this.save();
};

module.exports = mongoose.model('Transaction', transactionSchema); 