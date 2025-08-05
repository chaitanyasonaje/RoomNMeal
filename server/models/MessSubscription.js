const mongoose = require('mongoose');

const messSubscriptionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  messPlan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MessPlan',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'cancelled', 'completed'],
    default: 'active'
  },
  mealPreferences: {
    breakfast: { type: Boolean, default: true },
    lunch: { type: Boolean, default: true },
    dinner: { type: Boolean, default: true }
  },
  dietaryRestrictions: [String],
  totalAmount: {
    type: Number,
    required: true
  },
  paidAmount: {
    type: Number,
    default: 0
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'completed', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['razorpay', 'wallet', 'cash'],
    default: 'razorpay'
  },
  transactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  }],
  mealHistory: [{
    date: Date,
    breakfast: { served: Boolean, rating: Number },
    lunch: { served: Boolean, rating: Number },
    dinner: { served: Boolean, rating: Number }
  }],
  ratings: [{
    date: Date,
    rating: { type: Number, min: 1, max: 5 },
    comment: String
  }],
  complaints: [{
    date: Date,
    issue: String,
    status: { type: String, enum: ['open', 'resolved', 'closed'] },
    resolution: String
  }],
  pauseHistory: [{
    startDate: Date,
    endDate: Date,
    reason: String
  }],
  cancellationReason: String,
  refundAmount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

messSubscriptionSchema.methods.calculateRemainingDays = function() {
  const today = new Date();
  const end = new Date(this.endDate);
  const diffTime = end - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

messSubscriptionSchema.methods.calculateRefundAmount = function() {
  if (this.status === 'cancelled') {
    const remainingDays = this.calculateRemainingDays();
    const dailyRate = this.totalAmount / this.messPlan.duration;
    return remainingDays * dailyRate;
  }
  return 0;
};

messSubscriptionSchema.methods.addMealRating = function(date, mealType, rating, comment) {
  const existingRating = this.ratings.find(r => 
    r.date.toDateString() === date.toDateString()
  );
  
  if (existingRating) {
    existingRating.rating = rating;
    existingRating.comment = comment;
  } else {
    this.ratings.push({
      date,
      rating,
      comment
    });
  }
  
  return this.save();
};

messSubscriptionSchema.methods.pauseSubscription = function(startDate, endDate, reason) {
  this.status = 'paused';
  this.pauseHistory.push({
    startDate,
    endDate,
    reason
  });
  return this.save();
};

messSubscriptionSchema.methods.resumeSubscription = function() {
  this.status = 'active';
  return this.save();
};

messSubscriptionSchema.methods.cancelSubscription = function(reason) {
  this.status = 'cancelled';
  this.cancellationReason = reason;
  this.refundAmount = this.calculateRefundAmount();
  return this.save();
};

module.exports = mongoose.model('MessSubscription', messSubscriptionSchema); 